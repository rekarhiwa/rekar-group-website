import { AlertTriangle } from "lucide-react";
import { isClerkConfigured } from "@/lib/auth/clerk";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { hasServiceRoleKey, isCmsSchemaReady } from "@/lib/supabase/schema";

export async function SchemaSetupBanner() {
  const issues: string[] = [];

  if (!isSupabaseConfigured()) {
    issues.push("گۆڕاوەکانی Supabase لە .env.local دانەنراون.");
  } else if (!(await isCmsSchemaReady())) {
    issues.push(
      "خشتەکانی CMS لە Supabase دروست نەکراون (migration جێبەجێ نەکراوە)."
    );
  }

  if (isClerkConfigured() && !hasServiceRoleKey()) {
    issues.push(
      "بۆ پاشەکەوتکردنی ناوەڕۆک، SUPABASE_SERVICE_ROLE_KEY پێویستە (Clerk + RLS)."
    );
  }

  if (!issues.length) return null;

  return (
    <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-7 text-amber-50">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-4 w-4" />
        ڕێکخستنی داتابەیس تەواو نییە
      </div>
      <ul className="list-disc space-y-1 pr-5">
        {issues.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-3 font-medium">چۆن migration جێبەجێ دەکەیت؟</p>
      <ol className="mt-1 list-decimal space-y-1 pr-5" dir="ltr">
        <li>Supabase Dashboard → SQL Editor</li>
        <li>supabase/migrations/001_initial_schema.sql</li>
        <li>supabase/migrations/002_posts_analytics.sql</li>
        <li>supabase/migrations/003_projects_cms.sql</li>
        <li>supabase/seed.sql</li>
      </ol>
      <p className="mt-3">
        یان Connection string ـی Postgres ـی Supabase وەک{" "}
        <span dir="ltr">SUPABASE_DB_URL</span> دابنێ و:
      </p>
      <pre
        className="mt-2 overflow-x-auto rounded-xl bg-black/30 p-3 text-xs"
        dir="ltr"
      >
        node --env-file=.env.local scripts/apply-schema.mjs
      </pre>
      <p className="mt-2 text-amber-100/80">
        تا ئەو کاتە بەشەکان بە داتای دیمۆ پیشان دەدرێن و سایتە گشتییەکە ناشکێت.
      </p>
    </div>
  );
}
