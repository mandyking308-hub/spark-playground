import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const form = readFileSync(new URL("./components/public/public-intake-form.tsx", import.meta.url), "utf8");
const bridge = readFileSync(new URL("./functions/public-intake.ts", import.meta.url), "utf8");
const reportRoute = readFileSync(new URL("./routes/report-concern.tsx", import.meta.url), "utf8");

describe("public intake UI", () => {
  test("does not collect child identity fields or persist submissions in browser storage", () => {
    expect(form).not.toMatch(/childName|childId|dateOfBirth|homeAddress/i);
    expect(form).not.toMatch(/localStorage\s*\.|sessionStorage\s*\./);
    expect(form).toContain("Include only the personal information needed");
  });

  test("keeps safeguarding identity optional", () => {
    expect(form).toContain('required={!isSafeguarding}');
    expect(reportRoute).toContain("You can report without giving your name or email");
  });

  test("requires a reply address and consent for ordinary enquiries", () => {
    expect(bridge).toContain('data.kind === "enquiry" && (!data.email || !data.contactPermitted)');
    expect(form).toContain('Aurelia may use the email above to respond to this enquiry.');
  });

  test("uses a bot honeypot without adding trackers or captcha providers", () => {
    expect(form).toContain('name="website"');
    expect(form).not.toMatch(/recaptcha|hcaptcha|turnstile|analytics|pixel/i);
  });
});
