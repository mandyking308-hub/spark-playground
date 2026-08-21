import { describe, expect, test } from "bun:test";

import { coreLiveRlsScenarios, mandatoryDenyScenarioIds } from "./live-rls-matrix";

describe("live RLS adversarial matrix", () => {
  test("contains every mandatory denial scenario exactly once", () => {
    const byId = new Map(coreLiveRlsScenarios.map((scenario) => [scenario.id, scenario]));
    expect(byId.size).toBe(coreLiveRlsScenarios.length);

    for (const id of mandatoryDenyScenarioIds) {
      const scenario = byId.get(id);
      expect(scenario).toBeDefined();
      expect(scenario?.expected).toBe("deny");
    }
  });

  test("includes positive controls so a totally locked database cannot falsely pass", () => {
    expect(coreLiveRlsScenarios.some((scenario) => scenario.expected === "allow")).toBe(true);
    expect(coreLiveRlsScenarios.find((scenario) => scenario.id === "child-own-project-read")?.expected).toBe("allow");
    expect(coreLiveRlsScenarios.find((scenario) => scenario.id === "parent-own-link")?.expected).toBe("allow");
  });

  test("explicitly covers cross-child, cross-family, revoked and alumni boundaries", () => {
    const ids = coreLiveRlsScenarios.map((scenario) => scenario.id);
    expect(ids).toContain("child-cross-project-read");
    expect(ids).toContain("parent-cross-request");
    expect(ids).toContain("revoked-guardian-request");
    expect(ids).toContain("parent-alumni-child");
  });
});
