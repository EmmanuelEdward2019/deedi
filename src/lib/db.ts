import { neon } from "@neondatabase/serverless";

export type Row = Record<string, unknown>;

/**
 * The slice of the Neon client this app uses, typed so callers get back
 * plain rows instead of the driver's wide union.
 */
export interface Sql {
  <T = Row>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]>;
  query<T = Row>(text: string, params?: unknown[]): Promise<T[]>;
}

let client: Sql | null = null;

function connect(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.",
    );
  }
  return neon(url) as unknown as Sql;
}

/**
 * Neon SQL client, used as a tagged template so every value is sent as a
 * bound parameter rather than interpolated into the statement:
 *
 *   const rows = await sql<Property>`select * from properties where slug = ${slug}`;
 *
 * The connection is created on first use so a missing DATABASE_URL surfaces
 * as a caught query error rather than a module-load crash.
 */
export const sql: Sql = Object.assign(
  <T = Row>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]> => {
    client ??= connect();
    return client<T>(strings, ...values);
  },
  {
    query<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
      client ??= connect();
      return client.query<T>(text, params);
    },
  },
);

/** True when a connection string is configured — lets pages degrade gracefully. */
export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
