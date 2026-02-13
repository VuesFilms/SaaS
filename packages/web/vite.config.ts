import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/SaaS/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@web": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
  },
});
