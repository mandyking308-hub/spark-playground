# Aurelia billing activation

The pricing, billing database, family checkout server function, signed webhook source and billing dashboard are implemented in GitHub/Supabase. No payment-provider secret is committed to this repository.

## Commercial prices

| Plan | Price |
| --- | ---: |
| Family monthly | £12.99/month |
| Family annual | £129/year |
| Family Plus monthly | £19.99/month |
| Family Plus annual | £199/year |
| School | from £2,950/year |
| Education Group | from £12,500/year |
| Organisation / sponsored programme | from £5,000/year |

16+ Alumni is free initially. Parent Alumni continuity is included with the originating family/school relationship. School-funded core family access must not be double charged.

## Dodo products to create

Create four recurring subscription products in the Dodo Payments dashboard with GBP pricing:

1. Aurelia Family Monthly — £12.99/month
2. Aurelia Family Annual — £129/year
3. Aurelia Family Plus Monthly — £19.99/month
4. Aurelia Family Plus Annual — £199/year

Do not put product IDs in client-side `VITE_*` variables.

## Server environment

The TanStack server runtime needs:

```text
DODO_PAYMENTS_API_KEY=
DODO_PAYMENTS_API_BASE_URL=
DODO_FAMILY_MONTHLY_PRODUCT_ID=
DODO_FAMILY_ANNUAL_PRODUCT_ID=
DODO_FAMILY_PLUS_MONTHLY_PRODUCT_ID=
DODO_FAMILY_PLUS_ANNUAL_PRODUCT_ID=
AURELIA_PUBLIC_URL=https://aurelia-world.lovable.app
```

Use the Dodo API base URL for the intended environment (test or live). Never guess or silently switch environments in application code.

## Webhook

Source: `supabase/functions/dodo-billing-webhook/`

Deploy it only after the Dodo webhook secret and four product IDs have been configured in the function environment.

Required function environment:

```text
DODO_PAYMENTS_WEBHOOK_KEY=
DODO_FAMILY_MONTHLY_PRODUCT_ID=
DODO_FAMILY_ANNUAL_PRODUCT_ID=
DODO_FAMILY_PLUS_MONTHLY_PRODUCT_ID=
DODO_FAMILY_PLUS_ANNUAL_PRODUCT_ID=
```

Configure Dodo to send subscription lifecycle events to the deployed function, including:

- `subscription.active`
- `subscription.updated`
- `subscription.on_hold`
- `subscription.renewed`
- `subscription.plan_changed`
- `subscription.cancelled`
- `subscription.failed`
- `subscription.expired`

The function verifies the Standard Webhooks signature headers, reconciles the subscription idempotently, updates the billing account, updates entitlements and records a hashed billing event audit row.

## Trust boundary

The browser return route `/billing/return` is informational only. It does **not** activate access. A signed provider webhook is the source of truth for subscription state.

A paid plan never expands guardian or staff permissions over a child. Billing entitlements and child access/safeguarding permissions remain separate systems.

## Institutional billing

Schools, education groups and organisations do not use consumer card checkout. Their expected flow is:

1. Enquiry/demo
2. Proposal and agreed scope
3. Agreement
4. Annual invoice / bank transfer
5. Billing account + institution contract + entitlements recorded in Aurelia

The `/dashboard/licensing` route reads real contract records and intentionally shows an empty setup state rather than fabricated licence usage when none exist.
