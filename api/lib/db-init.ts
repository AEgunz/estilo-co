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
      color VARCHAR(40) NOT NULL,
      qty INT NOT NULL,
      total INT NOT NULL,
      status ENUM('new','confirmed','shipped','cancelled') NOT NULL DEFAULT 'new',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `));
}
