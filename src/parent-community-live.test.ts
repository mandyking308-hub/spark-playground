import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const backend = readFileSync(new URL("./functions/parent-community.ts", import.meta.url), "utf8");
const organiser = readFileSync(new URL("./functions/parent-community-organise.ts", import.meta.url), "utf8");
const directoryRoute = readFileSync(new URL("./routes/dashboard.parent-directory.tsx", import.meta.url), "utf8");
const circleRoute = readFileSync(new URL("./routes/dashboard.parent-circle.tsx", import.meta.url), "utf8");
const eventRoute = readFileSync(new URL("./routes/dashboard.parent-event.tsx", import.meta.url), "utf8");
const schema = readFileSync(new URL("../database/parent-community-live-extension.sql", import.meta.url), "utf8");
const connectionRls = readFileSync(new URL("../database/parent-community-connection-rls.sql", import.meta.url), "utf8");
const connectionInvoker = readFileSync(new URL("../database/parent-community-connection-invoker.sql", import.meta.url), "utf8");

describe("adult-only parent community backend", () => {
  test("creates a dedicated adult data model without child-content foreign keys", () => {
    for (const table of [
      "adult_directory_profiles",
      "adult_communities",
      "adult_community_memberships",
      "adult_community_posts",
      "adult_connections",
      "adult_events",
      "adult_event_rsvps",
    ]) {
      expect(schema).toContain(`public.${table}`);
    }

    const adultSchema = schema.split("create table if not exists public.adult_directory_profiles")[1] ?? "";
    expect(adultSchema).not.toMatch(/child_profile_id|project_id|passport|guardian_link/);
  });

  test("restricts community access to parent and Parent Alumni profiles", () => {
    expect(schema).toContain("viewer.primary_role in ('parent', 'parent_alumni')");
    expect(schema).toContain("self.primary_role in ('parent', 'parent_alumni')");
    expect(backend).toContain('data.primary_role !== "parent" && data.primary_role !== "parent_alumni"');
    expect(organiser).toContain('profile.primary_role !== "parent" && profile.primary_role !== "parent_alumni"');
  });

  test("connection responses are authorised by RLS and the RPC is security invoker", () => {
    expect(connectionRls).toContain("adult_connections_addressee_update");
    expect(connectionRls).toContain("addressee_profile_id = public.current_profile_id()");
    expect(connectionInvoker).toContain("security invoker");
    expect(connectionInvoker).not.toContain("security definer");
  });
});

describe("live parent community screens", () => {
  test("directory uses live profiles and connection actions instead of demo adults", () => {
    expect(directoryRoute).toContain("listAdultDirectoryFn");
    expect(directoryRoute).toContain("requestAdultConnectionFn");
    expect(directoryRoute).toContain("upsertAdultDirectoryProfileFn");
    expect(directoryRoute).not.toContain("Alex Morgan");
    expect(directoryRoute).not.toContain("Priya Shah");
    expect(directoryRoute).not.toContain("Daniel Rossi");
  });

  test("circles can be created, joined and posted to", () => {
    expect(circleRoute).toContain("createAdultCommunityFn");
    expect(circleRoute).toContain("joinAdultCommunityFn");
    expect(circleRoute).toContain("createAdultCommunityPostFn");
    expect(circleRoute).not.toContain("I can host a short founder Q&A");
  });

  test("events can be created and RSVPed to", () => {
    expect(eventRoute).toContain("createAdultEventFn");
    expect(eventRoute).toContain("setAdultEventRsvpFn");
    expect(eventRoute).not.toContain("24 September");
  });
});
