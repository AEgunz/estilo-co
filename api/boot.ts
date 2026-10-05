import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import { serve, type HttpBindings } from "@hono/node-server";
import { serveStaticFiles } from "./lib/vite";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { ensureOrdersTable } from "./lib/db-init";

const app = new Hono<{ Bindings: HttpBindings }>();

// TEMP: compress disabled — testing whether it mangles UTF-8 POST bodies
// app.use(compress());
// NOTE: bodyLimit disabled — its stream reassembly mangles UTF-8 request
// bodies (Arabic arrives as "???"). 50MB uploads are not needed anyway.
// app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// TEMP raw-body probe: bypasses tRPC entirely
app.post("/api/debug-raw", async (c) => {
  const raw = await c.req.raw.text();
  const parsed = JSON.parse(raw);
  return c.json({ rawLength: raw.length, rawSnippet: raw.slice(0, 80), parsedText: parsed?.json?.text ?? null });
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

const isDev = process.env.NODE_ENV === "development";

if (!isDev) {
  (async () => {
    try {
      await ensureOrdersTable();
    } catch (err) {
      console.error("Failed to ensure orders table:", err);
    }

    try {
      serveStaticFiles(app);

      const port = parseInt(process.env.PORT || "3000", 10);
      serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, (info) => {
        console.log(`Server running on http://0.0.0.0:${info.port}/`);
      });
    } catch (err) {
      console.error("Failed to start server:", err);
    }
  })();
}

