import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "src/data/platform-contracts.ts"), "utf8");

describe("live backend API contract", () => {
  test("project creation derives ownership from the authenticated session", () => {
    const projectWriteBlock = source.split("export interface ProjectWriteRepository")[1]?.split(
      "export interface GuardianControlRepository",
    )[0];
    expect(projectWriteBlock).toBeTruthy();
    expect(projectWriteBlock).not.toContain("ownerProfileId");
  });

  test("guardian decisions derive parent identity from the session", () => {
    const guardianBlock = source.split("export interface GuardianControlRepository")[1]?.split(
      "export interface PlatformDataServices",
    )[0];
    expect(guardianBlock).toBeTruthy();
    expect(guardianBlock).not.toContain("parentProfileId");
  });

  test("parent approval acts on a permission request rather than arbitrary project access", () => {
    expect(source).toContain("permissionRequestId: EntityId");
    expect(source).toContain("getGuardianApprovalQueue(): Promise<GuardianApprovalSummary[]>");
    expect(source).not.toContain("getChildProjects(childProfileId");
  });

  test("child project read API is self-scoped", () => {
    expect(source).toContain("getOwnProjects(): Promise<ProjectSummary[]>");
  });
});
