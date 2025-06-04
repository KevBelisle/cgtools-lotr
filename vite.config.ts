import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tsconfigPaths(),
    svgr(),
    visualizer() as PluginOption,
    VitePWA({
      registerType: "prompt", //"autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 7.5 * 1024 * 1024, // 7.5MB
        globPatterns: ["**/*.{js,css,html,db,sqlite3}"],
      },
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "LotR LCG - CardGame.tools",
        short_name: "MyApp",
        description: "My Awesome App description",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    target: "ES2022", // Enables top-level await

    rollupOptions: {
      output: {
        manualChunks(id) {
          const HugeLibraries = ["@zag-js", "kysely", "@chakra-ui"]; // modify as required based on libraries in use
          if (
            HugeLibraries.some((libName) =>
              id.includes(`node_modules/${libName}`),
            )
          ) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
