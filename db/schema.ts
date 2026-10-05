import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  color: varchar("color", { length: 255 }).notNull(),
  qty: int("qty").notNull(),
  total: int("total").notNull(),
  status: mysqlEnum("status", ["new", "confirmed", "shipped", "cancelled"])
    .notNull()
    .default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
