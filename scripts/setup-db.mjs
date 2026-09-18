/**
 * Creates the Deedi Ltd schema on Neon.
 *   node --env-file=.env.local scripts/setup-db.mjs [--force]
 * --force drops existing tables first.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const here = dirname(fileURLToPath(import.meta.url));
const force = process.argv.includes("--force");

if (!process.env.DATABASE_URL) {
  console.error("\n  ✖ DATABASE_URL is not set.");
  console.error("    Create .env.local with your Neon connection string, then re-run.\n");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

/**
 * Splits a SQL file into statements, ignoring semicolons inside quoted strings,
 * line comments and $$ ... $$ dollar-quoted blocks (used by DO blocks).
 */
function splitStatements(text) {
  const statements = [];
  let current = "";
  let inSingle = false;
  let inLineComment = false;
  let dollarTag = null;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (dollarTag) {
      current += ch;
      if (text.startsWith(dollarTag, i)) {
        current += dollarTag.slice(1);
        i += dollarTag.length - 1;
        dollarTag = null;
      }
      continue;
    }

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      else continue;
    } else if (!inSingle && ch === "-" && next === "-") {
      inLineComment = true;
      continue;
    } else if (!inSingle && ch === "$") {
      // Opens a dollar-quoted block such as $$ or $body$.
      const match = /^\$[A-Za-z_]*\$/.exec(text.slice(i));
      if (match) {
        dollarTag = match[0];
        current += dollarTag;
        i += dollarTag.length - 1;
        continue;
      }
    } else if (ch === "'") {
      inSingle = !inSingle;
    }

    if (ch === ";" && !inSingle) {
      if (current.trim()) statements.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

const TABLES = [
  "subscribers",
  "gallery_items",
  "contact_messages",
  "blog_posts",
  "artworks",
  "properties",
  "admin_users",
];

async function main() {
  if (force) {
    console.log("  → dropping existing tables");
    for (const table of TABLES) {
      await sql.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }
  }

  const schema = await readFile(join(here, "schema.sql"), "utf8");
  const statements = splitStatements(schema);

  console.log(`  → applying ${statements.length} schema statements`);
  for (const statement of statements) {
    await sql.query(statement);
  }

  // Idempotent alterations for databases created before a change.
  const migrations = splitStatements(await readFile(join(here, "migrations.sql"), "utf8"));
  console.log(`  → applying ${migrations.length} migrations`);
  for (const statement of migrations) {
    await sql.query(statement);
  }

  const rows = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `;

  console.log("\n  ✔ schema ready");
  console.log(`    tables: ${rows.map((r) => r.table_name).join(", ")}\n`);
}

main().catch((error) => {
  console.error("\n  ✖ setup failed:", error.message, "\n");
  process.exit(1);
});
