import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const createCommunityInput = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1200).optional(),
  communityType: z.enum(["interest", "profession", "location", "school", "alumni", "volunteering"]).default("interest"),
});

const createEventInput = z.object({
  communityId: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(3000).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  locationText: z.string().trim().max(240).optional(),
  audience: z.enum(["parents", "parent_alumni", "parents_and_alumni"]).default("parents_and_alumni"),
});

async function requireParentClient() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Authentication required");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, primary_role")
    .single();
  if (error || !profile || (profile.primary_role !== "parent" && profile.primary_role !== "parent_alumni")) {
    throw new Error("Parent community requires an eligible adult parent profile");
  }
  return { supabase, profile };
}

export const createAdultCommunityFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createCommunityInput.parse(input))
  .handler(async ({ data }): Promise<{ communityId: string }> => {
    const { supabase } = await requireParentClient();
    const { data: community, error } = await supabase
      .from("adult_communities")
      .insert({
        name: data.name,
        description: data.description || null,
        community_type: data.communityType,
        status: "active",
      })
      .select("id")
      .single();
    if (error || !community) throw new Error("Community could not be created");

    const { error: membershipError } = await supabase
      .from("adult_community_memberships")
      .insert({ community_id: community.id, member_role: "member", status: "active" });
    if (membershipError) throw new Error("Community was created but membership could not be activated");

    return { communityId: String(community.id) };
  });

export const createAdultEventFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createEventInput.parse(input))
  .handler(async ({ data }): Promise<{ eventId: string }> => {
    const { supabase } = await requireParentClient();
    if (data.endsAt && new Date(data.endsAt).getTime() <= new Date(data.startsAt).getTime()) {
      throw new Error("Event end must be after start");
    }

    const { data: event, error } = await supabase
      .from("adult_events")
      .insert({
        community_id: data.communityId || null,
        title: data.title,
        description: data.description || null,
        starts_at: data.startsAt,
        ends_at: data.endsAt || null,
        location_text: data.locationText || null,
        audience: data.audience,
        status: "active",
      })
      .select("id")
      .single();
    if (error || !event) throw new Error("Event could not be created");
    return { eventId: String(event.id) };
  });
