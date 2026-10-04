import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import fs from "fs";
import path from "path";

type App = Hono<{ Bindings: HttpBindings }>;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

export function serveStaticFiles(app: App) {
  const staticDirs = [
    path.resolve(process.cwd(), "dist/public"),
    path.resolve(import.meta.dirname, "public"),
    path.resolve(import.meta.dirname, "../dist/public"),
    path.resolve(process.cwd(), "public"),
  ];

  app.use("*", async (c, next) => {
    const reqPath = c.req.path;

    if (reqPath.startsWith("/api/")) {
      return next();
    }

    for (const dir of staticDirs) {
      if (!fs.existsSync(dir)) continue;

      const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, "");
      const filePath = path.join(dir, safePath === "/" ? "index.html" : safePath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        const content = fs.readFileSync(filePath);
        return c.body(content, 200, { "Content-Type": contentType });
      }
    }

    return next();
  });

  app.notFound((c) => {
    const reqPath = c.req.path;

    if (/\.(js|mjs|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|json)$/i.test(reqPath)) {
      return c.text("404 Not Found", 404);
    }

    const indexCandidates = [
      path.resolve(process.cwd(), "dist/public/index.html"),
      path.resolve(import.meta.dirname, "public/index.html"),
      path.resolve(import.meta.dirname, "../dist/public/index.html"),
    ];

    for (const indexPath of indexCandidates) {
      try {
        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath, "utf-8");
          return c.html(content);
        }
      } catch (err) {
        console.error("Error reading index.html from", indexPath, err);
      }
    }

    return c.text("ESTILO-CO App is running (index.html not found)", 404);
  });
}
