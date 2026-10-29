/**
 * Sync demo projects (+ local assets) into Supabase.
 * Usage: node --env-file=.env.local scripts/sync-projects-to-supabase.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

const CATEGORY_BY_DEMO = {
  pc1: "00000000-0000-4000-8000-000000000040", // apps
  pc2: "00000000-0000-4000-8000-000000000041", // websites
  pc3: "00000000-0000-4000-8000-000000000042", // systems
};

/** Stable UUIDs (seed + new slots for bon/pc-check) */
const UUID_BY_SLUG = {
  "krd-tv": "00000000-0000-4000-8000-000000000050",
  noor: "00000000-0000-4000-8000-000000000051",
  "kurdish-pos": "00000000-0000-4000-8000-000000000052",
  girfan: "00000000-0000-4000-8000-000000000053",
  "krin-store": "00000000-0000-4000-8000-000000000054",
  "restaurant-system": "00000000-0000-4000-8000-000000000055",
  bayakawa: "00000000-0000-4000-8000-000000000056",
  dagirtin: "00000000-0000-4000-8000-000000000057",
  walam: "00000000-0000-4000-8000-000000000058",
  reel: "00000000-0000-4000-8000-000000000059",
  bon: "00000000-0000-4000-8000-00000000005a",
  "pc-check": "00000000-0000-4000-8000-00000000005b",
};

const TECH_UUID_BY_SLUG = {
  "react-native": "00000000-0000-4000-8000-000000000060",
  nextjs: "00000000-0000-4000-8000-000000000061",
  postgresql: "00000000-0000-4000-8000-000000000062",
  flutter: "00000000-0000-4000-8000-000000000063",
  supabase: "00000000-0000-4000-8000-000000000064",
  react: "00000000-0000-4000-8000-000000000065",
  firebase: "00000000-0000-4000-8000-000000000066",
  prisma: "00000000-0000-4000-8000-000000000067",
  expo: "00000000-0000-4000-8000-000000000068",
  cloudflare: "00000000-0000-4000-8000-000000000069",
  rust: "00000000-0000-4000-8000-00000000006a",
  typescript: "00000000-0000-4000-8000-00000000006b",
};

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

async function uploadLocal(supabase, projectId, kind, localRel) {
  if (!localRel || !localRel.startsWith("/")) return localRel;
  const abs = path.join(root, "public", localRel.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    console.warn(`  missing file: ${localRel}`);
    return localRel;
  }
  const buf = fs.readFileSync(abs);
  const name = path.basename(abs);
  const storagePath = `projects/${projectId}/${kind}/${name}`;
  const { error } = await supabase.storage
    .from("project-media")
    .upload(storagePath, buf, {
      contentType: contentType(abs),
      upsert: true,
    });
  if (error) throw new Error(`upload ${storagePath}: ${error.message}`);
  const { data } = supabase.storage.from("project-media").getPublicUrl(storagePath);
  return data.publicUrl;
}

function loadDemoProjects() {
  const outFile = path.join(root, "scripts", ".demo-projects.json");
  if (!fs.existsSync(outFile)) {
    throw new Error(
      "Missing scripts/.demo-projects.json — run:\n  npx tsx scripts/dump-demo-projects.mts > scripts/.demo-projects.json"
    );
  }
  const raw = fs.readFileSync(outFile, "utf8").replace(/^\uFEFF/, "").trim();
  const start = raw.indexOf("{");
  return JSON.parse(raw.slice(start));
}

