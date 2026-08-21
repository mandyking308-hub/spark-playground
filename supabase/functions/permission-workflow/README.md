# permission-workflow Edge Function

Authenticated server workflow for under-16 publication permissions.

## Actions

POST JSON only:

- `request_publication` with `projectId`
- `withdraw_request` with `requestId`
- `guardian_decision` with `requestId`, `approved`, optional `decisionNote`

## Authentication

This function uses pinned `@supabase/server@1.4.1` and `withSupabase({ auth: "user" })`.
The SDK validates the caller's user JWT and supplies both the user-scoped client and the privileged admin client.

When deploying this function, set the Edge gateway `verify_jwt` option to **false** because `@supabase/server` is the function's explicit authentication layer. Do not disable both layers: the function must always retain `auth: "user"`.

## Privileged operations

The function does not read any secret key directly. It calls only these reviewed service-role RPCs through `ctx.supabaseAdmin`:

- `server_request_project_publication`
- `server_withdraw_permission_request`
- `server_record_guardian_decision`

Those RPCs independently resolve the platform profile from the verified auth user UUID and re-check ownership/guardian relationships. Ordinary `anon` and `authenticated` Data API roles have no EXECUTE grant on them.

## Error handling

Database errors are logged only with coarse action/error-code metadata. Raw database messages, project titles, child names and guardian notes are never returned in error responses.
