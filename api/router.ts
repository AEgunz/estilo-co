import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware";
import { createOrder, listOrders, setOrderStatus, deleteOrder } from "./queries/orders";

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
