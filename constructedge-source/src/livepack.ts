/* ------------------------------------------------------------------ */
/* Live source capture â packs the crate from the RUNNING page.
/*
/* The sandboxed preview refuses `?raw` module imports (it serves the
/* transformed module, which has no default export). So in dev we do NOT
/* use ?raw at all. Instead we fetch each source file with a plain
/* same-origin GET and recover the ORIGINAL TypeScript/CSS from the dev
/* server's inline source map (sourcesContent[0]).
/*
/* Plain fetches are not module imports, so the pipeline cannot refuse
/* them. In production builds this path is never used â the Footer
/* falls back to sourcepack.ts, whose ?raw imports are inlined at build.
/* ------------------------------------------------------------------ */

import { buildZip, type ZipEntry } from "./minizip";
import { SOURCEPACK_REVISION } from "./sourcepack-meta";

const SRC_FILES = [
  "src/main.tsx",
  "src/vite-env.d.ts",
  "src/index.css",
  "src/App.tsx",
  "src/data.ts",
  "src/hooks.ts",
  "src/ui.tsx",
  "src/sourcepack.ts",
  "src/sourcepack-meta.ts",
  "src/minizip.ts",
  "src/livepack.ts",
  "src/components/Header.tsx",
  "src/components/Hero.tsx",
  "src/components/Cursor.tsx",
  "src/components/Loader.tsx",
  "src/components/Floaters.tsx",
  "src/components/Bands.tsx",
  "src/components/Services.tsx",
  "src/components/Projects.tsx",
  "src/components/Method.tsx",
  "src/components/Calculator.tsx",
  "src/components/Team.tsx",
  "src/components/Safety.tsx",
  "src/components/Testimonials.tsx",
  "src/components/Contact.tsx",
  "src/components/Footer.tsx",
  "src/components/Chatbot.tsx",
];

const ROOT_FILES = ["index.html", "package.json", "tsconfig.json", "vite.config.js"];

const enc = new TextEncoder();

/* Recover original source from a served module's inline source map. */
function extractSource(served: string): string {
  const m = served.match(/\/\/[#@]\s*sourceMappingURL=data:application\/json;(?:charset=utf-8;)?base64,([A-Za-z0-9+/=]+)/);
  if (!m) return served;
  try {
    const map = JSON.parse(atob(m[1]));
    const content = map && map.sourcesContent && map.sourcesContent[0];
    if (typeof content === "string") return content;
  } catch {
    /* fall through to served text */
  }
  return served;
}

async function fetchText(path: string): Promise<string> {
  const res = await fetch("/" + path, { headers: { Accept: "*/*" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for /${path}`);
  return res.text();
}

const README = [
  `# ConstructEdge â full source code (revision ${SOURCEPACK_REVISION}, live capture)`,
  "",
  "Packed from the running page's inline source maps â byte-exact original sources.",
  "React 18 + TypeScript + Vite 6 + Tailwind CSS v4.",
  "",
  "## Run it",
  "",
  "```",
  "npm install",
  "npm run dev        # â http://localhost:3000",
  "npm run build      # production build â dist/",
  "npm run typecheck",
  "```",
  "",
].join("\n");

export async function packLiveSourceZip(): Promise<{ blob: Blob; bytes: number; captured: number; total: number }> {
  const entries: ZipEntry[] = [];
  let captured = 0;
  const total = SRC_FILES.length + ROOT_FILES.length;

  for (const path of [...ROOT_FILES, ...SRC_FILES]) {
    let content: string;
    try {
      const served = await fetchText(path);
      content = extractSource(served);
      captured++;
    } catch {
      content = `/* Could not capture "${path}" from the live preview.\n   It is included automatically in production builds. */\n`;
    }
    entries.push({ path: `constructedge-source/${path}`, data: enc.encode(content.endsWith("\n") ? content : content + "\n") });
  }

  entries.push({ path: "constructedge-source/README.md", data: enc.encode(README) });

  const blob = buildZip(entries);
  return { blob, bytes: blob.size, captured, total };
}
