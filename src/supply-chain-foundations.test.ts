import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

describe("CI supply-chain foundations", () => {
  it("pins GitHub actions to immutable commits", () => {
    expect(workflow).toMatch(/uses: actions\/checkout@[0-9a-f]{40}/);
    expect(workflow).toMatch(/uses: oven-sh\/setup-bun@[0-9a-f]{40}/);
    expect(workflow).not.toMatch(/uses: .*@(v\d+|main|master|latest)\b/);
  });

  it("pins Bun rather than using latest", () => {
    expect(workflow).toContain("bun-version: 1.4.0");
    expect(workflow).not.toContain("bun-version: latest");
  });

  it("uses frozen lockfile installation", () => {
    expect(workflow).toContain("bun install --frozen-lockfile");
  });

  it("keeps CI token permissions read-only", () => {
    expect(workflow).toContain("permissions:\n  contents: read");
    expect(workflow).not.toMatch(/contents:\s+write/);
  });
});
