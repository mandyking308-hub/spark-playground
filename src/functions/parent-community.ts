import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const profileInput = z.object({
  displayName: z.string().trim().max(120).optional(),
  headline: z.string().trim().max(180).optional(),
  region: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(1200).optional(),
  visible: z.boolean().default(true),
});

const profileIdInput = z.object({ profileId: z.string().uuid() });
const connectionResponseInput = z.object({
  connectionId: z.string().uuid(),
  response: z.enum(["accepted", "declined", "blocked"]),
});
const communityIdInput = z.object({ communityId: z.string().uuid() });
const postInput = communityIdInput.extend({ body: z.string().trim().min(1).max(4000) });
const eventRsvpInput = z.object({
  eventId: z.string().uuid(),
  response: z.enum(["going", "interested", "declined"]),
});

export interface AdultDirectoryProfile {
  profileId: string;
  displayName: string;
  headline?: string | undefined;
  region?: string | undefined;
  bio?: string | undefined;
  visible: boolean;
  updatedAt: string;
}

export interface AdultConnection {
  id: string;
  requesterProfileId: string;
  addresseeProfileId: string;
  status: "pending" | "accepted" | "declined" | "blocked";
  createdAt: string;
  respondedAt?: string | undefined;
}

export interface AdultCommunity {
  id: string;
  name: string;
  description?: string | undefined;
  communityType: "interest" | "profession" | "location" | "school" | "alumni" | "volunteering";
  status: "active" | "archived";
  createdAt: string;
}

export interface AdultCommunityMembership {
  id: string;
  communityId: string;
  status: "active" | "left" | "removed";
  memberRole: "member" | "host";
}

export interface AdultCommunityPost {
  id: string;
  communityId: string;
  authorProfileId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface AdultEvent {
  id: string;
  communityId?: string | undefined;
  title: string;
  description?: string | undefined;
  startsAt: string;
  endsAt?: string | undefined;
  locationText?: string | undefined;
  audience: "parents" | "parent_alumni" | "parents_and_alumni";
  status: "draft" | "active" | "cancelled" | "completed";
}

export interface AdultEventRsvp {
  id: string;
  eventId: string;
  response: "going" | "interested" | "declined";
}

async function requireAuthenticatedClient() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Authentication required");
  return supabase;
}

async function currentProfile(supabase: Awaited<ReturnType<typeof requireAuthenticatedClient>>) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, primary_role")
    .single();
  if (error || !data) throw new Error("Profile not available");
  if (data.primary_role !== "parent" && data.primary_role !== "parent_alumni") {
    throw new Error("Parent community requires an adult parent profile");
  }
  return data;
}

function mapDirectory(row: Record<string, unknown>): AdultDirectoryProfile {
  return {
    profileId: String(row["profile_id"]),
    displayName: String(row["display_name"]),
    headline: typeof row["headline"] === "string" ? row["headline"] : undefined,
    region: typeof row["region"] === "string" ? row["region"] : undefined,
    bio: typeof row["bio"] === "string" ? row["bio"] : undefined,
    visible: Boolean(row["visible"]),
    updatedAt: String(row["updated_at"]),
  };
}

export const getParentCommunityIdentityFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await requireAuthenticatedClient();
  const profile = await currentProfile(supabase);
  return { profileId: String(profile.id), displayName: String(profile.display_name) };
});

export const listAdultDirectoryFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdultDirectoryProfile[]> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data, error } = await supabase
      .from("adult_directory_profiles")
      .select("profile_id, display_name, headline, region, bio, visible, updated_at")
      .order("display_name", { ascending: true });
    if (error) throw new Error("Directory could not be loaded");
    return (data ?? []).map((row) => mapDirectory(row as Record<string, unknown>));
  },
);

export const upsertAdultDirectoryProfileFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => profileInput.parse(input))
  .handler(async ({ data }): Promise<AdultDirectoryProfile> => {
    const supabase = await requireAuthenticatedClient();
    const profile = await currentProfile(supabase);
    const displayName = data.displayName?.trim() || String(profile.display_name);
    const { data: saved, error } = await supabase
      .from("adult_directory_profiles")
      .upsert(
        {
          profile_id: profile.id,
          display_name: displayName,
          headline: data.headline || null,
          region: data.region || null,
          bio: data.bio || null,
          visible: data.visible,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "profile_id" },
      )
      .select("profile_id, display_name, headline, region, bio, visible, updated_at")
      .single();
    if (error || !saved) throw new Error("Directory profile could not be saved");
    return mapDirectory(saved as Record<string, unknown>);
  });

export const listAdultConnectionsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdultConnection[]> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data, error } = await supabase
      .from("adult_connections")
      .select("id, requester_profile_id, addressee_profile_id, status, created_at, responded_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Connections could not be loaded");
    return (data ?? []).map((row) => ({
      id: String(row.id),
      requesterProfileId: String(row.requester_profile_id),
      addresseeProfileId: String(row.addressee_profile_id),
      status: row.status as AdultConnection["status"],
      createdAt: String(row.created_at),
      respondedAt: typeof row.responded_at === "string" ? row.responded_at : undefined,
    }));
  },
);

export const requestAdultConnectionFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => profileIdInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const supabase = await requireAuthenticatedClient();
    const profile = await currentProfile(supabase);
    if (String(profile.id) === data.profileId) throw new Error("Cannot connect to yourself");
    const { error } = await supabase
      .from("adult_connections")
      .insert({ addressee_profile_id: data.profileId, status: "pending" });
    if (error) throw new Error("Connection request could not be sent");
    return { ok: true };
  });

