// Plain-ESM migration runner. Reads every .sql file in /app/drizzle in
// alphabetical order, applies anything not already recorded in
// __platform_migrations, and bails out on the first failure.
//
// Runs at container start (see Dockerfile CMD) so a fresh Railway boot
// always finishes with a schema that matches the deployed code.

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(here, "..", "drizzle");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[migrate] DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(url, { max: 1, onnotice: () => {} });

try {
  await sql`
    CREATE TABLE IF NOT EXISTS __platform_migrations (
      name text PRIMARY KEY,
      applied_at timestamp NOT NULL DEFAULT now()
    )
  `;

  const entries = (await readdir(migrationsDir))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  if (entries.length === 0) {
    console.log("[migrate] no .sql files found in drizzle/");
  }

  for (const name of entries) {
    const applied = await sql`SELECT 1 FROM __platform_migrations WHERE name = ${name}`;
    if (applied.length > 0) {
      console.log(`[migrate] skip ${name} (already applied)`);
      continue;
    }
    console.log(`[migrate] apply ${name}`);
    const body = await readFile(join(migrationsDir, name), "utf8");
    await sql.unsafe(body).simple();
    await sql`INSERT INTO __platform_migrations (name) VALUES (${name})`;
  }

  console.log("[migrate] complete");
} catch (err) {
  console.error("[migrate] failed:", err);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
