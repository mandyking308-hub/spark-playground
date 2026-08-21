export type HttpMethod = "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestSecurityContext {
  method: HttpMethod;
  cookieAuthenticated: boolean;
  originMatchesApp: boolean;
  csrfTokenValid: boolean;
}

export function requestMayMutate(context: RequestSecurityContext): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(context.method)) return true;
  if (!context.originMatchesApp) return false;
  if (context.cookieAuthenticated && !context.csrfTokenValid) return false;
  return true;
}

export function corsOriginAllowed(origin: string, allowedOrigins: readonly string[]): boolean {
  if (origin === "null" || origin === "*") return false;
  return allowedOrigins.includes(origin);
}

export function corsWildcardWithCredentialsAllowed(): false {
  return false;
}

export function sessionCookieAttributes() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  };
}

export function redirectTargetAllowed(target: string, allowedHosts: readonly string[]): boolean {
  try {
    const url = new URL(target);
    return url.protocol === "https:" && allowedHosts.includes(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function productionSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy": "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "geolocation=(), payment=(), usb=(), serial=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };
}

export function childPreciseGeolocationEnabledByDefault(): false {
  return false;
}

export function openRedirectAllowed(): false {
  return false;
}

export const BROWSER_API_SECURITY_PRINCIPLES = [
  "State-changing cookie-authenticated requests require same-origin validation and a valid CSRF token.",
  "Credentialed CORS never uses wildcard origins.",
  "Session cookies are HttpOnly, Secure and SameSite protected.",
  "External redirects use exact HTTPS host allowlists and reject embedded credentials.",
  "Production responses use restrictive CSP, anti-framing, nosniff, referrer and transport-security headers.",
  "Precise child geolocation remains disabled by default.",
] as const;
