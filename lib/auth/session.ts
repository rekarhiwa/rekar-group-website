import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/types/database";

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    return data as Profile | null;
  } catch {
    return null;
  }
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile || !profile.is_active) {
    throw new Error("Unauthorized");
  }
  return profile;
}
