import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        clientsClaim: true,
        skipWaiting: true,
      },
      injectRegister: "auto",
      includeAssets: [
        "favicon.png",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        background_color: "#ffffff",
        theme_color: "#111111",
        name: "Spielberichtsbogen",
        short_name: "Spielberichtsbogen",
        start_url: "/",
        display: "standalone",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
