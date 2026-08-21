export interface PublicRuntimeConfig {
  supabaseUrl?: string;
  supabasePublishableKey?: string;
  backendConnected: boolean;
}

const forbiddenClientKeyFragments = ["SERVICE_ROLE", "SECRET_KEY", "SUPABASE_SECRET"] as const;

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

  if ((supabaseUrl && !supabasePublishableKey) || (!supabaseUrl && supabasePublishableKey)) {
    throw new Error("Supabase public runtime configuration must include both URL and publishable key.");
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
    backendConnected: Boolean(supabaseUrl && supabasePublishableKey),
  };
}

export function currentPublicRuntimeConfig(): PublicRuntimeConfig {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
  return resolvePublicRuntimeConfig(viteEnv);
}
