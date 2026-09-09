import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const body = (await request.json()) as { postId?: string };
    if (!body.postId) {
      return NextResponse.json({ ok: false, error: "postId required" }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ua = request.headers.get("user-agent") || "";
    const viewerHash = createHash("sha256").update(`${ip}:${ua}:${body.postId}`).digest("hex");

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { error } = await supabase.rpc("increment_post_views", {
      p_post_id: body.postId,
      p_viewer_hash: viewerHash,
      p_user_agent: ua.slice(0, 300),
    });

    if (error) {
      // Fallback: simple view_count increment
      try {
        await supabase.rpc("publish_due_scheduled_posts");
      } catch {
        // optional
      }
      const { data } = await supabase
        .from("posts")
        .select("view_count")
        .eq("id", body.postId)
        .maybeSingle();
      if (data) {
        await supabase
          .from("posts")
          .update({ view_count: (data.view_count ?? 0) + 1 })
          .eq("id", body.postId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "error" },
      { status: 500 }
    );
  }
}
