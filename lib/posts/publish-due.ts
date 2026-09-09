import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function publishDueScheduledPosts(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("publish_due_scheduled_posts");
    if (!error) return Number(data ?? 0);

    const now = new Date().toISOString();
    const { data: due } = await supabase
      .from("posts")
      .select("id")
      .eq("status", "scheduled")
      .is("deleted_at", null)
      .lte("published_at", now);
    const ids = (due ?? []).map((p) => p.id);
    if (ids.length) {
      await supabase.from("posts").update({ status: "published" }).in("id", ids);
    }
    return ids.length;
  } catch {
    return 0;
  }
}
