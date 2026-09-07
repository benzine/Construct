import { defineConfig } from "/node_modules/.vite/deps/vite.js?v=a14f100c";
import react from "/node_modules/.vite/deps/@vitejs_plugin-react.js?v=4adfbc94";
import tailwindcss from "/node_modules/.vite/deps/@tailwindcss_vite.js?v=bb727cec";

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
