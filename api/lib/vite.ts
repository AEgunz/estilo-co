import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";

type App = Hono<{ Bindings: HttpBindings }>;

export function serveStaticFiles(app: App) {
  app.use("*", serveStatic({ root: "./dist/public" }));

  app.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }

    const candidates = [
      path.resolve(process.cwd(), "dist/public/index.html"),
      path.resolve(process.cwd(), "public/index.html"),
      path.resolve(import.meta.dirname, "public/index.html"),
      path.resolve(import.meta.dirname, "../dist/public/index.html"),
    ];

    for (const indexPath of candidates) {
      try {
        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath, "utf-8");
          return c.html(content);
        }
      } catch (err) {
        console.error("Error reading static index.html:", err);
      }
    }

    return c.text("ESTILO-CO App running (index.html not found)", 404);
  });
}

