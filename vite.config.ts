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
    svgr({ include: "**/*.svg?react" }),
    visualizer() as PluginOption,
    VitePWA({
      registerType: "prompt",
      workbox: {
        maximumFileSizeToCacheInBytes: 7.5 * 1024 * 1024, // 7.5MB
        globPatterns: [
          "**/*.{js,css,html,db,sqlite3,wasm,woff,woff2,svg,png,jpg,jpeg,ico}",
        ],
      },
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "LotR LCG - CardGame.tools",
        short_name: "LotR LCG",
        description: "The Lord of the Rings LCG by CardGame.Tools",
        theme_color: "#17181D",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  build: {
    target: "ES2022", // Enables top-level await
    sourcemap: true, // Enable source maps for easier debugging
  },
});
