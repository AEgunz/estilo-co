// SSR entry used at build time to prerender the landing page HTML.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { TRPCProvider } from "@/providers/trpc";
import App from "../src/App";

// Home reads window.fbq during render; shim it for Node.
(globalThis as Record<string, unknown>).window ??= globalThis;

export function renderHome(): string {
  return renderToString(
    <StaticRouter location="/">
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </StaticRouter>,
  );
}
