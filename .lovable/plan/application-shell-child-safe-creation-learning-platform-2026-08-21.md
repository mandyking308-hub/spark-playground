# Application Shell — Child-Safe Creation & Learning Platform

Build only the skeleton: layout, navigation, auth placeholders, and empty role dashboards. No database, AI, payments, or moderation logic.

## Scope

- Clean, premium, neutral design system (calm neutrals, one restrained accent, generous spacing, no purple-on-white gradients).
- Responsive app shell: top bar with product mark, collapsible sidebar navigation, content area.
- Auth placeholders only: sign-in and sign-up pages with non-functional forms and a clear "placeholder" note. No backend, no session logic.
- A simple role switcher (local, UI-only) so each dashboard can be previewed without auth.

## Routes

```text
/                      Landing / entry (product intro + sign-in links)
/auth/sign-in          Placeholder form
/auth/sign-up          Placeholder form
/dashboard/child       Empty dashboard
/dashboard/parent      Empty dashboard
/dashboard/teacher     Empty dashboard
/dashboard/school      School Admin
/dashboard/group       Education Group Admin
/alumni                Alumni (16+) environment, visually distinct shell
```

Each dashboard renders a page header, breadcrumb, and 3-4 empty placeholder cards labelled with the sections that will come later. No data fetching.

## Technical notes

- Stack stays React + TypeScript + Tailwind + shadcn/ui on TanStack Start file-based routing (`src/routes/`). Route files map one-to-one with the paths above.
- Shared chrome in a dashboard layout route so all role dashboards reuse one sidebar/topbar; alumni gets its own layout to keep the 16+ environment separated.
- Navigation items defined in a single config file (`src/config/navigation.ts`) keyed by role, so future work adds items in one place.
- Colours, radii and typography defined as semantic tokens in `src/styles.css`; components use tokens only, never hardcoded colours.
- Per-route `head()` metadata (title/description/og) on every page.
- Folder structure kept flat and predictable for GitHub handoff: `src/routes`, `src/components/layout`, `src/components/ui`, `src/config`, `src/lib`.

## Explicitly not in this pass

Database tables, Lovable Cloud/Supabase wiring, real authentication, AI features, payments, moderation workflows, detailed feature UI.
