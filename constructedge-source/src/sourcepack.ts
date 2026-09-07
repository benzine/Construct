/* ------------------------------------------------------------------ */
/* Full source-code crate â every project file, zipped on click with
/* the dependency-free minizip writer (store method, CRC32). Zero
/* network, zero dependencies. Loaded lazily by the Footer.
/*
/* IMPORTANT: only src/** files use ?raw imports â the dev server serves
/* those as modules fine. The four root-level config/entry files are
/* inlined as byte-exact constants below, because Vite refuses to serve
/* entry & config files as ?raw modules (this is what broke the crate in
/* the live preview: "error loading dynamically imported module:
/* â¦/tsconfig.json?import&raw").
/* ------------------------------------------------------------------ */

import mainTsx from "./main.tsx?raw";
import viteEnv from "./vite-env.d.ts?raw";
import indexCss from "./index.css?raw";
import appTsx from "./App.tsx?raw";
import dataTs from "./data.ts?raw";
import hooksTs from "./hooks.ts?raw";
import uiTsx from "./ui.tsx?raw";
import sourcepackTs from "./sourcepack.ts?raw";
import sourcepackMetaTs from "./sourcepack-meta.ts?raw";
import minizipTs from "./minizip.ts?raw";

import headerTsx from "./components/Header.tsx?raw";
import heroTsx from "./components/Hero.tsx?raw";
import cursorTsx from "./components/Cursor.tsx?raw";
import loaderTsx from "./components/Loader.tsx?raw";
import floatersTsx from "./components/Floaters.tsx?raw";
import bandsTsx from "./components/Bands.tsx?raw";
import servicesTsx from "./components/Services.tsx?raw";
import projectsTsx from "./components/Projects.tsx?raw";
import methodTsx from "./components/Method.tsx?raw";
import calculatorTsx from "./components/Calculator.tsx?raw";
import teamTsx from "./components/Team.tsx?raw";
import safetyTsx from "./components/Safety.tsx?raw";
import testimonialsTsx from "./components/Testimonials.tsx?raw";
import contactTsx from "./components/Contact.tsx?raw";
import footerTsx from "./components/Footer.tsx?raw";
import chatbotTsx from "./components/Chatbot.tsx?raw";

import { buildZip } from "./minizip";
import { SOURCEPACK_REVISION } from "./sourcepack-meta";

/* ---------------- root configs (byte-exact, server-refused â inlined) ---------------- */

