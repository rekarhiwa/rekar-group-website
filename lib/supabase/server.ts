import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isClerkConfigured } from "@/lib/auth/clerk";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";
import { createServiceClient } from "./admin";

export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  // Clerk-authenticated admins use the service role so RLS staff checks still work.
  if (isClerkConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { auth } = await import("@clerk/nextjs/server");
      const { userId } = await auth();
      if (userId) return createServiceClient();
    } catch {
      // fall through to anon/session client
    }
  }

  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — middleware will refresh sessions.
        }
      },
    },
  });
}
