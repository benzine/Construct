import { useMemo, useState } from "react";
import { useBO } from "../bo";
import { scrollToId } from "../hooks";
import { IconArrowUR, IconCivil, IconDraft, IconFactory, IconPrecon, IconRetro, IconTower, Reveal, SectionHead } from "../ui";

const ICONS: Record<"draft" | "civil" | "tower" | "factory" | "retro" | "precon", (p: { className?: string }) => React.ReactElement> = {
  draft: IconDraft,
  civil: IconCivil,
  tower: IconTower,
  factory: IconFactory,
  retro: IconRetro,
  precon: IconPrecon,
};

const SPANS = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2", "md:col-span-1", "md:col-span-2"];

const SERVICE_ICONS: Record<string, "draft" | "civil" | "tower" | "factory" | "retro" | "precon"> = {
  "SVC-01": "draft",
  "SVC-02": "civil",
  "SVC-03": "tower",
  "SVC-04": "factory",
  "SVC-05": "retro",
  "SVC-06": "precon",
};

function recommend(q1: string, q2: string, q3: string, boServices: Record<string, { name: string; tag: string; desc: string; duration: string }>): { code: string; why: string } | null {
  if (!q1) return null;
  if (q1 === "existing") return { code: "SVC-05", why: boServices["SVC-05"]?.desc || "Existing structures are our retrofit lane — scan, strengthen, refit, all while the building stays occupied." };
  if (q1 === "planning") return { code: "SVC-06", why: boServices["SVC-06"]?.desc || "You're still shaping the number. A 5D BIM estimate and GMP package de-risks it before capital is committed." };
  if (q2 === "small") return { code: "SVC-05", why: boServices["SVC-05"]?.desc || "Under 20K sq-ft, renovation & retrofit crews mobilize fastest and keep overhead off your number." };
  if (q3 === "speed") return { code: "SVC-03", why: boServices["SVC-03"]?.desc || "Pull-plan scheduling and our own superintendent corps are why commercial jobs land at 96.4% on-time." };
  if (q3 === "complexity") return { code: "SVC-02", why: boServices["SVC-02"]?.desc || "Technically heavy work starts in the engineering studio — PE-stamped systems before steel is ordered." };
  return { code: "SVC-01", why: boServices["SVC-01"]?.desc || "Design–build under one contract gives you budget certainty: one team owns scope, schedule and price." };
}

export default function Services() {
  const bo = useBO();
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const rec = useMemo(() => recommend(q1, q2, q3, bo.services), [q1, q2, q3, bo.services]);
  const serviceCodes = Object.keys(bo.services);

  return (
    <section id="services" className="relative bg-bg scroll-mt-24 noise">
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 pt-20 md:pt-28 pb-24">
        <SectionHead
          kicker="Construction Zones"
          title={<>Six zones. <span className="text-accent">One accountable chain of command.</span></>}
          sub="Every discipline lives under the same roof â so the estimate, the drawings and the crew in the field answer to the same project director."
          right={
            <div className="font-mono text-[11px] text-muted tracking-[0.18em] uppercase text-right leading-loose">
              <p>Zones active â <span className="text-accent">06</span></p>
              <p>Coverage â <span className="text-ink">14 states</span></p>
            </div>
          }
        />

        <div className="grid md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Ic = ICONS[s.icon];
            const hot = rec?.code === s.code;
            return (
              <Reveal key={s.code} delay={(i % 3) * 100} className={SPANS[i]}>
                <article
                  className={`group relative h-full bg-surface border p-7 md:p-8 clip-notch-card transition-all duration-300 ${
                    hot
                      ? "border-accent shadow-[var(--glow)]"
                      : "border-line hover:border-accent/60 hover:-translate-y-1.5 hover:shadow-[var(--shadow)]"
                  }`}
                >
                  <span className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-transparent group-hover:border-accent transition-colors" aria-hidden="true" />
                  <span className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-transparent group-hover:border-accent transition-colors" aria-hidden="true" />
                  <div className="flex items-start justify-between gap-4">
                    <span className={`grid place-items-center w-12 h-12 clip-tag transition-colors duration-300 ${hot ? "bg-accent text-[#10141a]" : "bg-surface2 text-accent group-hover:bg-accent group-hover:text-[#10141a]"}`}>
                      <Ic className="w-6 h-6" />
                    </span>
                    <span className="font-mono text-[10.5px] tracking-[0.24em] text-muted">{s.code}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-[22px] uppercase tracking-wide text-ink mt-5">{s.name}</h3>
                  <p className="font-mono text-[11px] text-accent tracking-[0.08em] mt-1.5">// {s.tag}</p>
                  <p className="text-muted leading-relaxed mt-3 text-[15px]">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {s.steps.map((st) => (
                      <span key={st} className="font-mono text-[10px] tracking-[0.08em] uppercase border border-line px-2.5 py-1 text-muted group-hover:border-steel/50 transition-colors">
                        {st}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-[11px] text-brass mt-5 flex items-center gap-2">
                    <span className="w-3 h-[2px] bg-brass inline-block" /> {s.duration}
                  </p>
                  {hot && (
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-accent mt-3 blink">â¸ Recommended for you</p>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 bg-surface2 border border-line clip-bevel p-7 md:p-10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-44 h-44 bp-grid-fine opacity-70 rotate-12" aria-hidden="true" />
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-accent">// Service Selector</p>
                <h3 className="font-display font-bold uppercase text-2xl md:text-3xl text-ink mt-3 leading-tight">
                  Not sure which zone you need?<br className="hidden md:block" /> Answer three questions.
                </h3>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mt-8">
              <label className="block">
                <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-muted block mb-2">01 â What's the asset?</span>
                <select className="field" value={q1} onChange={(e) => setQ1(e.target.value)}>
                  <option value="">Selectâ¦</option>
                  <option value="new">New ground-up build</option>
                  <option value="existing">Existing structure</option>
                  <option value="planning">Still in planning / feasibility</option>
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-muted block mb-2">02 â Rough footprint?</span>
                <select className="field" value={q2} onChange={(e) => setQ2(e.target.value)} disabled={!q1}>
                  <option value="">Selectâ¦</option>
                  <option value="small">Under 20K sq-ft</option>
                  <option value="mid">20K â 100K sq-ft</option>
                  <option value="large">Over 100K sq-ft</option>
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-muted block mb-2">03 â What matters most?</span>
                <select className="field" value={q3} onChange={(e) => setQ3(e.target.value)} disabled={!q2}>
                  <option value="">Selectâ¦</option>
                  <option value="speed">Speed to occupancy</option>
                  <option value="budget">Budget certainty</option>
                  <option value="complexity">Technical complexity</option>
                </select>
              </label>
            </div>
            {rec && recService && (
              <div className="mt-8 border-t-2 border-accent/60 pt-6 flex flex-wrap items-center justify-between gap-5">
                <div className="max-w-2xl">
                  <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-accent">
                    Dispatch â {rec.code} Â· {recService.name}
                  </p>
                  <p className="text-ink mt-2 leading-relaxed">{rec.why}</p>
                </div>
                <button onClick={() => scrollToId("contact")} className="btn-slab btn-primary px-6 py-3 text-[12.5px] uppercase">
                  Brief this zone <IconArrowUR className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
