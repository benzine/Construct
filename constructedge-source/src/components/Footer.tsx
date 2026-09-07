import { useEffect, useRef, useState } from "react";
import { OFFICES } from "../data";
import { scrollToId } from "../hooks";
import { SOURCEPACK_APPROX_KB, SOURCEPACK_FILE_COUNT, SOURCEPACK_REVISION } from "../sourcepack-meta";
import { IconArrowUR, IconHelmet, IconHook } from "../ui";

const FOOT_SERVICES = ["DesignâBuild", "Civil & Structural", "Commercial", "Industrial", "Retrofit", "Preconstruction"];
const FOOT_COMPANY: [string, string][] = [
  ["Project Ledger", "work"],
  ["The Method", "method"],
  ["ROM Calculator", "calculator"],
  ["The Crew", "crew"],
  ["Safety Hub", "safety"],
  ["Owner Testimony", "voices"],
];

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);
  const [phase, setPhase] = useState<"idle" | "packing" | "ready" | "error">("idle");
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [htmlUrl, setHtmlUrl] = useState<string | null>(null);
  const [zipKb, setZipKb] = useState(0);
  const [htmlKb, setHtmlKb] = useState(0);
  const [htmlFailed, setHtmlFailed] = useState(false);
  const [msg, setMsg] = useState("zip = rebuild anywhere Â· html = this site, self-contained");
  const urls = useRef<string[]>([]);

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const keep = (u: string) => {
    urls.current.push(u);
    return u;
  };

  const strapCrate = async () => {
    if (phase === "packing") return;
    setPhase("packing");
    setMsg("strapping the crate â packing 30 files offlineâ¦");
    setHtmlFailed(false);
    // yield a frame so the status paints before the synchronous pack
    await new Promise((r) => window.setTimeout(r, 60));
    try {
      /* PATH 1 â live preview: capture the ORIGINAL sources from the dev
         server's inline source maps via plain same-origin fetches. No ?raw
         imports, nothing for the sandbox to refuse. */
      let blob: Blob;
      let bytes: number;
      let via: "live" | "bundle" = "live";
      try {
        const live = await import("../livepack");
        const packed = await live.packLiveSourceZip();
        blob = packed.blob;
        bytes = packed.bytes;
      } catch (liveErr) {
        /* PATH 2 â production build: the ?raw bundle, inlined at build time. */
        try {
          const sp = await import("../sourcepack");
          const packed = sp.buildSourceZip();
          blob = packed.blob;
          bytes = packed.bytes;
          via = "bundle";
        } catch {
          throw liveErr;
        }
      }
      setZipKb(Math.max(1, Math.round(bytes / 1024)));
      setZipUrl(keep(URL.createObjectURL(blob)));
      /* best-effort auto download â works in real browsers; the visible
         rescue links below cover locked-down preview sandboxes. */
      try {
        downloadBlob(blob, `constructedge-source-${SOURCEPACK_REVISION}.zip`);
      } catch {
        /* rescue links carry it */
      }
      /* A self-contained replica needs real hashed bundles to inline â only
         available in production builds. In the live preview we say so. */
      if (via === "bundle") {
        try {
          const { buildReplicaHtml } = await import("../sourcepack");
          const html = await buildReplicaHtml();
          setHtmlKb(Math.max(1, Math.round(html.length / 1024)));
          setHtmlUrl(keep(URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }))));
        } catch {
          setHtmlFailed(true);
        }
      } else {
        setHtmlFailed(true);
      }
      setPhase("ready");
      setMsg(
        via === "live"
          ? "crate strapped from live sources â use the links below Â· real anchors the sandbox can't swallow"
          : "crate strapped â use the links below Â· they're real anchors, so the sandbox can't swallow them",
      );
    } catch (e) {
      setPhase("error");
      setMsg(`rig jammed: ${e instanceof Error ? e.message : "unknown fault"} â hit the button again`);
    }
  };

  const bootReplicaHere = () => {
    if (!htmlUrl) return;
    setMsg("booting the replica right here â reload the preview to come back");
    /* guaranteed-visible path: replace this very document. No download,
       no popup, no navigation permission required. */
    fetch(htmlUrl)
      .then((r) => r.text())
      .then((html) => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch(() => setMsg("couldn't boot in-place â use the â¤ replica link instead"));
  };

  return (
    <footer className="relative bg-bg noise overflow-hidden">
      <div className="h-[6px] bg-gradient-to-r from-accent via-rust to-accent" aria-hidden="true" />
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
          className="block w-full text-left group"
          aria-label="ConstructEdge â back to top"
        >
          <span className="wordmark-outline font-display font-bold uppercase leading-none block text-[clamp(2.6rem,10.5vw,8.5rem)] tracking-tight select-none">
            ConstructEdge
          </span>
        </button>

        <div className="grid md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-10 mt-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 bg-accent text-[#10141a] clip-tag">
                <IconHelmet className="w-6 h-6" />
              </span>
              <p className="font-display font-bold tracking-[0.06em] text-ink">
                CONSTRUCT<span className="text-accent">EDGE</span> GROUP
              </p>
            </div>
            <p className="text-muted text-[14.5px] leading-relaxed mt-4 max-w-sm">
              Design-build construction and civil engineering since 1987. Family-held, self-performing, and stubborn about schedules.
            </p>
            <div className="mt-6">
              <p className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-muted mb-3">// Field Notes â monthly</p>
              {subbed ? (
                <p className="font-mono text-[12px] text-brass tracking-[0.12em]">â SUBSCRIBED â first issue lands next pour.</p>
              ) : (
                <form
                  className="flex max-w-sm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.includes("@")) setSubbed(true);
                  }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="superintendent@yoursite.com"
                    className="field"
                    style={{ clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)" }}
                    aria-label="Email for newsletter"
                  />
                  <button type="submit" className="btn-slab btn-primary px-4 py-2 text-[11px] uppercase shrink-0" style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}>
                    Sign on
                  </button>
                </form>
              )}
            </div>
          </div>

          <nav aria-label="Services">
            <p className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-accent mb-4">// Zones</p>
            <ul className="space-y-2.5">
              {FOOT_SERVICES.map((s) => (
                <li key={s}>
                  <a href="#services" onClick={(e) => { e.preventDefault(); scrollToId("services"); }} className="link-laser text-muted hover:text-ink transition-colors text-[14.5px]">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-accent mb-4">// Company</p>
            <ul className="space-y-2.5">
              {FOOT_COMPANY.map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }} className="link-laser text-muted hover:text-ink transition-colors text-[14.5px]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-accent mb-4">// Field Offices</p>
            <ul className="space-y-4">
              {OFFICES.map((o) => (
                <li key={o.city}>
                  <p className="font-display font-semibold text-ink text-[14.5px]">{o.city}</p>
                  <a href={`tel:${o.phone.replace(/[^0-9]/g, "")}`} className="font-mono text-[12px] text-muted hover:text-accent transition-colors">
                    {o.phone}
                  </a>
                </li>
              ))}
            </ul>
            <a href="mailto:dispatch@constructedge.example" className="inline-flex items-center gap-2 font-mono text-[12px] text-accent mt-5 hover:underline underline-offset-4">
              dispatch@constructedge.example <IconArrowUR className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ------------ DR-01 Â· SOURCE DROP CRATE ------------ */}
        <div className="mt-14 relative border border-dashed border-steel/50 bg-surface clip-notch-card overflow-hidden group/lifeline">
          <div
            className="h-[5px] opacity-80 group-hover/lifeline:opacity-100 transition-opacity"
            style={{ background: "repeating-linear-gradient(-45deg, var(--accent) 0 12px, transparent 12px 24px)" }}
            aria-hidden="true"
          />
          <div className="p-7 md:p-8 flex flex-wrap items-center gap-7">
            <span className="relative grid place-items-center w-16 h-16 border-2 border-accent rotate-45 text-accent shrink-0 transition-transform duration-500 ease-out group-hover/lifeline:rotate-[135deg]">
              <IconHook className="w-8 h-8 -rotate-45 transition-transform duration-500 ease-out group-hover/lifeline:-rotate-[135deg]" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-brass" aria-hidden="true" />
            </span>
            <div className="min-w-[250px] flex-1">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent">DR-01 Â· Source Drop Crate</p>
              <h3 className="font-display font-bold uppercase text-xl md:text-2xl text-ink mt-1.5 leading-tight">
                The whole job site, crated.
              </h3>
              <p className="text-muted text-[14px] mt-2 max-w-xl leading-relaxed">
                One click packs everything <span className="text-ink">offline</span> â the <span className="text-ink">full source ZIP</span>{" "}
                (unzip â <span className="font-mono text-[12px]">npm install</span> â{" "}
                <span className="font-mono text-[12px]">npm run dev</span>) and a <span className="text-ink">self-contained offline replica</span>{" "}
                of this exact page, hero and all. Real save links appear the moment it's strapped â no sandbox can swallow a link you click.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {[`${SOURCEPACK_FILE_COUNT} FILES`, `â ${SOURCEPACK_APPROX_KB} KB SRC`, `REV ${SOURCEPACK_REVISION}`, "CRC32 SEALED Â· 100% OFFLINE"].map((c) => (
                  <span
                    key={c}
                    className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-muted border border-line px-2.5 py-1.5 clip-tag group-hover/lifeline:border-steel/60 transition-colors"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-stretch md:items-end gap-2.5 w-full md:w-auto md:min-w-[250px]">
              <button
                onClick={strapCrate}
                disabled={phase === "packing"}
                className="btn-slab btn-primary px-7 py-3.5 text-[12.5px] uppercase justify-center disabled:opacity-80"
                aria-live="polite"
              >
                {phase === "packing" ? (
                  <span className="blink">Strapping the crateâ¦</span>
                ) : phase === "ready" ? (
                  <>â¤ Crate ready â save below</>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 8h16v12H4z" />
                      <path d="M4 8l2-4h12l2 4" />
                      <path d="M9.5 12h5" />
                    </svg>
                    Strap the crate Â· pack everything
                  </>
                )}
              </button>

              {/* real anchors â the un-swallowable rescue */}
              {phase === "ready" && (
                <div className="flex flex-col gap-2 items-stretch">
                  {zipUrl && (
                    <a
                      href={zipUrl}
                      download={`constructedge-source-${SOURCEPACK_REVISION}.zip`}
                      className="btn-slab btn-ghost px-5 py-3 text-[11.5px] uppercase justify-center"
                    >
                      â¤ Save source Â· {zipKb} KB (.zip)
                    </a>
                  )}
                  {htmlUrl && (
                    <a
                      href={htmlUrl}
                      download="constructedge-offline.html"
                      className="btn-slab btn-ghost px-5 py-3 text-[11.5px] uppercase justify-center"
                    >
                      â¤ Save replica Â· {htmlKb} KB (.html)
                    </a>
                  )}
                  {htmlUrl && (
                    <button onClick={bootReplicaHere} className="btn-slab btn-primary px-5 py-3 text-[11.5px] uppercase justify-center">
                      â¶ Boot replica right here
                    </button>
                  )}
                  {htmlFailed && !htmlUrl && (
                    <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#e04f3a] text-center">replica binding failed â the ZIP still saves</p>
                  )}
                </div>
              )}

              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted text-left md:text-right" aria-live="polite">
                {msg}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10.5px] text-muted tracking-[0.12em]">
            Â© 2026 ConstructEdge Group Â· Lic. CGC-04821 Â· Bonded to $250M
          </p>
          <div className="flex items-center gap-6 font-mono text-[10.5px] tracking-[0.12em] uppercase">
            <a href="mailto:legal@constructedge.example?subject=Privacy%20policy" className="text-muted hover:text-accent transition-colors">Privacy</a>
            <a href="mailto:legal@constructedge.example?subject=Terms" className="text-muted hover:text-accent transition-colors">Terms</a>
            <a href="#safety" onClick={(e) => { e.preventDefault(); scrollToId("safety"); }} className="text-muted hover:text-accent transition-colors">OSHA VPP â</a>
          </div>
          <p className="font-mono text-[10.5px] text-steel tracking-[0.2em] uppercase">Built like we build â <span className="text-accent">to last.</span></p>
        </div>
      </div>
    </footer>
  );
}
