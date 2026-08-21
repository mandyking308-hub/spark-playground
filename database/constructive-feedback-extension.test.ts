import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const rawSql = readFileSync(new URL("./constructive-feedback-extension.sql", import.meta.url), "utf8");
const sql = rawSql.replace(/--.*$/gm, "");

const tables = ["constructive_reactions", "constructive_reaction_events"];

describe("constructive feedback schema safety", () => {
  test("all feedback tables enable RLS", () => {
    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  test("peer feedback uses only curated constructive reactions", () => {
    expect(sql).toContain("'inspired_me','clear_explanation','creative_idea','great_teamwork'");
    expect(sql).not.toMatch(/\b(like|dislike|heart|downvote|upvote)\b/i);
  });

  test("feedback is bound to a verified learning context shape", () => {
    expect(sql).toContain("context_type text not null check (context_type in ('cohort','club','challenge'))");
    expect(sql).toContain("context_id uuid not null");
  });

  test("self-reactions are structurally blocked", () => {
    expect(sql).toContain("check (sender_profile_id <> recipient_profile_id)");
  });

  test("the schema contains no popularity or ranking fields", () => {
    expect(sql).not.toMatch(/\b(reaction_count|like_count|follower_count|popularity_score|rank_score|trending_score|leaderboard)\b/i);
  });

  test("there is no child free-text feedback body", () => {
    expect(sql).not.toMatch(/\b(comment_body|reaction_body|free_text|message_body)\b/i);
  });

  test("moderation/removal actions are auditable", () => {
    expect(sql).toContain("create table if not exists public.constructive_reaction_events");
    expect(sql).toContain("'created','removed','restored','moderation_flagged','moderation_cleared'");
  });

  test("there is no blanket authenticated allow policy", () => {
    expect(sql).not.toMatch(/to\s+authenticated[\s\S]{0,100}using\s*\(\s*true\s*\)/i);
  });
});
