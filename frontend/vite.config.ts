import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isTest =
  typeof process !== "undefined" && process.env.TEST_MOCK === "true";

const plugins = [tailwindcss(), reactRouter(), tsconfigPaths()];

// Only enable React Router DevTools in development
if (process.env.NODE_ENV === "development") {
  plugins.unshift(reactRouterDevTools());
}

export default defineConfig({
  plugins,
  define: {
    // Inject test-mode flag so `sessions.ts` can skip real backend
    // calls during e2e tests. Set TEST_MOCK=true before starting
    // the dev server.
    "globalThis.__TEST_MODE__": JSON.stringify(isTest),
  },
  server: {
    host: true,
    strictPort: true,
    allowedHosts: true,
  },
  ssr: {
    noExternal: ["posthog-js", "@posthog/react"],
  },
});
