import { useMemo, useRef, useState } from "react";
import { PROJECTS, type Project } from "../data";
import { useTilt } from "../hooks";
import { IconArrowUR, Reveal, SectionHead } from "../ui";

const TYPES = ["All", "High-Rise", "Infrastructure", "Industrial", "Residential", "Commercial", "Civic"] as const;

function BeforeAfter({ p }: { p: Project }) {
  const [pos, setPos] = useState(50);
  const drag = useRef(false);
  const box = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="relative overflow-hidden select-none touch-none group/ba"
      onPointerDown={(e) => {
        drag.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => drag.current && move(e.clientX)}
      onPointerUp={() => (drag.current = false)}
      onPointerLeave={() => (drag.current = false)}
      role="slider"
      aria-label={`Compare blueprint and delivered state of ${p.name}`}
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((v) => Math.max(4, v - 6));
        if (e.key === "ArrowRight") setPos((v) => Math.min(96, v + 6));
      }}
    >
      <img src={p.img} alt={`${p.name} â delivered`} className="block w-full aspect-[16/10] object-cover" loading="lazy" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={p.img}
          alt=""
          aria-hidden="true"
          className="block h-full object-cover max-w-none"
          style={{
            width: box.current ? `${box.current.offsetWidth}px` : "100vw",
            filter: "grayscale(1) contrast(1.2) brightness(0.75) sepia(0.5) hue-rotate(175deg) saturate(2.2)",
            opacity: 0.85,
          }}
          draggable={false}
        />
        <div className="absolute inset-0 bp-grid-fine opacity-70" />
      </div>
      <div className="absolute top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_12px_rgba(255,107,0,0.8)]" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-accent text-[#10141a] grid place-items-center rotate-45 shadow-[var(--glow)]">
          <svg viewBox="0 0 24 24" className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="m9 6-5 6 5 6M15 6l5 6-5 6" />
          </svg>
        </span>
      </div>
      <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.24em] uppercase bg-[rgba(8,12,18,0.8)] text-ink px-2.5 py-1">
        Drawing set
      </span>
      <span className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.24em] uppercase bg-[rgba(8,12,18,0.8)] text-ink px-2.5 py-1">
        Delivered
      </span>
    </div>
  );
}

function ProjectCard({ p, delay, featured = false }: { p: Project; delay: number; featured?: boolean }) {
  const { ref, onMove, onLeave } = useTilt<HTMLElement>(featured ? 4 : 6);
  return (
    <Reveal variant="pop" delay={delay} className={featured ? "md:col-span-2" : ""}>
      <article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="tilt-card group bg-surface border border-line clip-notch-card overflow-hidden hover:border-accent/70 h-full flex flex-col"
      >
        <div className="relative overflow-hidden">
          <img src={p.img} alt={p.name} loading="lazy" className={`img-develop w-full object-cover ${featured ? "aspect-[16/8]" : "aspect-[16/10]"}`} />
          <span
            className={`absolute top-3 right-3 font-mono text-[9px] tracking-[0.22em] uppercase px-2.5 py-1 clip-tag ${
              p.status === "IN PROGRESS" ? "bg-accent text-[#10141a]" : "bg-[rgba(8,12,18,0.8)] text-brass border border-brass/50"
            }`}
          >
            {p.status === "IN PROGRESS" ? "â In Progress" : "â Delivered"}
          </span>
          <span className="absolute bottom-3 left-3 font-mono text-[9.5px] tracking-[0.22em] uppercase bg-[rgba(8,12,18,0.78)] text-ink px-2.5 py-1">
            {p.loc} Â· {p.year}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display font-bold uppercase tracking-wide text-lg md:text-xl text-ink group-hover:text-accent transition-colors">
              {p.name}
            </h3>
            <span className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase shrink-0">{p.type}</span>
          </div>
          <p className="text-muted text-[13.5px] leading-relaxed mt-2.5">{p.scope}</p>
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-line font-mono">
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted">Size</p>
              <p className="text-[13px] text-ink mt-0.5 tabular-nums">{p.sqft}</p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted">Value</p>
              <p className="text-[13px] text-ink mt-0.5 tabular-nums">{p.value}</p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted">Code</p>
              <p className="text-[13px] text-accent mt-0.5 uppercase">CE-{p.id.slice(0, 3)}</p>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof TYPES)[number]>("All");
  const shown = useMemo(() => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === filter)), [filter]);
  const featured = shown[0];
  const rest = shown.slice(1);

  return (
    <section id="work" className="relative bg-bg2 clip-slash-t noise scroll-mt-10">
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 pt-24 md:pt-36 pb-28">
        <SectionHead
          kicker="Project Ledger"
          title={<>Signed, sealed,<br /> <span className="text-accent">poured.</span></>}
          sub="Every entry below cleared our tolerance reports and our punch lists. Drag the amber divider on the featured pour to compare drawing set against delivered steel."
          right={
            <div className="font-mono text-[11px] text-muted tracking-[0.18em] uppercase text-right leading-loose">
              <p>Showing â <span className="text-accent tabular-nums">{String(shown.length).padStart(2, "0")}</span> / {String(PROJECTS.length).padStart(2, "0")}</p>
              <p>Backlog â <span className="text-ink">$1.9B contracted</span></p>
            </div>
          }
        />

        <div className="flex flex-wrap gap-2.5 mb-10">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              aria-pressed={filter === t}
              className={`clip-tag px-4 py-2 font-display font-semibold text-[12px] uppercase tracking-[0.08em] transition-all duration-200 ${
                filter === t
                  ? "bg-accent text-[#10141a] shadow-[var(--glow)]"
                  : "bg-surface border border-line text-muted hover:text-ink hover:border-accent/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {featured && (
          <Reveal>
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-5 mb-5">
              <div className="bg-surface border border-line clip-notch-card overflow-hidden group">
                <BeforeAfter p={featured} />
              </div>
              <ProjectCard p={featured} delay={120} featured />
            </div>
          </Reveal>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          {rest.map((p, i) => (
            <ProjectCard key={p.id} p={p} delay={(i % 3) * 100} />
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-5">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
              // Full ledger + case-study PDFs available under NDA â 214 more entries since 1987.
            </p>
            <a
              href="mailto:projects@constructedge.example?subject=Full%20project%20ledger%20request"
              className="btn-slab btn-ghost px-6 py-3 text-[12px] uppercase"
            >
              Request the ledger <IconArrowUR className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