async function ensureTechnologies(supabase, demoTechnologies) {
  for (const tech of demoTechnologies) {
    const id = TECH_UUID_BY_SLUG[tech.slug];
    if (!id) {
      console.warn(`  no UUID for tech ${tech.slug}`);
      continue;
    }
    const { error } = await supabase.from("technologies").upsert(
      { id, name: tech.name, slug: tech.slug },
      { onConflict: "id" }
    );
    if (error) {
      // slug unique conflict — update by slug
      const { error: e2 } = await supabase
        .from("technologies")
        .upsert({ name: tech.name, slug: tech.slug }, { onConflict: "slug" });
      if (e2) console.warn(`  tech ${tech.slug}: ${error.message} / ${e2.message}`);
    }
  }

  // Resolve actual IDs by slug (in case upsert used slug conflict)
  const { data } = await supabase.from("technologies").select("id,slug");
  const map = Object.fromEntries((data || []).map((t) => [t.slug, t.id]));
  return map;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Loading demo projects...");
  const { demoProjects, demoTechnologies } = loadDemoProjects();
  console.log(`  ${demoProjects.length} projects`);

  console.log("Ensuring technologies...");
  const techIdBySlug = await ensureTechnologies(supabase, demoTechnologies);

  // Soft-delete stray drafts that are not in demo set (optional keep nrxi/planakanm)
  const keepSlugs = new Set(demoProjects.map((p) => p.slug));

  for (const project of demoProjects) {
    const id = UUID_BY_SLUG[project.slug];
    if (!id) {
      console.warn(`Skip unknown slug ${project.slug}`);
      continue;
    }
    const categoryId = CATEGORY_BY_DEMO[project.category_id];
    console.log(`→ ${project.slug} (${id})`);

    // If an older row exists with same slug but different id (e.g. reel), remove it
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", project.slug)
      .neq("id", id);
    if (existing?.length) {
      for (const row of existing) {
        console.log(`  removing duplicate slug row ${row.id}`);
        await supabase.from("projects").delete().eq("id", row.id);
      }
    }

    const iconUrl = await uploadLocal(supabase, id, "icon", project.icon);
    const coverUrl = await uploadLocal(supabase, id, "cover", project.cover_image);
    const ogUrl = project.og_image
      ? await uploadLocal(supabase, id, "og", project.og_image)
      : coverUrl;

    const row = {
      id,
      name: project.name,
      slug: project.slug,
      category_id: categoryId,
      subtitle: project.subtitle,
      short_description: project.short_description,
      full_description: project.full_description,
      icon: iconUrl,
      cover_image: coverUrl,
      og_image: ogUrl,
      featured: Boolean(project.featured),
      show_in_marquee: Boolean(project.show_in_marquee),
      status: project.status || "published",
      client_name: project.client_name,
      completion_date: project.completion_date,
      website_url: project.website_url,
      play_store_url: project.play_store_url,
      app_store_url: project.app_store_url,
      github_url: project.github_url,
      challenge: project.challenge,
      solution: project.solution,
      result: project.result,
      case_study: project.case_study,
      features: project.features || [],
      platforms: project.platforms || [],
      seo_title: project.seo_title,
      seo_description: project.seo_description,
      sort_order: project.sort_order ?? 0,
      deleted_at: null,
      updated_at: new Date().toISOString(),
    };

    const { error: upErr } = await supabase.from("projects").upsert(row, {
      onConflict: "id",
    });
    if (upErr) throw new Error(`upsert ${project.slug}: ${upErr.message}`);

    // Images
    await supabase.from("project_images").delete().eq("project_id", id);
    const imageRows = [];
    for (const img of project.images || []) {
      const imageUrl = await uploadLocal(supabase, id, "gallery", img.image_url);
      imageRows.push({
        project_id: id,
        image_url: imageUrl,
        alt_text: img.alt_text,
        caption: img.caption,
        sort_order: img.sort_order ?? 0,
      });
    }
    if (imageRows.length) {
      const { error } = await supabase.from("project_images").insert(imageRows);
      if (error) throw new Error(`images ${project.slug}: ${error.message}`);
    }

    // Feature items
    await supabase.from("project_features").delete().eq("project_id", id);
    const featureRows = (project.feature_items || []).map((f) => ({
      project_id: id,
      title: f.title,
      description: f.description,
      icon: f.icon,
      sort_order: f.sort_order ?? 0,
    }));
    if (featureRows.length) {
      const { error } = await supabase.from("project_features").insert(featureRows);
      if (error) throw new Error(`features ${project.slug}: ${error.message}`);
    }

    // Technologies
    await supabase.from("project_technologies").delete().eq("project_id", id);
    const techRows = (project.technologies || [])
      .map((t) => techIdBySlug[t.slug])
      .filter(Boolean)
      .map((technology_id) => ({ project_id: id, technology_id }));
    if (techRows.length) {
      const { error } = await supabase.from("project_technologies").insert(techRows);
      if (error) throw new Error(`techs ${project.slug}: ${error.message}`);
    }

    console.log(`  OK icon=${Boolean(iconUrl)} cover=${Boolean(coverUrl)} images=${imageRows.length}`);
  }

  // Soft-delete projects not in demo set (keep extras archived)
  const { data: all } = await supabase.from("projects").select("id,slug,deleted_at");
  for (const row of all || []) {
    if (!keepSlugs.has(row.slug) && !row.deleted_at) {
      console.log(`Archiving non-demo project: ${row.slug}`);
      await supabase
        .from("projects")
        .update({ status: "archived", show_in_marquee: false, featured: false })
        .eq("id", row.id);
    }
  }

  const { data: final, count } = await supabase
    .from("projects")
    .select("slug,name,icon,cover_image,status,featured,show_in_marquee", { count: "exact" })
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order");
  console.log(`\nPublished projects: ${count}`);
  for (const p of final || []) {
    console.log(`  ${p.slug.padEnd(20)} featured=${p.featured} marquee=${p.show_in_marquee} icon=${(p.icon || "").slice(0, 60)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
