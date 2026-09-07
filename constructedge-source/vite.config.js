import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* Conditional base: the preview runs `vite` (serve) and needs "/" for module
   resolution + HMR; only the production build uses "./" so dist assets are
   portable and survive sub-path serving. */
export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "./",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
}));
