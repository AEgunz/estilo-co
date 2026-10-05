import { sql } from "drizzle-orm";
import { getDb } from "../queries/connection";

/**
 * Ensure the `orders` table exists before the app starts serving traffic.
 * Shared hosting / managed MySQL instances sometimes lose tables after
 * restores or plan changes, which silently breaks the admin dashboard
 * (and order insertion) with a generic "Failed query" error.
 */
export async function ensureOrdersTable() {
  await getDb().execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      city VARCHAR(120) NOT NULL,
      address VARCHAR(255) NOT NULL,
      color VARCHAR(255) NOT NULL,
      qty INT NOT NULL,
      total INT NOT NULL,
      status ENUM('new','confirmed','shipped','cancelled') NOT NULL DEFAULT 'new',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `));

  // Widen legacy columns (idempotent) so multi-color orders fit:
  // e.g. "ساعة 1: روز غولد | ساعة 2: ذهبي | ساعة 3: فضي" > 40 chars.
  await getDb().execute(sql.raw(
    "ALTER TABLE orders MODIFY color VARCHAR(255) NOT NULL"
  ));

  // Convert legacy tables (created with latin1 default) to utf8mb4 so
  // Arabic text is not stored as "???".
  await getDb().execute(sql.raw(
    "ALTER TABLE orders CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
  ));
}
