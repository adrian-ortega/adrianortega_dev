import mysql from "mysql2/promise";

// Writes contact form submissions to the adrianortegadev MySQL database on 234.
// See setup.sql at the repo root for the schema + user grant.

export type ContactSubmission = {
  firstName: string;
  lastName: string;
  email: string;
  message: string | null;
  ip: string | null;
  userAgent: string | null;
  referrer: string | null;
};

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionLimit: 5,
      // Fail fast instead of hanging the request if 234 is unreachable
      connectTimeout: 5000,
    });
  }
  return pool;
}

export function isContactDbConfigured(): boolean {
  return Boolean(
    process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER,
  );
}

export async function saveContactSubmission(
  s: ContactSubmission,
): Promise<void> {
  await getPool().execute(
    `INSERT INTO contact_submissions
       (first_name, last_name, email, message, ip, user_agent, referrer)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [s.firstName, s.lastName, s.email, s.message, s.ip, s.userAgent, s.referrer],
  );
}
