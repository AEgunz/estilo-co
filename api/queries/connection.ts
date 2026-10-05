import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    // Force utf8mb4 so Arabic text (customer names, colors, addresses)
    // is stored and read correctly. Without this, MySQL servers whose
    // default charset is latin1 mangle Arabic into "???".
    const pool = mysql.createPool({
      uri: env.databaseUrl,
      charset: "utf8mb4",
      connectionLimit: 10,
    });
    instance = drizzle(pool, {
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}
