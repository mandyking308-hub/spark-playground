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

export const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return { ok: true } as const;
});
