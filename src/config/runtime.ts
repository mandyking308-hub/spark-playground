export interface PublicRuntimeConfig {
  supabaseUrl?: string;
  supabasePublishableKey?: string;
  supabaseProjectRef?: string;
  backendConnected: boolean;
}

const forbiddenClientKeyFragments = ["SERVICE_ROLE", "SECRET_KEY", "SUPABASE_SECRET"] as const;

function projectRefFromSupabaseUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    const match = parsed.hostname.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return match?.[1];
  } catch {
    return undefined;
  }
}

export function resolvePublicRuntimeConfig(
  env: Record<string, string | undefined>,
): PublicRuntimeConfig {
  for (const key of Object.keys(env)) {
    const upper = key.toUpperCase();
    if (forbiddenClientKeyFragments.some((fragment) => upper.includes(fragment)) && env[key]) {
      throw new Error(`Forbidden privileged backend credential exposed to client runtime: ${key}`);
    }
  }

  const supabaseUrl = env.VITE_SUPABASE_URL?.trim() || undefined;
  const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || undefined;
  const supabaseProjectRef = env.VITE_SUPABASE_PROJECT_REF?.trim() || undefined;

  const supplied = [supabaseUrl, supabasePublishableKey, supabaseProjectRef].filter(Boolean).length;
  if (supplied !== 0 && supplied !== 3) {
    throw new Error(
      "Supabase public runtime configuration must include URL, publishable key and the expected dedicated project ref.",
    );
  }

  if (supabaseUrl && supabaseProjectRef) {
    const urlProjectRef = projectRefFromSupabaseUrl(supabaseUrl);
    if (!urlProjectRef || urlProjectRef !== supabaseProjectRef) {
      throw new Error("Supabase URL does not match the explicitly approved dedicated project ref.");
    }
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
    supabaseProjectRef,
    backendConnected: Boolean(supabaseUrl && supabasePublishableKey && supabaseProjectRef),
  };
}

export function currentPublicRuntimeConfig(): PublicRuntimeConfig {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
  return resolvePublicRuntimeConfig(viteEnv);
}