const INDEX_HTML = String.raw`<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ConstructEdge â Design-Build Construction & Civil Engineering</title>
    <meta
      name="description"
      content="ConstructEdge Group: high-rise, industrial and civil structures â engineered in-house, erected by our own crews. 1,240+ delivered since 1987."
    />
    <link
      rel="icon"
      href="image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FF6B00' d='M12 1 23 12 12 23 1 12Z'/%3E%3Cpath fill='%230C0F13' d='M6 15a6 6 0 0 1 12 0v1H6z'/%3E%3C/svg%3E"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <script>
      (function () {
        try {
          var t = localStorage.getItem("ce-theme");
          if (t !== "light" && t !== "dark") {
            t = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
          }
          document.documentElement.setAttribute("data-theme", t);
        } catch (e) {
          document.documentElement.setAttribute("data-theme", "dark");
        }
      })();
    </script>
    <style>
      #ce-boot-frame{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:#0c0f13;color:#edf2f7;font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;overflow:hidden}
      #ce-boot-frame .bf-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(126,160,205,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(126,160,205,.09) 1px,transparent 1px);background-size:44px 44px}
      #ce-boot-frame .bf-box{position:relative;text-align:center;padding:24px;max-width:560px}
      #ce-boot-frame .bf-kicker{font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#ff6b00}
      #ce-boot-frame h1{margin:16px 0 0;font-family:'Space Grotesk','Barlow',system-ui,sans-serif;font-weight:700;font-size:clamp(2rem,5vw,3.2rem);line-height:.95;text-transform:uppercase;letter-spacing:-.015em}
      #ce-boot-frame h1 em{font-style:normal;color:#ff6b00}
      #ce-boot-frame .bf-status{margin-top:22px;display:inline-flex;align-items:center;gap:10px;font-size:10.5px;letter-spacing:.26em;text-transform:uppercase;color:rgba(159,192,228,.85)}
      #ce-boot-frame .bf-bar{width:130px;height:3px;background:rgba(126,160,205,.22);overflow:hidden}
      #ce-boot-frame .bf-bar i{display:block;height:100%;width:40%;background:#ff6b00;animation:bf-load 1.4s cubic-bezier(.4,0,.2,1) infinite}
      @keyframes bf-load{0%{transform:translateX(-110%)}100%{transform:translateX(340%)}}
      #ce-boot-frame .bf-dot{width:7px;height:7px;border-radius:50%;background:#ff6b00;box-shadow:0 0 10px rgba(255,107,0,.9);animation:bf-blink 1.4s steps(1) infinite}
      @keyframes bf-blink{50%{opacity:.15}}
      #ce-boot-frame .bf-hazard{position:absolute;left:0;right:0;bottom:0;height:7px;background:repeating-linear-gradient(-45deg,#ff6b00 0 14px,#101623 14px 28px)}
      #ce-boot-fault{margin-top:20px;font-size:12px;line-height:1.6;color:#ffb38a;white-space:pre-wrap;word-break:break-word;display:none}
    </style>
  </head>
  <body>
    <div id="root">
      <!-- Boot frame: renders with zero JS; React replaces #root on mount. -->
      <div id="ce-boot-frame" aria-hidden="true">
        <div class="bf-grid"></div>
        <div class="bf-box">
          <p class="bf-kicker">ConstructEdge Group Â· Field Telemetry</p>
          <h1>Raising<br />the <em>frame.</em></h1>
          <p class="bf-status"><span class="bf-dot"></span><span class="bf-bar"><i></i></span><span id="ce-shell-status">Spinning up field server</span></p>
          <div id="ce-boot-fault"></div>
        </div>
        <div class="bf-hazard"></div>
      </div>
    </div>
    <script>
      (function () {
        var fault = document.getElementById("ce-boot-fault");
        var status = document.getElementById("ce-shell-status");
        function fail(title, detail) {
          if (status) { status.textContent = title; status.style.color = "#ff6b00"; }
          if (fault) { fault.style.display = "block"; fault.textContent = (detail ? detail : "") + "\nPreview serving issue, not site code â hard-refresh (Ctrl/Cmd+Shift+R) or reload."; }
        }
        window.addEventListener("error", function (e) {
          if (!window.__CE_BOOTED__) fail("BOOT FAULT", (e.message || "script error") + (e.filename ? " @ " + e.filename + ":" + (e.lineno || "?") : ""));
        });
        window.addEventListener("unhandledrejection", function (e) {
          if (!window.__CE_BOOTED__) fail("BOOT FAULT â unhandled rejection", String((e.reason && e.reason.message) || e.reason || "unknown"));
        });
        window.setTimeout(function () {
          if (!window.__CE_BOOTED__ && document.getElementById("ce-boot-frame")) {
            fail("BOOT STALL â the JS bundle never executed", "");
          }
        }, 9000);
      })();
    </script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const PACKAGE_JSON = String.raw`{
  "name": "sandbox-workspace",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@supabase/supabase-js": "^2.98.0",
    "canvas-confetti": "^1.9.3",
    "date-fns": "^2.30.0",
    "framer-motion": "^11.16.1",
    "jszip": "^3.10.1",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "recharts": "^2.10.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.7",
    "@types/canvas-confetti": "^1.6.4",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^9.0.7",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.1.7",
    "typescript": "^5.7.0",
    "vite": "^6.3.5"
  }
}
`;

const TSCONFIG_JSON = String.raw`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src"]
}
`;

const VITE_CONFIG_JS = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* Conditional base: the preview runs \`vite\` (serve) and needs "/" for module
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
`;

export interface SourceFile {
  path: string;
  content: string;
}

export const SOURCE_FILES: SourceFile[] = [
  { path: "index.html", content: INDEX_HTML },
  { path: "package.json", content: PACKAGE_JSON },
  { path: "tsconfig.json", content: TSCONFIG_JSON },
  { path: "vite.config.js", content: VITE_CONFIG_JS },
  { path: "src/main.tsx", content: mainTsx },
  { path: "src/vite-env.d.ts", content: viteEnv },
  { path: "src/index.css", content: indexCss },
  { path: "src/App.tsx", content: appTsx },
  { path: "src/data.ts", content: dataTs },
  { path: "src/hooks.ts", content: hooksTs },
  { path: "src/ui.tsx", content: uiTsx },
  { path: "src/sourcepack.ts", content: sourcepackTs },
  { path: "src/sourcepack-meta.ts", content: sourcepackMetaTs },
  { path: "src/minizip.ts", content: minizipTs },
  { path: "src/components/Header.tsx", content: headerTsx },
  { path: "src/components/Hero.tsx", content: heroTsx },
  { path: "src/components/Cursor.tsx", content: cursorTsx },
  { path: "src/components/Loader.tsx", content: loaderTsx },
  { path: "src/components/Floaters.tsx", content: floatersTsx },
  { path: "src/components/Bands.tsx", content: bandsTsx },
  { path: "src/components/Services.tsx", content: servicesTsx },
  { path: "src/components/Projects.tsx", content: projectsTsx },
  { path: "src/components/Method.tsx", content: methodTsx },
  { path: "src/components/Calculator.tsx", content: calculatorTsx },
  { path: "src/components/Team.tsx", content: teamTsx },
  { path: "src/components/Safety.tsx", content: safetyTsx },
  { path: "src/components/Testimonials.tsx", content: testimonialsTsx },
  { path: "src/components/Contact.tsx", content: contactTsx },
  { path: "src/components/Footer.tsx", content: footerTsx },
  { path: "src/components/Chatbot.tsx", content: chatbotTsx },
];

