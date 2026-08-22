# Aurelia final launch audit

Informational record of the final launch pass (presentation, copy and privacy corrections only).

## Changes verified

- Public safeguarding CTAs point at the live intake route `/report-concern`; `/safeguarding-and-reporting` remains the explanatory policy/process page.
- `/contact` now offers a primary "Send an enquiry" CTA to `/contact-enquiry` plus a separate safeguarding CTA; general enquiries never ask for child personal data.
- `CtaBand` default secondary action is "Send an enquiry" → `/contact-enquiry`.
- Onboarding language corrected across public and auth presentation: under-16 accounts are sponsored by a verified parent/guardian or a verified school; approved organisations provide challenges/content/opportunities only, with no child directory, private contact route or account-creation authority.
- Google-hosted font requests removed (no preconnects, no remote stylesheet); `--font-sans` and `--font-display` now use privacy-safe system stacks. No external font, script or tracking dependency remains.
- Safeguarding copy no longer promises a specific response window; reports are described as triaged by urgency through human safeguarding workflows. Immediate-danger direction to local emergency services retained.
- No remaining public-facing "Application shell", "empty shells", "features come later" or "placeholder screen for now" copy.

## Checks

| Check | Result |
| --- | --- |
| `bun test` | 544 pass / 0 fail (90 files) |
| Typecheck (`tsgo --noEmit`) | clean |
| `bun run lint` | 0 errors (6 pre-existing react-refresh warnings) |
| `bun run build` | success |

## Browser routes verified (desktop 1280px and mobile 390px)

`/`, `/for-families`, `/for-schools`, `/creator-studio`, `/achievement-passport`, `/safety-and-trust`, `/privacy-for-children`, `/auth/sign-in`, `/auth/sign-up`, `/auth/join`, `/contact`, `/contact-enquiry`, `/safeguarding-and-reporting`, `/report-concern` — all HTTP 200, rendered inside the premium public layout, no console or page errors.

## Not modified

`database/`, `supabase/`, RLS/security/auth logic, `src/domain/identity-onboarding.ts`, Edge functions, package dependencies, protected dashboard behaviour, brand logo/favicon/PWA assets.
