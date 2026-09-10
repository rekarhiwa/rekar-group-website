import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

async function main() {
  const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error(
      "Set SUPABASE_DB_URL (Supabase → Settings → Database → URI) then run:\n  node --env-file=.env.local scripts/apply-schema.mjs"
    );
    process.exit(1);
  }

  if (databaseUrl.includes("neon.tech") && !process.env.SUPABASE_DB_URL) {
    console.warn(
      "⚠ DATABASE_URL looks like Neon. This app reads data via Supabase API.\n  Use the Supabase Postgres connection string as SUPABASE_DB_URL."
    );
  }

  const root = process.cwd();
  const files = [
    "supabase/migrations/001_initial_schema.sql",
    "supabase/migrations/002_posts_analytics.sql",
    "supabase/migrations/003_projects_cms.sql",
    "supabase/seed.sql",
  ];

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected. Applying schema...");

  for (const relative of files) {
    const full = path.join(root, relative);
    const sql = fs.readFileSync(full, "utf8");
    console.log(`→ ${relative}`);
    try {
      await client.query(sql);
      console.log(`  OK`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Seed/migration may partially re-run; keep going on duplicates.
      if (/already exists|duplicate key/i.test(message)) {
        console.log(`  skipped (already applied): ${message.split("\n")[0]}`);
        continue;
      }
      console.error(`  FAILED: ${message}`);
      await client.end();
      process.exit(1);
    }
  }

  await client.end();
  console.log("Done. Reload the admin projects page.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
