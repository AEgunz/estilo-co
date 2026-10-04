import { desc, eq } from "drizzle-orm";
import { orders } from "@db/schema";
import { getDb } from "./connection";

export async function createOrder(input: {
  name: string;
  phone: string;
  city: string;
  address: string;
  color: string;
  qty: number;
  total: number;
}) {
  await getDb().insert(orders).values(input);
}

export async function listOrders() {
  return getDb().select().from(orders).orderBy(desc(orders.createdAt));
}

export async function setOrderStatus(
  id: number,
  status: "new" | "confirmed" | "shipped" | "cancelled",
) {
  await getDb().update(orders).set({ status }).where(eq(orders.id, id));
}

export async function deleteOrder(id: number) {
  await getDb().delete(orders).where(eq(orders.id, id));
}
