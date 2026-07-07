import { PGlite } from "@electric-sql/pglite";

// In Vercel serverless functions, the file system is read-only (except /tmp).
// For this MVP, we will use an in-memory database to avoid EROFS errors.
// Keep in mind the data will be ephemeral per serverless function instance.
const db = new PGlite("memory://");

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
