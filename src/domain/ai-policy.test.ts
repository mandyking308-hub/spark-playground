import { describe, expect, test } from "bun:test";

import { childAiDataPrinciples, evaluateChildAi } from "./ai-policy";

describe("child AI policy", () => {
  test("blocks AI companions regardless of age or permissions", () => {
    const result = evaluateChildAi({
      ageBand: "13_15",
      intent: "ai_companion",
      parentAiEnabled: true,
      schoolAiEnabled: true,
    });
    expect(result.decision).toBe("block");
  });

  test("turns finished-assignment generation into guided support", () => {
    const result = evaluateChildAi({
      ageBand: "13_15",
      intent: "write_entire_assignment",
      parentAiEnabled: true,
      schoolAiEnabled: true,
    });
    expect(result.decision).toBe("guided");
  });

  test("allows bounded age-appropriate creative support", () => {
    const result = evaluateChildAi({
      ageBand: "9_12",
      intent: "story_structure",
      parentAiEnabled: true,
      schoolAiEnabled: true,
    });
    expect(result.decision).toBe("allow");
  });

  test("parent or school can disable AI", () => {
    expect(
      evaluateChildAi({
        ageBand: "9_12",
        intent: "translation",
        parentAiEnabled: false,
        schoolAiEnabled: true,
      }).decision,
    ).toBe("block");
  });

  test("child prompts are not retained by default and never become training data by policy", () => {
    expect(childAiDataPrinciples.promptContentRetentionByDefault).toBe(false);
    expect(childAiDataPrinciples.trainOnChildContent).toBe(false);
    expect(childAiDataPrinciples.behaviouralAdvertising).toBe(false);
  });
});
