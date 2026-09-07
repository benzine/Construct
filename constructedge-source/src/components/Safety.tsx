import { useState } from "react";
import { CERTS, SAFETY_STATS } from "../data";
import { useCountUp, useInView } from "../hooks";
import { HexBadge, IconBolt, IconPhone, IconShield, Reveal, SectionHead } from "../ui";

function SafetyStat({ value, suffix, label, decimals, delay }: { value: number; suffix: string; label: string; decimals: number; delay: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const n = useCountUp(value, inView, { decimals, duration: 1800 });
  return (
    <div ref={ref} className="bg-surface border border-line p-6 clip-tag group hover:border-accent/60 transition-colors">
      <Reveal delay={delay}>
        <p className="font-mono font-bold text-4xl md:text-[42px] leading-none text-ink tabular-nums">
          {n}
          <span className="text-accent">{suffix}</span>
        </p>
        <p className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted mt-3 leading-relaxed">{label}</p>
      </Reveal>
    </div>
  );
}

const DOCS = [
  { name: "Site Safety Manual v12", size: "PDF Â· 8.1 MB" },
  { name: "Crane & Rigging Protocol", size: "PDF Â· 3.4 MB" },
  { name: "Fall Protection Plan (OSHA 1926 Subpart M)", size: "PDF Â· 2.2 MB" },
  { name: "Emergency Evacuation Poster", size: "PDF Â· 1.1 MB" },
];

export default function Safety() {
  const [queued, setQueued] = useState<Record<number, boolean>>({});

  return (
    <section id="safety" className="relative bg-surface noise scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 bp-grid opacity-70" aria-hidden="true" />
      <div
        className="absolute top-0 left-0 right-0 h-2.5"
        style={{ background: "repeating-linear-gradient(-45deg, var(--accent) 0 14px, #171b22 14px 28px)" }}
        aria-hidden="true"
      />
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28">
        <SectionHead
          kicker="Safety & Certifications"
          title={<>Everyone goes home.<br /> <span className="text-accent">Every shift. No asterisks.</span></>}
          sub="Safety isn't a binder on the shelf â it's the first agenda item of every daily huddle, and the metric every superintendent is bonused on."
        />

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          <div>
            <div className="grid grid-cols-2 gap-5">
              {SAFETY_STATS.map((s, i) => (
                <SafetyStat key={s.label} {...s} delay={i * 100} />
              ))}
            </div>

            <Reveal delay={150}>
              <div className="mt-8 bg-bg2 border border-line p-6 clip-bevel">
                <p className="font-mono text-[10.5px] tracking-[0.26em] uppercase text-accent flex items-center gap-2">
                  <IconShield className="w-4 h-4" /> Protocol Downloads
                </p>
                <ul className="mt-4 divide-y divide-line/70">
                  {DOCS.map((d, i) => (
                    <li key={d.name} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <p className="font-display font-semibold text-[14.5px] text-ink">{d.name}</p>
                        <p className="font-mono text-[10px] text-muted tracking-[0.12em] mt-0.5">{d.size}</p>
                      </div>
                      <button
                        onClick={() => setQueued((q) => ({ ...q, [i]: true }))}
                        className={`font-mono text-[10.5px] tracking-[0.16em] uppercase px-3.5 py-2 clip-tag transition-all duration-300 ${
                          queued[i] ? "bg-brass/20 text-brass border border-brass/60" : "bg-surface border border-line text-muted hover:text-accent hover:border-accent/60"
                        }`}
                      >
                        {queued[i] ? "â Queued" : "Download"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal variant="right">
              <div className="group relative overflow-hidden clip-tag border border-line mb-8">
                <img
                  src="images/crew-huddle.svg"
                  alt="ConstructEdge crew reviewing drawings during a daily safety huddle"
                  loading="lazy"
                  className="img-develop w-full aspect-[16/9] object-cover"
                />
                <span className="absolute bottom-3 left-3 font-mono text-[9.5px] tracking-[0.22em] uppercase bg-[rgba(8,12,18,0.78)] text-ink px-3 py-1.5">
                  06:00 huddle â Deck 14, Meridian One
                </span>
              </div>
            </Reveal>
            <p className="font-mono text-[10.5px] tracking-[0.26em] uppercase text-muted mb-6">// Certifications & standing</p>
            <div className="grid grid-cols-3 gap-x-4 gap-y-7">
              {CERTS.map((c, i) => (
                <HexBadge key={c.code} code={c.code} name={c.name} delay={i * 70} />
              ))}
            </div>
            <Reveal delay={220}>
              <blockquote className="mt-10 border-l-[3px] border-brass pl-5">
                <p className="text-ink text-lg leading-relaxed font-display">
                  âA schedule you can recover. A recordable you can't.â
                </p>
                <p className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-muted mt-3">â Posted in every field office since 1994</p>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="relative z-[2] bg-accent text-[#10141a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-display font-bold uppercase tracking-wide flex items-center gap-3 text-lg">
            <IconBolt className="w-5 h-5" /> 24/7 Site Emergency Line
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="tel:+13125550148" className="font-mono font-bold text-lg hover:underline underline-offset-4 flex items-center gap-2">
              <IconPhone className="w-4 h-4" /> (312) 555-0148
            </a>
            <a href="mailto:safety@constructedge.example?subject=Unsafe%20condition%20report" className="font-mono text-[11.5px] tracking-[0.14em] uppercase border-2 border-[#10141a] px-4 py-2 clip-tag hover:bg-[#10141a] hover:text-accent transition-colors">
              Report unsafe condition
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
