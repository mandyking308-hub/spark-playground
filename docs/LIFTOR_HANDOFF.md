# Aurelia World → Liftor handoff

Status: **product build ready; GSM legal pack prepared for counsel; `theaureliaworld.com` live; Dodo configuration/payment proof and final hardening remain.**

Legal operator / contracting entity: **Global Solutions Management LLC (Delaware LLC)**  
Product/brand: **AURELIA WORLD**  
Production site: **https://theaureliaworld.com**  
Live Supabase project: `boybpjenlqtchsvhncgl`

Dodo webhook endpoint:

`https://boybpjenlqtchsvhncgl.supabase.co/functions/v1/dodo-billing-webhook`

The webhook is already deployed. It deliberately fails closed until its Dodo signing secret and all four Dodo product IDs are configured.

## Corporate / legal position

Aurelia World must be treated in customer contracts, Dodo configuration, invoices and Liftor operating records as a **GSM-operated product**, not a separate unincorporated company.

Public legal pages now identify GSM as operator. The counsel-review pack is under `docs/legal/`:

- `GSM_GLOBAL_LEGAL_LAUNCH_PACK_2026-08-22.md`
- `GSM_AURELIA_WORLD_DPA_TEMPLATE.md`
- `CHILD_SAFETY_PRIVACY_RISK_ASSESSMENT_2026-08-22.md`

Gary/counsel should also review `docs/BRAND_CLEARANCE.md`, the public Terms, Privacy Policy, child notice, cookie notice, Community Standards and school data-protection summary.

Formal AURELIA WORLD trademark clearance and jurisdiction-specific counsel decisions remain required before material broad paid acquisition or major institutional contracts.

## Brand/domain position

- Working brand: **AURELIA WORLD**.
- `theaureliaworld.com` was purchased on 22 August 2026 and is already connected to production over HTTPS.
- The former Lovable host redirects to the custom domain.
- Use `https://theaureliaworld.com` as the canonical public URL in tomorrow's secure configuration review.

## What is already complete

- Invitation-only adult and child authentication.
- Sponsored child onboarding.
- Role-separated dashboards and public synthetic dashboard showroom.
- Live child project persistence.
- Child sharing request → permission workflow → verified guardian approve/decline, with safety/moderation still required before wider publication.
- Private drafts are not generically exposed to parents/schools.
- Parent/Parent Alumni adult community backend and UI.
- Family pricing and checkout server function.
- Billing accounts, subscriptions, entitlements and billing event audit tables.
- Dodo payment/subscription binding RPC.
- Atomic Dodo subscription lifecycle RPC with idempotency.
- Signed Dodo webhook Edge Function deployed to live Supabase.
- Public contact/safeguarding intake backend.
- Public GTranslate option with private/sensitive routes excluded; translation is now visitor opt-in.
- GSM-oriented public Terms/Privacy/child notice/cookie notice/Community Standards/institutional data-protection summary.
- DPA and global counsel-review/legal-risk pack.

Previous full automated baseline before the final legal pass: 558 tests passing, typecheck clean, production build passing. A post-legal verification is required before final deployment lock.

## Tomorrow — integration/proof day

1. Complete the post-legal automated/browser verification if not already recorded as passed.
2. Enable Supabase leaked-password protection.
3. Harden production Auth email/recovery/quota behaviour.
4. Confirm the canonical public URL is `https://theaureliaworld.com` everywhere relevant.
5. Confirm an operational family cancellation/support path before broad recurring billing.
6. Create the four Dodo recurring GBP products under the GSM/Aurelia World commercial identity.
7. Add Dodo API/webhook secrets and product IDs to secure server/Supabase environments.
8. Run a full test payment and verify database entitlements and idempotency.
9. Test cancellation, on-hold and failed states.
10. Run one controlled live Family payment only after test proof is clean.
11. Record Gary/counsel decisions and launch holds from the GSM legal pack.
12. Connect Aurelia World into Liftor as a GSM organisation/product workflow.

## Dodo products

Create fixed recurring GBP products matching the locked pricing architecture exactly:

| Product tier | Price | Billing interval |
| --- | ---: | --- |
| Family | £12.99 | monthly |
| Family | £129.00 | yearly |
| Family Plus | £19.99 | monthly |
| Family Plus | £199.00 | yearly |

