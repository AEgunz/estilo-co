import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import { serve, type HttpBindings } from "@hono/node-server";
import { serveStaticFiles } from "./lib/vite";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(compress());
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
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
  try {
    serveStaticFiles(app);

    const port = parseInt(process.env.PORT || "3000", 10);
    serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, (info) => {
      console.log(`Server running on http://0.0.0.0:${info.port}/`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

