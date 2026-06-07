import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      features: path.resolve(__dirname, "src/features"),
      layouts: path.resolve(__dirname, "src/layouts"),
      store: path.resolve(__dirname, "src/store"),
      config: path.resolve(__dirname, "src/config"),
      types: path.resolve(__dirname, "src/types"),
      utils: path.resolve(__dirname, "src/utils"),
      routes: path.resolve(__dirname, "src/routes.tsx"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
