// Post-build: inject the prerendered landing HTML into dist/public/index.html
// so FCP/LCP no longer wait for the JS bundle (SPA -> static-first).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "dist", "public", "index.html");
const ssrEntry = path.join(root, "dist-ssr", "prerender-entry.js");

const { renderHome } = await import(pathToFileURL(ssrEntry).href);
const appHtml = renderHome();

let html = fs.readFileSync(htmlPath, "utf-8");
const rootRe = /<div id="root">[\s\S]*?<\/div>/;
if (!rootRe.test(html)) {
  console.error("prerender: <div id=\"root\"></div> not found in index.html");
  process.exit(1);
}
html = html.replace(rootRe, `<div id="root">${appHtml}</div>`);
fs.writeFileSync(htmlPath, html);
console.log(`prerender: injected ${appHtml.length} chars of SSR HTML into index.html`);
