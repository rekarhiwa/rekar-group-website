import { NextResponse } from "next/server";
import { publishDueScheduledPostsAction } from "@/app/admin/actions/posts";

export async function GET() {
  const result = await publishDueScheduledPostsAction();
  return NextResponse.json({ ok: true, published: result.count });
}

export async function POST() {
  return GET();
}
