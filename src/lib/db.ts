import { PGlite } from "@electric-sql/pglite";

// We use an in-memory database or a persistent one if provided in a generic path.
// For this MVP, let's use a local filesystem path for persistence in Node.js environment
// But wait, in Next.js edge or serverless environments, it might be ephemeral.
// Since it's a micro-saas MVP, we'll initialize an in-memory DB or simple local one.
const db = new PGlite("./.pglite-data");

export async function initDb() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      prospect_bio TEXT NOT NULL,
      value_prop TEXT NOT NULL,
      generated_email TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function saveEmail(prospectBio: string, valueProp: string, generatedEmail: string) {
  const result = await db.query(
    "INSERT INTO emails (prospect_bio, value_prop, generated_email) VALUES ($1, $2, $3) RETURNING *",
    [prospectBio, valueProp, generatedEmail]
  );
  return result.rows[0];
}

export async function getEmails() {
  const result = await db.query("SELECT * FROM emails ORDER BY created_at DESC");
  return result.rows;
}
