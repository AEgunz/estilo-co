// Post-build: inline the small CSS bundle into index.html to eliminate
// the render-blocking stylesheet request (Lighthouse: ~2.6s savings).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "dist", "public", "index.html");

let html = fs.readFileSync(htmlPath, "utf-8");
const linkRe = /<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>\s*/g;

let count = 0;
html = html.replace(linkRe, (match, href) => {
  const cssPath = path.join(root, "dist", "public", href.replace(/^\//, ""));
  if (!fs.existsSync(cssPath)) return match;
  const css = fs.readFileSync(cssPath, "utf-8");
  count += 1;
  return `<style data-inlined="${href}">\n${css}\n</style>\n`;
});

fs.writeFileSync(htmlPath, html);
console.log(`inline-css: inlined ${count} stylesheet(s) into index.html`);
