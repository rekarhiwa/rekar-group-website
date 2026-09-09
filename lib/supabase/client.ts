import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
