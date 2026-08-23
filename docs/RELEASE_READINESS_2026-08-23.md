# Aurelia World — final pre-Dodo release readiness

Date: **23 August 2026**

Authoritative website code: **GitHub main**  
Final website hardening commit tested: **`4f8b57d0d22da0db32724476414943b2adfa5320`**  
Legal operator / contracting entity: **Global Solutions Management LLC (Delaware LLC)**  
Product/brand: **Aurelia World**  
Canonical domain: **https://theaureliaworld.com**  
Authoritative Supabase project: **`boybpjenlqtchsvhncgl`**

## Website release gate — GREEN

Full release verification immediately before the final billing-translation exclusion:

- **558 / 558 tests passed**
- **92 test files**
- **1,635 expect/assertion calls**
- TypeScript: **clean / 0 errors**
- Production build: **PASS**
- No route regressions found
- No browser/VITE service-role secret exposure
- Media upload remains disabled
- Child private-draft and publication safety tests remain green

After adding `/billing` to the third-party translation exclusion list, targeted regression also passed:

- TypeScript: **clean**
- Production build: **PASS**
- `/billing/return`: **HTTP 200**
- `/auth/sign-in`: **HTTP 200**
- `/report-concern`: **HTTP 200**
- Billing/auth/safeguarding routes load **no GTranslate script, wrapper or translation cookies**
- Saved public translation preference resumes correctly when the visitor returns to a public marketing page

## Public/legal route smoke test — PASS

Verified HTTP 200 before Dodo configuration:

- `/`
- `/dashboard-demos`
- `/terms-of-use`
- `/privacy-policy`
- `/privacy-for-children`
- `/cookie-notice`
- `/data-protection-for-schools`
- `/community-standards`
- `/auth/sign-in`
- `/report-concern`
- `/pricing`
- `/contact`
- `/billing/return`

Public/legal footer identifies **Global Solutions Management LLC** and **Aurelia World**. The standalone sign-in page intentionally does not use the public footer.

## Corporate/legal layer — prepared for Gary/counsel

Public terms/policies identify Aurelia World as a GSM-operated product rather than a separate legal entity.

Counsel pack includes:

- `docs/legal/GSM_GLOBAL_LEGAL_LAUNCH_PACK_2026-08-22.md`
- `docs/legal/GSM_AURELIA_WORLD_INSTITUTIONAL_MSA_TEMPLATE.md`
- `docs/legal/GSM_AURELIA_WORLD_DPA_TEMPLATE.md`
- `docs/legal/CHILD_SAFETY_PRIVACY_RISK_ASSESSMENT_2026-08-22.md`
- `docs/BRAND_CLEARANCE.md`

Formal trademark clearance and jurisdiction-specific counsel decisions remain separate launch-governance items.

## Billing return safety — complete before Dodo

`src/functions/billing.ts` returns successful checkout sessions to `/billing/return`.

That route now exists and deliberately **does not trust browser query parameters or redirects as proof of payment**. Verification included forged success-like query parameters; the page still remained in verification-pending state and made no payment-success claim.

Payment/subscription entitlement remains dependent on verified server-side Dodo webhook/database state.

## Dodo gate — correctly fail-closed

The existing signed `dodo-billing-webhook` Edge Function is deployed to the authoritative Supabase project.

Unsigned/unconfigured probe:

- **HTTP 503**
- `{"error":"Billing webhook is not configured"}`

This is the intended pre-configuration state.

## What remains before controlled release

### Security / infrastructure

1. Enable Supabase **Leaked Password Protection**.
2. Confirm production Auth email/recovery delivery and launch-scale quota/reliability.
3. Confirm secure runtime `AURELIA_PUBLIC_URL=https://theaureliaworld.com`.
4. Keep `boybpjenlqtchsvhncgl` as the only authoritative Aurelia World Supabase backend. Do not enable or migrate to a second Lovable Cloud database.

### Dodo configuration and proof

5. Create the four recurring GBP products under the **Global Solutions Management LLC / Aurelia World** commercial identity where Dodo permits:
   - Family — £12.99 monthly
   - Family — £129 yearly
   - Family Plus — £19.99 monthly
   - Family Plus — £199 yearly
6. Install the Dodo API key, webhook signing secret and four product IDs in server/Supabase secrets only.
7. Configure the webhook events required by the existing billing implementation.
8. Complete a Dodo test Family payment and verify `billing_events`, `billing_subscriptions`, `billing_accounts` and `billing_entitlements`.
9. Repeat/verify Family Plus entitlements.
10. Replay a delivered webhook and prove idempotency.
11. Test cancel-at-period-end plus on-hold/failed states.
12. Confirm the customer cancellation/support operating route before broad recurring-billing launch.
13. Only after all test evidence is clean, run one controlled live Family payment.

### Release / operations

14. Gary/counsel review the GSM legal pack and record any launch holds.
15. Deploy the final GitHub main build to production.
16. Run a short post-deploy production smoke check on `https://theaureliaworld.com`, including `/billing/return` and sensitive-route translation exclusion.
17. Connect Aurelia World into Liftor as a **GSM organisation/product workflow**.

## Deliberate non-blocker

Private child media uploads remain disabled until a genuine quarantine/scanning pipeline exists. Do not weaken that protection for launch cosmetics.

## Current decision

**WEBSITE CODE: GO.**  
**READY FOR SECURITY HARDENING + DODO CONFIGURATION/TEST PROOF.**  
**BROAD PAID RELEASE: WAIT until Dodo proof, cancellation/support operation, Supabase leaked-password protection, production Auth reliability and applicable Gary/counsel launch holds are cleared.**
