import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const responseInput = z.object({
  connectionId: z.string().uuid(),
  response: z.enum(["accepted", "declined", "blocked"]),
});

export const respondAdultConnectionRlsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => responseInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Authentication required");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, primary_role")
      .single();
    if (
      profileError ||
      !profile ||
      (profile.primary_role !== "parent" && profile.primary_role !== "parent_alumni")
    ) {
      throw new Error("Parent community requires an eligible adult parent profile");
    }

    const { data: updated, error } = await supabase
      .from("adult_connections")
      .update({ status: data.response, responded_at: new Date().toISOString() })
      .eq("id", data.connectionId)
      .eq("status", "pending")
      .select("id")
      .single();

    if (error || !updated) throw new Error("Connection response could not be saved");
    return { ok: true };
  });
