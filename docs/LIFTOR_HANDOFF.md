# Aurelia World → Liftor handoff

Status: **product build ready; `theaureliaworld.com` secured; Dodo configuration/payment proof and formal trademark clearance remain.**

Working brand: **AURELIA WORLD**  
Permanent domain secured: **`theaureliaworld.com`**  
Current production site: `https://aurelia-world.lovable.app`  
Live Supabase project: `boybpjenlqtchsvhncgl`

Dodo webhook endpoint:

`https://boybpjenlqtchsvhncgl.supabase.co/functions/v1/dodo-billing-webhook`

The webhook is already deployed. It deliberately fails closed until its Dodo signing secret and all four Dodo product IDs are configured.

## Brand/domain position

- Preferred working brand selected: **AURELIA WORLD**.
- `theaureliaworld.com` was purchased and secured on **22 August 2026**.
- The bare `AURELIA` mark is crowded in education/software, so formal trademark review of **AURELIA WORLD** is still required before broad paid acquisition or formal filing.
- Read `docs/BRAND_CLEARANCE.md` for the preliminary conflict/domain sweep.
- Domain connection/DNS is still pending; do not replace the current production URL in server configuration until the custom domain is actually connected and HTTPS verified.

## What is already complete

- Invitation-only adult and child authentication.
- Sponsored child onboarding without dependency on outbound confirmation email.
- Role-separated dashboards and public dashboard showroom.
- Live child project persistence.
- Child sharing request → real permission workflow → verified guardian approve/decline.
- Parent/Parent Alumni adult community backend and UI.
- Family pricing and checkout server function.
- Billing accounts, subscriptions, entitlements and billing event audit tables.
- Dodo payment/subscription binding RPC.
- Atomic Dodo subscription lifecycle RPC with idempotency.
- Signed Dodo webhook Edge Function deployed to live Supabase.
- Public contact/safeguarding intake backend.
- Current build/test baseline: 558 tests passing, typecheck and production build passing.

## Tomorrow — integration/proof day

1. Connect `theaureliaworld.com` to the production site and verify HTTPS/canonical redirects.
2. Keep **Aurelia World** as the working customer-facing name for sandbox/test integration.
3. Create the four Dodo recurring GBP products.
4. Add Dodo API/webhook secrets and product IDs to secure server/Supabase environments.
5. Run a full test payment and verify database entitlements.
6. Run one real low-risk payment only after test proof is clean.
7. Connect Aurelia World into the Liftor operating workflow.
8. Obtain formal trademark clearance before broad paid acquisition/brand filing.

## Dodo products

Create fixed recurring GBP products matching the locked pricing architecture exactly:

| Product tier | Price | Billing interval |
| --- | ---: | --- |
| Family | £12.99 | monthly |
| Family | £129.00 | yearly |
| Family Plus | £19.99 | monthly |
| Family Plus | £199.00 | yearly |

Do not enable customer-entered discounting for the first launch test. The webhook validates the recurring amount against the locked plan price.

Record the four resulting product IDs.

## App/server environment

Configure these in the secure server environment used by Aurelia World/Liftor. Never place API keys in browser/VITE variables or source control.

- `DODO_PAYMENTS_API_KEY`
- `DODO_PAYMENTS_API_BASE_URL`
- `DODO_FAMILY_MONTHLY_PRODUCT_ID`
- `DODO_FAMILY_ANNUAL_PRODUCT_ID`
- `DODO_FAMILY_PLUS_MONTHLY_PRODUCT_ID`
- `DODO_FAMILY_PLUS_ANNUAL_PRODUCT_ID`
- `AURELIA_PUBLIC_URL=https://aurelia-world.lovable.app` until `theaureliaworld.com` is connected and verified; then change to the canonical HTTPS custom domain.

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

The endpoint verifies Dodo's Standard Webhooks HMAC signature and timestamp. It uses the `webhook-id` as the idempotency key, so a Dodo retry cannot double-activate or extend access.

## Test-mode proof — do not skip

1. Use a verified adult parent account.
2. Start a Family Monthly checkout from the product.
3. Complete the Dodo test payment.
4. Return to the product. The browser return page is **not** proof of payment and must not activate access itself.
5. Confirm the signed `payment.succeeded` event binds the Dodo subscription ID to the correct billing account.
6. Confirm `subscription.active` changes the subscription/account to active and creates an active `family_core` entitlement.
7. Repeat with Family Plus and confirm both `family_core` and `family_plus` are active.
8. Replay a delivered webhook in Dodo. Confirm the same `webhook-id` is recorded once and does not duplicate access.
9. Test cancel-at-next-billing-date. Access should remain active until the period end while the local subscription becomes `cancel_at_period_end`.
10. Test an on-hold/failed state if Dodo test tooling permits it; access must not be silently treated as a healthy active subscription.

Expected live-table evidence after a successful Family payment:

- `billing_events`: Dodo event exists with `processed_at` set.
- `billing_subscriptions`: Dodo subscription ID, product ID, plan and active lifecycle state recorded.
- `billing_accounts`: family account status `active`.
- `billing_entitlements`: `family_core` active; `family_plus` active only for Family Plus.

## One Supabase security switch still to enable

The current Supabase security advisor reports **Leaked Password Protection Disabled**. Enable leaked-password protection in Supabase Auth before broad public launch. This is an Auth project setting, not an application-code change, and the current connector does not expose a safe setting mutation for it.

The other current RLS advisor notices are intentional server-only tables (`account_invitations`, `audit_log`, jurisdiction policy and public-intake operational tables). Unused-index notices are expected before real traffic and should not be 'cleaned up' pre-launch.

## Deliberate safety boundaries that remain

- Private child media uploads stay disabled until the quarantine/scanning storage path is real.
- A child or parent cannot bypass safety/moderation to publish work publicly.
- Browser redirect/query parameters never activate a paid entitlement.
- Dodo API keys, webhook signing keys and Supabase service-role credentials are server-side only.
- Public dashboard demos use illustrative content and do not expose real child records.

## Liftor tomorrow

Treat tomorrow as an **integration and proof day, not a new product-build day**:

**Connect `theaureliaworld.com` → Dodo products → secure secrets → webhook setup → test payment → verify entitlements → live payment proof → Liftor.**