const README = [
  `# ConstructEdge â full source code (revision ${SOURCEPACK_REVISION})`,
  "",
  `${SOURCE_FILES.length} files + this README, byte-exact from the running build.`,
  "React 18 + TypeScript + Vite 6 + Tailwind CSS v4. No page builder, no backend required.",
  "",
  "## Run it",
  "",
  "```",
  "npm install        # regenerates package-lock.json",
  "npm run dev        # â http://localhost:3000  (hot-reloading dev server)",
  "npm run build      # production build â dist/",
  "npm run typecheck  # tsc --noEmit",
  "```",
  "",
  "## What's inside",
  "",
  "- `index.html` â shell: inline theme bootstrap, no-JS boot frame + watchdog",
  "- `src/main.tsx` â React root, non-blocking font load, #root fallback",
  "- `src/App.tsx` â composition root + FaultWall error boundary",
  "- `src/index.css` â full design system: dual Day/Night Shift tokens, anti-rectangle clip geometry, reveal/laser/spark keyframes",
  "- `src/data.ts` â services, project ledger, crew, testimonials, calculator formulas",
  "- `src/hooks.ts` â theme, in-view, count-up, tween, tilt, reduced-motion hooks",
  "- `src/ui.tsx` â icon set, Reveal, SectionHead, StairEdge, HexBadge",
  "- `src/components/Hero.tsx` â the scroll-driven blueprintâbuilding isometric canvas (reverses on scroll-up)",
  "- `src/components/*` â crane header, stats band, project ledger w/ before-after slider, ROM calculator, chatbot, etc.",
  "- `src/sourcepack.ts` + `src/minizip.ts` â the site's self-export crate (dependency-free ZIP writer)",
  "",
  "## Notes",
  "",
  "- The four root config files are inlined byte-exact in `src/sourcepack.ts` (the dev server refuses to serve entry/config files as `?raw` modules).",
  "- Project photography is remote (pinned URLs in `src/data.ts` / `src/components/Safety.tsx`).",
  "- Fonts load from Google Fonts (Barlow / Space Grotesk / JetBrains Mono) with system fallbacks.",
  "- Day/Night Shift preference persists in `localStorage['ce-theme']`.",
  "",
].join("\n");

export function buildSourceZip(): { blob: Blob; bytes: number } {
  const enc = new TextEncoder();
  const entries = [
    ...SOURCE_FILES.map((f) => ({
      path: `constructedge-source/${f.path}`,
      data: enc.encode(f.content.endsWith("\n") ? f.content : f.content + "\n"),
    })),
    { path: "constructedge-source/README.md", data: enc.encode(README) },
  ];
  const blob = buildZip(entries);
  return { blob, bytes: blob.size };
}

/* ------------------------------------------------------------------ */
/* Offline replica â the live page with its own CSS + JS bound inside,
/* booting fresh on open. Production builds only: the dev server's
/* module graph cannot be inlined into a standalone document.
/* ------------------------------------------------------------------ */

export async function buildReplicaHtml(): Promise<string> {
  if (import.meta.env.DEV) {
    throw new Error(
      "The offline replica ships with production builds â this live preview runs the dev server, whose module graph can't be inlined. Grab the source-code ZIP instead: it contains everything, and `npm run dev` boots it.",
    );
  }
  const clone = document.documentElement.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("#ce-boot-frame, #cursorRing, #cursorDot, .laser-h, .laser-v").forEach((n) => n.remove());
  clone.querySelectorAll("script").forEach((n) => n.remove());
  const root = clone.querySelector("#root");
  if (root) root.innerHTML = "";

  const css = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .map((l) => l.href)
    .filter((href) => href.includes("/assets/"));
  const js = Array.from(document.querySelectorAll<HTMLScriptElement>("script[type=module][src]"))
    .map((s) => s.src)
    .filter((src) => src.includes("/assets/"));

  const fetchText = async (u: string): Promise<string> => {
    try {
      const r = await fetch(u);
      if (!r.ok) throw new Error(`${r.status} ${u}`);
      return await r.text();
    } catch (e) {
      throw new Error(`couldn't bind ${u.split("/").pop()} â ${(e as Error).message}`);
    }
  };

  const cssText = (await Promise.all(css.map(fetchText))).join("\n/* --- next sheet --- */\n");
  const jsText = (await Promise.all(js.map(fetchText))).join("\n;// --- next bundle ---\n");
  if (!cssText || !jsText) throw new Error("no built assets found on this page â is this a production build?");

  const head = clone.querySelector("head")!;
  head.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"], link[rel="icon"]').forEach((n) => n.remove());
  const style = document.createElement("style");
  style.textContent = cssText;
  head.appendChild(style);
  const script = document.createElement("script");
  script.type = "module";
  script.textContent = jsText;
  clone.appendChild(script);

  return "<!doctype html>\n" + clone.outerHTML;
}
