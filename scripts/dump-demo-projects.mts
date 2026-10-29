import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { demoProjects, demoTechnologies } from "../lib/demo-data.ts";

const out = join(process.cwd(), "scripts", ".demo-projects.json");
writeFileSync(out, JSON.stringify({ demoProjects, demoTechnologies }), "utf8");
console.log(`Wrote ${demoProjects.length} projects → ${out}`);
console.log(`Sample: ${demoProjects.find((p) => p.slug === "bon")?.name}`);
