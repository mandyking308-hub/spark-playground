import { describe, expect, it } from "bun:test";

import {
  childPreciseGeolocationEnabledByDefault,
  corsOriginAllowed,
  corsWildcardWithCredentialsAllowed,
  openRedirectAllowed,
  productionSecurityHeaders,
  redirectTargetAllowed,
  requestMayMutate,
  sessionCookieAttributes,
} from "./browser-api-security-policy";

describe("browser and API security", () => {
  it("requires same-origin and CSRF protection for cookie-authenticated mutations", () => {
    expect(requestMayMutate({ method: "POST", cookieAuthenticated: true, originMatchesApp: true, csrfTokenValid: true })).toBe(true);
    expect(requestMayMutate({ method: "POST", cookieAuthenticated: true, originMatchesApp: true, csrfTokenValid: false })).toBe(false);
    expect(requestMayMutate({ method: "DELETE", cookieAuthenticated: true, originMatchesApp: false, csrfTokenValid: true })).toBe(false);
  });

  it("allows safe read methods without CSRF mutation checks", () => {
    expect(requestMayMutate({ method: "GET", cookieAuthenticated: true, originMatchesApp: false, csrfTokenValid: false })).toBe(true);
  });

  it("uses exact CORS origins and never wildcard credentials", () => {
    expect(corsOriginAllowed("https://app.example.com", ["https://app.example.com"])).toBe(true);
    expect(corsOriginAllowed("https://evil.example", ["https://app.example.com"])).toBe(false);
    expect(corsOriginAllowed("*", ["*"])).toBe(false);
    expect(corsWildcardWithCredentialsAllowed()).toBe(false);
  });

  it("uses hardened session cookie defaults", () => {
    expect(sessionCookieAttributes()).toEqual({ httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  });

  it("allows only exact HTTPS redirect hosts", () => {
    expect(redirectTargetAllowed("https://school.example/path", ["school.example"])).toBe(true);
    expect(redirectTargetAllowed("http://school.example/path", ["school.example"])).toBe(false);
    expect(redirectTargetAllowed("https://evil.example/path", ["school.example"])).toBe(false);
    expect(redirectTargetAllowed("javascript:alert(1)", ["school.example"])).toBe(false);
    expect(openRedirectAllowed()).toBe(false);
  });

  it("defines restrictive production security headers", () => {
    const headers = productionSecurityHeaders();
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Strict-Transport-Security"]).toContain("max-age=31536000");
  });

  it("keeps precise child location off by default", () => {
    expect(childPreciseGeolocationEnabledByDefault()).toBe(false);
  });
});
