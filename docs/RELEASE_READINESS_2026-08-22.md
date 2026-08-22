# Aurelia World — release readiness

Date: **22 August 2026**

Status: **CODE/PRODUCT GATE PASSED — custom domain live; ready for final hardening and Dodo proof on 23 August 2026.**

## Brand/domain

- Working brand: **AURELIA WORLD**.
- Permanent domain: **https://theaureliaworld.com**.
- Production verification confirms the former `https://aurelia-world.lovable.app` address redirects to `https://theaureliaworld.com` and checked routes resolve over HTTPS with final HTTP 200.
- Formal trademark clearance for AURELIA WORLD remains required before broad paid acquisition or filing.

## Automated verification

Final verification after branding + translation integration:

- **558 / 558 tests passed**.
- **92 test files**.
- **1,635 assertions**.
- TypeScript typecheck: **0 errors**.
- Production build: **PASS**.
- No broken imports/routes identified.
- No service-role or secret credentials exposed in browser/VITE code.

## Production verification

Verified on the published production deployment:

- `/` → HTTP 200 at `theaureliaworld.com`, Aurelia World visible, public translator present.
- `/dashboard-demos` → HTTP 200 at `theaureliaworld.com/dashboard-demos`, public translator present.
- `/auth/sign-in` → HTTP 200, **no** GTranslate wrapper/script.
- `/report-concern` → HTTP 200, **no** GTranslate wrapper/script.

## Global public translation — complete

Aurelia World now uses the same privacy-safe **GTranslate** pattern proven on Global Health Access Trust.

Public marketing and synthetic demo pages load the floating language selector with `all_languages: true` and native language names.

Verified public examples:

- `/`
- `/about`
- `/dashboard-demos`
- `/alumni-world` (public marketing page)

The third-party translation script is deliberately excluded from private or sensitive routes:

- `/auth/*`
- `/dashboard/*`
- `/alumni/*` (private 16+ environment)
- `/contact-enquiry`
- `/report-concern`

When moving from translated public content into an excluded route, Aurelia World removes translation chrome/state and expires translation cookies. Inputs, textareas, selects, editable content, code, email/telephone links, payment-related iframes and sensitive field descriptors are marked notranslate. Brand terms including **Aurelia World** are also protected.

This provides global day-one convenience translation without passing private child/family/account/safeguarding content to the external page-translation service. It is not a replacement for legally reviewed/localised policy text where authoritative translations are required.

## Child safety / sharing gate

Verified unchanged:

`draft → scan_pending → approval_pending → moderation_pending → published`

- No child public-directory bypass.
- Guardian approval does not expose private drafts.
- Public release remains safety/moderation gated.
- Private media uploads remain disabled until quarantine/scanning storage is real.

## Public demos

- `/dashboard-demos` remains public, static/read-only and synthetic.
- No real Supabase member/child queries are used by the demo showroom.
- Shared dashboard/public wordmark renders **Aurelia World**.

## Dodo gate

The signed `dodo-billing-webhook` Edge Function is deployed.

Unsigned/unconfigured probe result before secrets/product IDs are installed:

- **HTTP 503**
- `{"error":"Billing webhook is not configured"}`

This is the intended fail-closed state.

Billing database functions for payment/subscription binding and idempotent subscription lifecycle processing are installed in production Supabase.

## Supabase security review

Security advisor rerun after the final code pass:

- Remaining warning: **Leaked Password Protection Disabled** — enable in Supabase Auth during final hardening before broad public launch.
- RLS-with-no-policy INFO notices are for intentionally server-only operational tables and do not represent public client access.
- Do not weaken RLS to remove those informational notices.

## Tomorrow — final hardening/configuration only

1. Enable Supabase leaked-password protection.
2. Review/configure production Auth email delivery/quota for adult onboarding at launch scale.
3. Update the secure canonical/public URL configuration to `https://theaureliaworld.com` anywhere still using the temporary Lovable host.
4. Create the four Dodo recurring products:
   - Family £12.99 monthly
   - Family £129 yearly
   - Family Plus £19.99 monthly
   - Family Plus £199 yearly
5. Install Dodo API key, webhook signing secret and four product IDs in secure server/Supabase environments.
6. Run the complete Dodo test payment proof and verify `billing_events`, `billing_subscriptions`, `billing_accounts` and `billing_entitlements`.
7. Replay a Dodo webhook to prove idempotency.
8. Test cancellation/on-hold behavior.
9. Only after test proof passes, run one controlled live Family payment.
10. Connect Aurelia World into Liftor and treat Liftor as the operating workflow from that point.

## Deliberately not a tomorrow launch blocker

Media upload remains disabled until a genuine quarantine/scanning pipeline exists. Do not bypass this protection simply to make upload appear complete.

## Go/no-go statement

**GO for tomorrow's hardening + Dodo integration/proof.**

**NO-GO for broad paid acquisition until:** Dodo live proof, leaked-password protection, production Auth email delivery and formal trademark clearance are resolved.
