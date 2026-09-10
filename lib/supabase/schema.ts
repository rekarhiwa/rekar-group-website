/** Shared PostgREST / Postgres missing-relation detection */
export function isMissingRelationError(message?: string | null) {
  if (!message) return false;
  return /schema cache|does not exist|Could not find the table|relation .* does not exist/i.test(
    message
  );
}

let schemaReadyCache: boolean | null = null;
let schemaCheckedAt = 0;

/** Cached probe: true when core CMS tables exist on Supabase. */
export async function isCmsSchemaReady(): Promise<boolean> {
  const now = Date.now();
  if (schemaReadyCache !== null && now - schemaCheckedAt < 30_000) {
    return schemaReadyCache;
  }

  const { isSupabaseConfigured } = await import("@/lib/supabase/config");
  if (!isSupabaseConfigured()) {
    schemaReadyCache = false;
    schemaCheckedAt = now;
    return false;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.from("projects").select("id").limit(1);
    schemaReadyCache = !error || !isMissingRelationError(error.message);
    if (error && !isMissingRelationError(error.message)) {
      // Other errors (RLS, network) — don't treat as missing schema forever
      schemaReadyCache = true;
    }
  } catch {
    schemaReadyCache = false;
  }

  schemaCheckedAt = now;
  return schemaReadyCache;
}

export function resetSchemaReadyCache() {
  schemaReadyCache = null;
  schemaCheckedAt = 0;
}

export function hasServiceRoleKey() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
