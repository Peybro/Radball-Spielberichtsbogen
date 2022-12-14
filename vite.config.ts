import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: [
        "favicon.png",
        "apple-touch-icon.png",
        "vite.svg",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
      ],
      manifest: {
        short_name: "Spielbogen",
        name: "Spielberichtsbogen",
        start_url: "/spiel/",
        icons: [
          {
            src: "./android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "./android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#111111",
        background_color: "#3367D6",
        display: "standalone",
        scope: "/spiel/",
        description: "Manager für Radball Spieltage",
      },
    }),
  ],
});
