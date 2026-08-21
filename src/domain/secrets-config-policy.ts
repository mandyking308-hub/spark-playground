export type Environment = "development" | "preview" | "staging" | "production";
export type ConfigClass = "public" | "server_config" | "secret_reference";
export type SecretState = "active" | "rotating" | "revoked" | "compromised";

export interface SecretChangeContext {
  environment: Environment;
  actorId: string;
  approverId?: string | null;
  stepUpVerified: boolean;
  changeTicketId: string;
}

export function browserConfigMayContainSecret(configClass: ConfigClass): boolean {
  return configClass === "public";
}

export function isBrowserSafeEnvName(name: string): boolean {
  const normalized = name.toUpperCase();
  const blocked = ["SERVICE_ROLE", "SECRET", "PRIVATE_KEY", "PASSWORD", "CLIENT_SECRET", "ACCESS_TOKEN", "REFRESH_TOKEN"];
  return !blocked.some((marker) => normalized.includes(marker));
}

export function secretValuesMayBeStoredInGovernanceTables(): false {
  return false;
}

export function productionSecretChangeAllowed(context: SecretChangeContext): boolean {
  if (context.environment !== "production") return context.stepUpVerified && Boolean(context.changeTicketId);
  return (
    context.stepUpVerified &&
    Boolean(context.changeTicketId) &&
    Boolean(context.approverId) &&
    context.actorId !== context.approverId
  );
}

export function compromisedSecretRequiresImmediateRevocation(state: SecretState): boolean {
  return state === "compromised";
}

export function validRotationWindowHours(hours: number): boolean {
  return Number.isInteger(hours) && hours > 0 && hours <= 24 * 30;
}

export function rotationMayLeaveOldSecretActiveAfterDeadline(): false {
  return false;
}

export function deploymentMayReadRawSecretFromClientBundle(): false {
  return false;
}

export function configChangeRequiresAudit(environment: Environment): boolean {
  return environment === "staging" || environment === "production";
}

export const SECRET_GOVERNANCE_PRINCIPLES = [
  "Secrets live in a dedicated secret manager or provider vault, never in source control.",
  "Application governance records store opaque provider references and metadata only.",
  "Production secret changes require step-up authentication and a distinct second approver.",
  "Compromised secrets are revoked immediately and linked to incident response.",
  "Rotations have explicit deadlines and old credentials cannot remain valid indefinitely.",
  "Browser bundles receive only values explicitly classified as public.",
] as const;
