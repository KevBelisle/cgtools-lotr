import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: "src/sqlean/sqlean.wasm",
          dest: "assets",
        },
      ],
    }),
  ],
  build: {
    target: "ES2022", // Enables top-level await
  },
});
