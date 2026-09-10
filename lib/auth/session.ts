import { isClerkConfigured } from "@/lib/auth/clerk";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile, UserRole } from "@/types/database";

function clerkRole(): UserRole {
  const role = process.env.CLERK_DEFAULT_ADMIN_ROLE || "super_admin";
  if (role === "admin" || role === "editor" || role === "super_admin") return role;
  return "super_admin";
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (isClerkConfigured()) {
    try {
      const { auth, currentUser } = await import("@clerk/nextjs/server");
      const session = await auth();
      if (!session.userId) return null;

      const user = await currentUser();
      const email =
        user?.primaryEmailAddress?.emailAddress ||
        user?.emailAddresses?.[0]?.emailAddress ||
        "";
      const fullName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        user?.username ||
        email ||
        "Clerk Admin";

      const metaRole = user?.publicMetadata?.role;
      const role: UserRole =
        metaRole === "admin" || metaRole === "editor" || metaRole === "super_admin"
          ? metaRole
          : clerkRole();

      return {
        id: session.userId,
        email,
        full_name: fullName,
        role,
        avatar_url: user?.imageUrl ?? null,
        is_active: true,
        created_at: user?.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }

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
