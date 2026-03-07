import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const plugins = [tailwindcss(), reactRouter(), tsconfigPaths()];

// Only enable React Router DevTools in development
if (process.env.NODE_ENV === "development") {
  plugins.unshift(reactRouterDevTools());
}

export default defineConfig({
  plugins,
  server: {
    host: true,
    strictPort: true,
    allowedHosts: true,
  },
  ssr: {
    noExternal: ["posthog-js", "@posthog/react"],
  },
});
