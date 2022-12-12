import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // root: path.resolve(__dirname, "src"),
  // resolve: {
  //   alias: {
  //     "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
  //   },
  // },
});