Do not enable customer-entered discounting for the first launch test. The webhook validates the recurring amount against the locked plan price.

Customer-facing merchant/product configuration should identify **Global Solutions Management LLC / Aurelia World** consistently wherever Dodo permits.

## App/server environment

Configure these in the secure server environment used by Aurelia World/Liftor. Never place API keys in browser/VITE variables or source control.

- `DODO_PAYMENTS_API_KEY`
- `DODO_PAYMENTS_API_BASE_URL`
- `DODO_FAMILY_MONTHLY_PRODUCT_ID`
- `DODO_FAMILY_ANNUAL_PRODUCT_ID`
- `DODO_FAMILY_PLUS_MONTHLY_PRODUCT_ID`
- `DODO_FAMILY_PLUS_ANNUAL_PRODUCT_ID`
- `AURELIA_PUBLIC_URL=https://theaureliaworld.com`

## Supabase Edge Function secrets

Configure for `dodo-billing-webhook`:

- `DODO_PAYMENTS_WEBHOOK_KEY`
- `DODO_FAMILY_MONTHLY_PRODUCT_ID`
- `DODO_FAMILY_ANNUAL_PRODUCT_ID`
- `DODO_FAMILY_PLUS_MONTHLY_PRODUCT_ID`
- `DODO_FAMILY_PLUS_ANNUAL_PRODUCT_ID`

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided by the Supabase Edge runtime and must never be exposed to the browser.

## Dodo webhook configuration

Use:

`https://boybpjenlqtchsvhncgl.supabase.co/functions/v1/dodo-billing-webhook`

Subscribe to:

- `payment.succeeded`
- `subscription.active`
- `subscription.updated`
- `subscription.on_hold`
- `subscription.renewed`
- `subscription.plan_changed`
- `subscription.cancelled`
- `subscription.failed`
- `subscription.expired`

Copy the endpoint signing secret into `DODO_PAYMENTS_WEBHOOK_KEY` in the Supabase Edge Function secrets.

The endpoint verifies Dodo's webhook signature and timestamp and uses the `webhook-id` as an idempotency key.

## Test-mode proof — do not skip

1. Use a verified adult parent account.
2. Start a Family Monthly checkout from the product.
3. Complete the Dodo test payment.
4. Confirm browser return alone does not activate access.
5. Confirm signed `payment.succeeded` binds the Dodo subscription ID to the correct billing account.
6. Confirm `subscription.active` activates account/subscription and creates `family_core` entitlement.
7. Repeat with Family Plus and confirm `family_core` + `family_plus`.
8. Replay a delivered webhook; confirm no duplicate access/event processing.
9. Test cancel-at-period-end and verify access remains until the valid end date.
10. Test on-hold/failed state if supported.

Expected live-table evidence:

- `billing_events`: Dodo event with `processed_at` set.
- `billing_subscriptions`: Dodo subscription/product IDs, plan and lifecycle state.
- `billing_accounts`: correct family account status.
- `billing_entitlements`: correct active entitlements.

## Security / legal hardening still required

- Supabase **Leaked Password Protection** is still disabled and should be enabled before broad public launch.
- Production Auth email/recovery reliability must be reviewed.
- Operational recurring-payment cancellation/support must be proven.
- Gary/counsel should approve the institutional MSA/DPA, applicable UK/EU/US child/privacy/platform scope and representative/contact requirements.
- Trademark clearance remains a separate formal item.
- Copyright/DMCA process should be completed before opening externally published UGC at scale.
- Liability caps/indemnities should be aligned to GSM's actual insurance programme.

The existing RLS/no-policy INFO notices are intentional server-only tables; do not weaken RLS to make an advisor screen look cleaner.

## Deliberate safety boundaries that remain

- Private child media uploads stay disabled until the quarantine/scanning storage path is real.
- A child or guardian cannot bypass safety/moderation to publish work publicly.
- Browser redirect/query parameters never activate a paid entitlement.
- Dodo API keys, webhook signing keys and Supabase service-role credentials are server-side only.
- Public dashboard demos use illustrative content and do not expose real child records.

## Liftor tomorrow

Treat tomorrow as an **integration, legal-decision and proof day — not a new product-build day**:

**Security hardening → Dodo products/secrets → payment/cancellation proof → Gary legal decisions → Liftor under GSM.**
