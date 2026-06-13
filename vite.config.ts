// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()], // Daftarkan plugin tailwind disini agar compiler membaca @import "tailwindcss"
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
