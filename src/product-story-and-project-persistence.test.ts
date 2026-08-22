import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const projectFunctions = readFileSync(new URL("./functions/projects.ts", import.meta.url), "utf8");
const projectRoute = readFileSync(new URL("./routes/dashboard.creator-project.tsx", import.meta.url), "utf8");
const publicPage = readFileSync(new URL("./components/public/public-page.tsx", import.meta.url), "utf8");
const productStory = readFileSync(new URL("./components/public/aurelia-product-story.tsx", import.meta.url), "utf8");

describe("live creator project persistence", () => {
  test("uses the authenticated server-side Supabase client and RLS-backed projects table", () => {
    expect(projectFunctions).toContain("getSupabaseServerClient");
    expect(projectFunctions).toContain('.from("projects")');
    expect(projectFunctions).toContain('state: "draft"');
    expect(projectFunctions).not.toMatch(/SERVICE_ROLE|SECRET_KEY|SUPABASE_SECRET/);
  });

  test("keeps project mutations constrained to the authenticated user's visible row", () => {
    expect(projectFunctions).toContain('.eq("id", data.projectId)');
    expect(projectFunctions).toContain('.in("state", ["draft", "rejected"])');
  });

  test("Creator Studio now exposes a real save action and saved-project list", () => {
    expect(projectRoute).toContain("createProjectFn");
    expect(projectRoute).toContain("updateProjectFn");
    expect(projectRoute).toContain("listMyProjectsFn");
    expect(projectRoute).toContain('onClick={() => void saveDraft()}');
    expect(projectRoute).toContain("Your recent projects");
  });
});

describe("homepage product storytelling", () => {
  test("puts an Aurelia workspace preview in the homepage hero and a product tour after it", () => {
    expect(publicPage).toContain("AureliaProductPreview");
    expect(publicPage).toContain("AureliaProductTour");
    expect(publicPage).toContain('pathname === "/"');
  });

  test("shows the protected workflow rather than invented customer metrics", () => {
    expect(productStory).toContain('title: "Create"');
    expect(productStory).toContain('title: "Approve"');
    expect(productStory).toContain('title: "Verify"');
    expect(productStory).toContain('title: "Keep"');
    expect(productStory).toContain("No public popularity metrics");
    expect(productStory).not.toMatch(/190\+|99\.9%|24\/7/);
  });
});
