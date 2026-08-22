import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { SessionActor } from "@/data/platform-contracts";
import type { PlatformRole } from "@/domain/access-control";
import { authenticatedHomeForRole, type AuthenticatedHomeRoute } from "@/domain/auth-routing";
import { getSupabaseServerClient } from "@/lib/supabase/server-client";

export interface AuthenticatedActor extends SessionActor {
  email: string;
  displayName: string;
}

const platformRoles = new Set<PlatformRole>([
  "child",
  "parent",
  "parent_alumni",
  "teacher",
  "school_admin",
  "group_admin",
  "organisation_admin",
  "alumni",
  "mentor",
  "platform_admin",
]);

const signInInput = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

const invitationTokenPattern = /^[A-Za-z0-9_-]{40,80}$/;

const joinInput = z.object({
  invitationToken: z.string().regex(invitationTokenPattern),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128),
  displayName: z.string().trim().min(1).max(120),
  countryCode: z.string().trim().regex(/^[A-Za-z]{2}$/).optional(),
});

type SupabaseServerClient = ReturnType<typeof getSupabaseServerClient>;

async function loadAuthenticatedActor(
  supabase: SupabaseServerClient,
  user: { id: string; email?: string | null },
): Promise<AuthenticatedActor | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,auth_user_id,display_name,primary_role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError) throw new Error("Unable to resolve Aurelia profile");
  if (!profile || !platformRoles.has(profile.primary_role as PlatformRole)) return null;

  const role = profile.primary_role as PlatformRole;
  const [schoolMemberships, groupMemberships] = await Promise.all([
    supabase.from("school_memberships").select("school_id").eq("status", "active"),
    supabase.from("group_memberships").select("education_group_id").eq("status", "active"),
  ]);

  if (schoolMemberships.error || groupMemberships.error) {
    throw new Error("Unable to resolve Aurelia workspace memberships");
  }

  return {
    profileId: profile.id,
    authUserId: profile.auth_user_id,
    role,
    email: user.email ?? "",
    displayName: profile.display_name,
    schoolIds: (schoolMemberships.data ?? []).map((row) => row.school_id),
    educationGroupIds: (groupMemberships.data ?? []).map((row) => row.education_group_id),
    organisationIds: [],
  };
}

async function invitationIsClaimable(
  supabase: SupabaseServerClient,
  invitationToken: string,
): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke("invitation-preflight", {
    body: { invitationToken },
  });

  if (error) return false;
  return data?.data?.valid === true;
}

async function claimInvitation(
  supabase: SupabaseServerClient,
  input: z.infer<typeof joinInput>,
): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke("identity-provisioning", {
    body: {
      action: "claim_invitation",
      invitationToken: input.invitationToken,
      displayName: input.displayName,
      countryCode: input.countryCode?.toUpperCase(),
    },
  });

  return !error && Boolean(data?.data?.profile_id);
}

async function createSponsoredChildAccount(
  supabase: SupabaseServerClient,
  input: z.infer<typeof joinInput>,
): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke("child-invitation-signup", {
    body: {
      invitationToken: input.invitationToken,
      displayName: input.displayName,
      email: input.email,
      password: input.password,
      countryCode: input.countryCode?.toUpperCase(),
    },
  });

  return !error && data?.data?.created === true && data?.data?.role === "child";
}

export const getCurrentActorFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return loadAuthenticatedActor(supabase, user);
});

export const signInFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => signInInput.parse(input))
  .handler(async ({ data }): Promise<
    | { ok: true; redirectTo: AuthenticatedHomeRoute }
    | { ok: false; error: string }
  > => {
    const supabase = getSupabaseServerClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.user) {
      return { ok: false, error: "We couldn't sign you in with those details." };
    }

    const actor = await loadAuthenticatedActor(supabase, authData.user);
    if (!actor) {
      await supabase.auth.signOut();
      return { ok: false, error: "This account has not been provisioned for Aurelia." };
    }

    return { ok: true, redirectTo: authenticatedHomeForRole(actor.role) };
  });

export const joinWithInvitationFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => joinInput.parse(input))
  .handler(async ({ data }): Promise<
    | { ok: true; redirectTo: AuthenticatedHomeRoute }
    | { ok: false; confirmationRequired?: boolean; error: string }
  > => {
    const supabase = getSupabaseServerClient();

    // Validate only the opaque bearer token before creating an Auth record.
    // The preflight deliberately returns no role, tenant, sponsor or child data.
    if (!(await invitationIsClaimable(supabase, data.invitationToken))) {
      return { ok: false, error: "That invitation is invalid or has expired." };
    }

    // A confirmed account may be returning to finish claiming its invitation.
    // The same generic form is used for new and returning users to avoid account enumeration.
    let user = null as { id: string; email?: string | null } | null;
    let invitationAlreadyClaimed = false;

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (!signInError && signInData.user) {
      user = signInData.user;
    } else {
      // Sponsored under-16 accounts do not depend on outbound confirmation email.
      // A live one-time child invitation issued by a verified parent/school is the onboarding credential.
      const childCreated = await createSponsoredChildAccount(supabase, data);

      if (childCreated) {
        invitationAlreadyClaimed = true;
        const { data: childSignInData, error: childSignInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (childSignInError || !childSignInData.user) {
          return { ok: false, error: "Your child workspace was created, but we couldn't sign you in. Please use the sign-in page with the same details." };
        }

        user = childSignInData.user;
      } else {
        // Non-child invitations keep normal email-confirmation onboarding.
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (signUpError || !signUpData.user) {
          return { ok: false, error: "We couldn't create or continue that account." };
        }

        if (!signUpData.session) {
          return {
            ok: false,
            confirmationRequired: true,
            error: "Check your email to confirm the address, then return here with the same invitation and sign-in details to finish joining Aurelia.",
          };
        }

        user = signUpData.user;
      }
    }

    if (!invitationAlreadyClaimed && !(await claimInvitation(supabase, data))) {
      await supabase.auth.signOut();
      return { ok: false, error: "That invitation could not be claimed." };
    }

    const actor = await loadAuthenticatedActor(supabase, user);
    if (!actor) {
      await supabase.auth.signOut();
      return { ok: false, error: "Your Aurelia workspace could not be resolved." };
    }

    return { ok: true, redirectTo: authenticatedHomeForRole(actor.role) };
  });

export const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return { ok: true } as const;
});