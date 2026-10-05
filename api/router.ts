import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware";
import { createOrder, listOrders, setOrderStatus, deleteOrder } from "./queries/orders";
import { getDb } from "./queries/connection";
import { sql } from "drizzle-orm";

const ADMIN_KEY = process.env.ADMIN_KEY || "estilo2026";
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8647674350:AAEASVBsD8xxtN0jvEC3t4Hh8cfe7TXm_ts";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "820512914";

function assertAdmin(key: string) {
  if (key !== ADMIN_KEY) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "كلمة السر غالطة" });
  }
}

async function notifyTelegram(text: string) {
  if (!TELEGRAM_CHAT_ID) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
        signal: AbortSignal.timeout(8000),
      },
    );
  } catch {
    // notification failure must never block the order
  }
}

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now(), v: "charset-fix-2" })),

  // TEMPORARY debug endpoint — remove after charset fix is verified
  debugCharset: publicQuery.query(async () => {
    const db = getDb() as any;
    const [createTable] = await db.execute(sql.raw("SHOW CREATE TABLE orders"));
    const [cols] = await db.execute(sql.raw(
      "SELECT COLUMN_NAME, CHARACTER_SET_NAME, COLLATION_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME='orders' AND TABLE_SCHEMA=DATABASE()"
    ));
    // Probe 1: does the DB connection itself round-trip Arabic?
    const [sel] = await db.execute(sql.raw("SELECT 'روز غولد' AS v, @@character_set_connection AS conn_charset"));
    return { createTable, columns: cols, select: sel };
  }),

  // Probe 2: POST body + bound-parameter roundtrip
  debugEcho: publicQuery
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb() as any;
      // Bound parameter (same path as drizzle inserts)
      const [rows] = await db.execute(sql`SELECT ${input.text} AS v`);
      return {
        received: input.text,
        codepoints: [...input.text].map((c) => c.codePointAt(0)),
        dbParam: rows,
      };
    }),

  orders: createRouter({
    create: publicQuery
      .input(
        z.object({
          name: z.string().min(2).max(120),
          phone: z.string().min(9).max(30),
          city: z.string().min(2).max(120),
          address: z.string().min(4).max(255),
          color: z.string().max(255),
          qty: z.number().int().min(1).max(3),
          total: z.number().int().positive(),
          chatId: z.string().max(30).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const { chatId, ...order } = input;
        await createOrder(order);
        const targetChat = TELEGRAM_CHAT_ID || chatId;
        if (targetChat) {
          await notifyTelegram(
            `🛎 طلب جديد — ساعة الحية\n` +
              `———————————\n` +
              `الكمية: ${order.qty} × ساعة (${order.total} درهم)\n` +
              `اللون: ${order.color}\n` +
              `الاسم: ${order.name}\n` +
              `الهاتف: ${order.phone}\n` +
              `المدينة: ${order.city}\n` +
              `العنوان: ${order.address}\n` +
              `———————————\n` +
              `المجموع: ${order.total} درهم (توصيل مجاني)`,
          );
        }
        return { ok: true };
      }),

    list: publicQuery
      .input(z.object({ adminKey: z.string() }))
      .query(async ({ input }) => {
        assertAdmin(input.adminKey);
        return listOrders();
      }),

    setStatus: publicQuery
      .input(
        z.object({
          adminKey: z.string(),
          id: z.number(),
          status: z.enum(["new", "confirmed", "shipped", "cancelled"]),
        }),
      )
      .mutation(async ({ input }) => {
        assertAdmin(input.adminKey);
        await setOrderStatus(input.id, input.status);
        return { ok: true };
      }),

    delete: publicQuery
      .input(z.object({ adminKey: z.string(), id: z.number() }))
      .mutation(async ({ input }) => {
        assertAdmin(input.adminKey);
        await deleteOrder(input.id);
        return { ok: true };
      }),

    telegramStatus: publicQuery      .input(z.object({ adminKey: z.string() }))
      .query(async ({ input }) => {
        assertAdmin(input.adminKey);
        return { connected: !!TELEGRAM_CHAT_ID };
      }),
  }),
});

export type AppRouter = typeof appRouter;
