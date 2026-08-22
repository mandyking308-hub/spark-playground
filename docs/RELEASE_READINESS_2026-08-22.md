# Aurelia World — release readiness

Date: **22 August 2026**

Status: **CODE/PRODUCT GATE PASSED; GSM legal pack prepared for counsel review; custom domain live; ready for final hardening and Dodo proof on 23 August 2026.**

## Corporate / brand / domain

- Legal operator and contracting entity: **Global Solutions Management LLC**, a Delaware limited liability company (GSM).
- Product/brand: **AURELIA WORLD**. Aurelia World is not presented as a separate legal entity.
- Permanent domain: **https://theaureliaworld.com**.
- Production verification confirms the former `https://aurelia-world.lovable.app` address redirects to `https://theaureliaworld.com` and checked routes resolve over HTTPS with final HTTP 200.
- Formal trademark clearance for AURELIA WORLD remains required before material paid acquisition or formal filing.

## Automated verification baseline

Final verification before the GSM legal-page pass:

- **558 / 558 tests passed**.
- **92 test files**.
- **1,635 assertions**.
- TypeScript typecheck: **0 errors**.
- Production build: **PASS**.
- No broken imports/routes identified.
- No service-role or secret credentials exposed in browser/VITE code.

A complete test/type/build/browser verification must be rerun after the legal/translation changes before the next production lock.

## GSM legal launch pack — prepared

Public legal surfaces now identify GSM as operator and are aligned more closely to the actual product architecture:

- `src/routes/terms-of-use.tsx`
- `src/routes/privacy-policy.tsx`
- `src/routes/privacy-for-children.tsx`
- `src/routes/cookie-notice.tsx`
- `src/routes/data-protection-for-schools.tsx`
- `src/routes/community-standards.tsx`

Counsel-review materials:

- `docs/legal/GSM_GLOBAL_LEGAL_LAUNCH_PACK_2026-08-22.md`
- `docs/legal/GSM_AURELIA_WORLD_DPA_TEMPLATE.md`
- `docs/legal/CHILD_SAFETY_PRIVACY_RISK_ASSESSMENT_2026-08-22.md`
- `docs/BRAND_CLEARANCE.md`

The legal strategy deliberately does **not** claim that disclaimers remove GSM's own child-safety, privacy, platform or consumer-law duties. It layers contracts, technical controls, operational records, insurance and jurisdiction-specific counsel review.

## Gary / counsel morning review

Gary should review, in order:

1. global legal launch pack;
2. Terms of Use;
3. Privacy Policy;
4. child-friendly Privacy Notice;
5. Cookie & Local Storage Notice;
6. Community Standards;
7. school/organisation public data-protection summary;
8. DPA template;
9. Child Safety, Privacy and Online-Service Risk Assessment;
10. brand-clearance note.

Key counsel decisions are listed in the global legal launch pack and include trademark, GSM notice details, UK/EU/US territorial requirements, child/privacy representative requirements, Online Safety/DSA scope, COPPA/FERPA school flows, consumer subscription/cancellation rules, institutional MSA/DPA, copyright/DMCA process and insurance/liability alignment.

## Global public translation — privacy hardened

Aurelia World uses the same GTranslate family of tooling previously used on Global Health Access Trust, but the Aurelia World implementation is now **explicitly opt-in**.

- No third-party translation script loads on a public page until the visitor chooses **Enable languages**.
- Once enabled, the public language selector supports GTranslate's language set with native language names.
- The preference can be turned off; translation cookies/chrome are removed and the original page is restored.
- Public legal text remains English source text; automated translations are convenience translations, not a substitute for a legally required authoritative local-language notice.

The third-party translation script is always excluded from sensitive/private routes:

- `/auth/*`
- `/dashboard/*`
- `/alumni/*` (private 16+ environment)
- `/contact-enquiry`
- `/report-concern`

Inputs, textareas, selects, editable content, code, contact links, payment-related iframes, sensitive field descriptors and Aurelia World brand terms are protected from page translation.

## Child safety / sharing gate

Verified architecture remains:

`draft → scan_pending → approval_pending → moderation_pending → published`

- No child public-directory bypass.
- Parent/school sponsorship does not grant generic access to private child drafts.
- Guardian approval does not itself publish.
- Public release remains safety/moderation gated.
- Community Standards no longer overclaim that automated scanning is live merely because a project enters `scan_pending`.
- Private media uploads remain disabled until quarantine/scanning storage is genuinely operational.

## Public demos

- `/dashboard-demos` remains public, static/read-only and synthetic.
- No real Supabase member/child queries are used by the demo showroom.
- Shared dashboard/public wordmark renders **Aurelia World**.

## Dodo gate

The signed `dodo-billing-webhook` Edge Function is deployed.

Unsigned/unconfigured probe result before secrets/product IDs are installed:

- **HTTP 503**
- `{"error":"Billing webhook is not configured"}`

This is the intended fail-closed state. Browser return/query parameters are not allowed to grant entitlement.

Billing database functions for payment/subscription binding and idempotent subscription lifecycle processing are installed in production Supabase.

## Supabase security review

Security advisor rerun before the legal pass:

- Remaining warning: **Leaked Password Protection Disabled** — enable in Supabase Auth during final hardening before broad public launch.
- RLS-with-no-policy INFO notices are for intentionally server-only operational tables and do not represent public client access.
- Do not weaken RLS to remove those informational notices.

## Tomorrow — final hardening/configuration only

1. Rerun/confirm the complete post-legal test, typecheck, production build and browser privacy checks.
2. Enable Supabase leaked-password protection.
3. Review/configure production Auth email, recovery and quota behaviour for launch scale.
4. Make `https://theaureliaworld.com` the canonical public URL anywhere secure configuration still uses the temporary host.
5. Confirm a real family cancellation/support route before broad recurring billing.
6. Create the four Dodo recurring products:
   - Family £12.99 monthly
   - Family £129 yearly
   - Family Plus £19.99 monthly
   - Family Plus £199 yearly
7. Install Dodo API key, webhook signing secret and four product IDs in secure server/Supabase environments.
8. Run full Dodo test payment proof; verify `billing_events`, `billing_subscriptions`, `billing_accounts` and `billing_entitlements`.
9. Replay a Dodo webhook to prove idempotency and test cancellation/on-hold/failed state behaviour.
10. Only after test proof passes, run one controlled live Family payment.
11. Gary/counsel review the GSM legal pack and identify any jurisdiction-specific launch holds.
12. Connect Aurelia World into Liftor and treat Liftor as the operating workflow from that point.

## Deliberately not a tomorrow launch blocker

Media upload remains disabled until a genuine quarantine/scanning pipeline exists. Do not bypass this protection simply to make upload appear complete.

## Go/no-go statement

**GO for tomorrow's hardening + Dodo integration/proof + private/invitation-only customer testing.**

**NO-GO for broad global paid acquisition or large institutional contracting until the applicable items are cleared:** Dodo live proof, cancellation/support operation, leaked-password protection, production Auth reliability, formal trademark clearance, counsel-approved institutional MSA/DPA, applicable UK/EU/US child/privacy/platform scope items and any required regulatory representatives/contacts.