export const respondAdultConnectionFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => connectionResponseInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { error } = await supabase.rpc("respond_adult_connection", {
      p_connection_id: data.connectionId,
      p_response: data.response,
    });
    if (error) throw new Error("Connection response could not be saved");
    return { ok: true };
  });

export const listAdultCommunitiesFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdultCommunity[]> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data, error } = await supabase
      .from("adult_communities")
      .select("id, name, description, community_type, status, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: true });
    if (error) throw new Error("Communities could not be loaded");
    return (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      description: typeof row.description === "string" ? row.description : undefined,
      communityType: row.community_type as AdultCommunity["communityType"],
      status: row.status as AdultCommunity["status"],
      createdAt: String(row.created_at),
    }));
  },
);

export const listMyAdultCommunityMembershipsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdultCommunityMembership[]> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data, error } = await supabase
      .from("adult_community_memberships")
      .select("id, community_id, member_role, status")
      .order("joined_at", { ascending: true });
    if (error) throw new Error("Memberships could not be loaded");
    return (data ?? []).map((row) => ({
      id: String(row.id),
      communityId: String(row.community_id),
      memberRole: row.member_role as AdultCommunityMembership["memberRole"],
      status: row.status as AdultCommunityMembership["status"],
    }));
  },
);

export const joinAdultCommunityFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => communityIdInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data: existing, error: lookupError } = await supabase
      .from("adult_community_memberships")
      .select("id")
      .eq("community_id", data.communityId)
      .maybeSingle();
    if (lookupError) throw new Error("Community membership could not be checked");

    if (existing?.id) {
      const { error } = await supabase
        .from("adult_community_memberships")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) throw new Error("Community could not be rejoined");
    } else {
      const { error } = await supabase
        .from("adult_community_memberships")
        .insert({ community_id: data.communityId, status: "active", member_role: "member" });
      if (error) throw new Error("Community could not be joined");
    }

    return { ok: true };
  });

export const listAdultCommunityPostsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => communityIdInput.parse(input))
  .handler(async ({ data }): Promise<AdultCommunityPost[]> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data: posts, error } = await supabase
      .from("adult_community_posts")
      .select("id, community_id, author_profile_id, body, created_at")
      .eq("community_id", data.communityId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error("Posts could not be loaded");
    const authorIds = [...new Set((posts ?? []).map((row) => String(row.author_profile_id)))];
    const { data: authors } = authorIds.length
      ? await supabase.from("adult_directory_profiles").select("profile_id, display_name").in("profile_id", authorIds)
      : { data: [] as Array<{ profile_id: string; display_name: string }> };
    const names = new Map((authors ?? []).map((author) => [String(author.profile_id), String(author.display_name)]));
    return (posts ?? []).map((row) => ({
      id: String(row.id),
      communityId: String(row.community_id),
      authorProfileId: String(row.author_profile_id),
      authorName: names.get(String(row.author_profile_id)) ?? "Verified parent",
      body: String(row.body),
      createdAt: String(row.created_at),
    }));
  });

export const createAdultCommunityPostFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => postInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { error } = await supabase
      .from("adult_community_posts")
      .insert({ community_id: data.communityId, body: data.body });
    if (error) throw new Error("Post could not be shared");
    return { ok: true };
  });

export const listAdultEventsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdultEvent[]> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data, error } = await supabase
      .from("adult_events")
      .select("id, community_id, title, description, starts_at, ends_at, location_text, audience, status")
      .eq("status", "active")
      .order("starts_at", { ascending: true });
    if (error) throw new Error("Events could not be loaded");
    return (data ?? []).map((row) => ({
      id: String(row.id),
      communityId: typeof row.community_id === "string" ? row.community_id : undefined,
      title: String(row.title),
      description: typeof row.description === "string" ? row.description : undefined,
      startsAt: String(row.starts_at),
      endsAt: typeof row.ends_at === "string" ? row.ends_at : undefined,
      locationText: typeof row.location_text === "string" ? row.location_text : undefined,
      audience: row.audience as AdultEvent["audience"],
      status: row.status as AdultEvent["status"],
    }));
  },
);

export const listMyAdultEventRsvpsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdultEventRsvp[]> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data, error } = await supabase
      .from("adult_event_rsvps")
      .select("id, event_id, response");
    if (error) throw new Error("RSVPs could not be loaded");
    return (data ?? []).map((row) => ({
      id: String(row.id),
      eventId: String(row.event_id),
      response: row.response as AdultEventRsvp["response"],
    }));
  },
);

export const setAdultEventRsvpFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => eventRsvpInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const supabase = await requireAuthenticatedClient();
    await currentProfile(supabase);
    const { data: existing, error: lookupError } = await supabase
      .from("adult_event_rsvps")
      .select("id")
      .eq("event_id", data.eventId)
      .maybeSingle();
    if (lookupError) throw new Error("RSVP could not be checked");

    if (existing?.id) {
      const { error } = await supabase
        .from("adult_event_rsvps")
        .update({ response: data.response, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) throw new Error("RSVP could not be updated");
    } else {
      const { error } = await supabase
        .from("adult_event_rsvps")
        .insert({ event_id: data.eventId, response: data.response });
      if (error) throw new Error("RSVP could not be saved");
    }

    return { ok: true };
  });
