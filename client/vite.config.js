import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const vitePort = Number(process.env.VITE_DEV_PORT || 5173);
const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET || "http://localhost:5000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? "/my_portfolio/" : "/",
  server: {
    host: true,
    port: vitePort,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
