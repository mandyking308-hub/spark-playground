import { describe, expect, it } from "bun:test";

import {
  browserConfigMayContainSecret,
  compromisedSecretRequiresImmediateRevocation,
  configChangeRequiresAudit,
  deploymentMayReadRawSecretFromClientBundle,
  isBrowserSafeEnvName,
  productionSecretChangeAllowed,
  rotationMayLeaveOldSecretActiveAfterDeadline,
  secretValuesMayBeStoredInGovernanceTables,
  validRotationWindowHours,
} from "./secrets-config-policy";

describe("secrets and configuration governance", () => {
  it("blocks secret classes from browser configuration", () => {
    expect(browserConfigMayContainSecret("public")).toBe(true);
    expect(browserConfigMayContainSecret("server_config")).toBe(false);
    expect(browserConfigMayContainSecret("secret_reference")).toBe(false);
    expect(deploymentMayReadRawSecretFromClientBundle()).toBe(false);
  });

  it("rejects common secret-like browser environment names", () => {
    expect(isBrowserSafeEnvName("VITE_SUPABASE_URL")).toBe(true);
    expect(isBrowserSafeEnvName("VITE_SUPABASE_PUBLISHABLE_KEY")).toBe(true);
    expect(isBrowserSafeEnvName("SUPABASE_SERVICE_ROLE_KEY")).toBe(false);
    expect(isBrowserSafeEnvName("OPENAI_CLIENT_SECRET")).toBe(false);
    expect(isBrowserSafeEnvName("DATABASE_PASSWORD")).toBe(false);
  });

  it("never stores raw secret values in governance metadata", () => {
    expect(secretValuesMayBeStoredInGovernanceTables()).toBe(false);
  });

  it("requires two distinct people plus step-up auth for production changes", () => {
    const base = { environment: "production" as const, actorId: "actor-1", stepUpVerified: true, changeTicketId: "chg-1" };
    expect(productionSecretChangeAllowed({ ...base, approverId: "approver-2" })).toBe(true);
    expect(productionSecretChangeAllowed({ ...base, approverId: "actor-1" })).toBe(false);
    expect(productionSecretChangeAllowed({ ...base, approverId: null })).toBe(false);
    expect(productionSecretChangeAllowed({ ...base, approverId: "approver-2", stepUpVerified: false })).toBe(false);
  });

  it("forces compromised secrets into immediate revocation", () => {
    expect(compromisedSecretRequiresImmediateRevocation("compromised")).toBe(true);
    expect(compromisedSecretRequiresImmediateRevocation("rotating")).toBe(false);
  });

  it("keeps rotation windows bounded and cannot leave old keys alive forever", () => {
    expect(validRotationWindowHours(24)).toBe(true);
    expect(validRotationWindowHours(24 * 30)).toBe(true);
    expect(validRotationWindowHours(24 * 31)).toBe(false);
    expect(rotationMayLeaveOldSecretActiveAfterDeadline()).toBe(false);
  });

  it("audits staging and production configuration changes", () => {
    expect(configChangeRequiresAudit("development")).toBe(false);
    expect(configChangeRequiresAudit("preview")).toBe(false);
    expect(configChangeRequiresAudit("staging")).toBe(true);
    expect(configChangeRequiresAudit("production")).toBe(true);
  });
});
