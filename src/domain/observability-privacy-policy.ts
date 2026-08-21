export type TelemetryClass = "availability" | "performance" | "error" | "security" | "capacity";

export type TelemetryField =
  | "route_template"
  | "status_code"
  | "duration_bucket"
  | "service_name"
  | "error_code"
  | "request_id_hash"
  | "region_code"
  | "child_profile_id"
  | "email"
  | "full_ip"
  | "precise_location"
  | "project_title"
  | "project_body"
  | "search_term"
  | "ai_prompt"
  | "chat_text"
  | "safeguarding_summary";

const allowedFields: readonly TelemetryField[] = [
  "route_template",
  "status_code",
  "duration_bucket",
  "service_name",
  "error_code",
  "request_id_hash",
  "region_code",
];

export function telemetryFieldAllowed(field: TelemetryField): boolean {
  return allowedFields.includes(field);
}

export function childBehaviouralFunnelAllowed(): false {
  return false;
}

export function childCrossSessionAdvertisingIdentifierAllowed(): false {
  return false;
}

export function telemetryMayStoreRawRequestOrResponseBody(): false {
  return false;
}

export function telemetryMayStoreFullIpAddress(): false {
  return false;
}

export function safeRouteDimension(path: string): string {
  return path
    .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, ":id")
    .replace(/\/\d+(?=\/|$)/g, "/:id")
    .split("?")[0];
}

export function validTelemetryRetentionDays(days: number): boolean {
  return Number.isInteger(days) && days > 0 && days <= 90;
}

export function diagnosticCorrelationIdMayBeReversibleToChildIdentity(): false {
  return false;
}

export const OBSERVABILITY_PURPOSES: Record<TelemetryClass, string> = {
  availability: "Detect service availability failures.",
  performance: "Measure coarse service latency and capacity.",
  error: "Diagnose application errors without capturing user content.",
  security: "Detect and investigate security events under separate privileged controls.",
  capacity: "Plan infrastructure capacity from aggregate service demand.",
};
