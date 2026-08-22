import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const projectKind = z.enum(["podcast", "story", "book", "art", "video", "game", "general"]);

const createProjectInput = z.object({
  kind: projectKind,
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().max(4000).optional(),
});

const updateProjectInput = createProjectInput.extend({
  projectId: z.string().uuid(),
});

export interface ProjectSummary {
  id: string;
  kind: z.infer<typeof projectKind>;
  title: string;
  summary?: string;
  state: "draft" | "scan_pending" | "approval_pending" | "moderation_pending" | "published" | "rejected" | "removed";
  createdAt: string;
  updatedAt: string;
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

function mapProject(row: Record<string, unknown>): ProjectSummary {
  return {
    id: String(row["id"]),
    kind: row["kind"] as ProjectSummary["kind"],
    title: String(row["title"]),
    summary: typeof row["summary"] === "string" ? row["summary"] : undefined,
    state: row["state"] as ProjectSummary["state"],
    createdAt: String(row["created_at"]),
    updatedAt: String(row["updated_at"]),
  };
}

export const listMyProjectsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProjectSummary[]> => {
    const supabase = await requireAuthenticatedClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, kind, title, summary, state, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) throw new Error("Projects could not be loaded");
    return (data ?? []).map((row) => mapProject(row as Record<string, unknown>));
  },
);

export const createProjectFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createProjectInput.parse(input))
  .handler(async ({ data }): Promise<ProjectSummary> => {
    const supabase = await requireAuthenticatedClient();
    const { data: created, error } = await supabase
      .from("projects")
      .insert({
        kind: data.kind,
        title: data.title,
        summary: data.summary || null,
        state: "draft",
      })
      .select("id, kind, title, summary, state, created_at, updated_at")
      .single();

    if (error || !created) throw new Error("Project could not be saved");
    return mapProject(created as Record<string, unknown>);
  });

export const updateProjectFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => updateProjectInput.parse(input))
  .handler(async ({ data }): Promise<ProjectSummary> => {
    const supabase = await requireAuthenticatedClient();
    const { data: updated, error } = await supabase
      .from("projects")
      .update({
        kind: data.kind,
        title: data.title,
        summary: data.summary || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.projectId)
      .in("state", ["draft", "rejected"])
      .select("id, kind, title, summary, state, created_at, updated_at")
      .single();

    if (error || !updated) throw new Error("Project could not be updated");
    return mapProject(updated as Record<string, unknown>);
  });
