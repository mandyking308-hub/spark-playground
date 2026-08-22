import { createServerOnlyFn } from "@tanstack/react-start";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import { createServerClient } from "@supabase/ssr";

import { currentPublicRuntimeConfig } from "@/config/runtime";

/**
 * Aurelia keeps Supabase session tokens in server-managed cookies rather than
 * browser localStorage. The browser receives no service-role credential and
 * authorization remains enforced by the live database RLS policies.
 */
export const getSupabaseServerClient = createServerOnlyFn(() => {
  const runtime = currentPublicRuntimeConfig();
  if (!runtime.backendConnected || !runtime.supabaseUrl || !runtime.supabasePublishableKey) {
    throw new Error("Dedicated Aurelia backend is not configured");
  }

  const secure = process.env.NODE_ENV === "production";

  return createServerClient(runtime.supabaseUrl, runtime.supabasePublishableKey, {
    auth: {
      flowType: "pkce",
    },
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          setCookie(
            cookie.name,
            cookie.value,
            {
              ...cookie.options,
              path: "/",
              httpOnly: true,
              sameSite: "lax",
              secure,
            } as Parameters<typeof setCookie>[2],
          );
        }
      },
    },
  });
});
