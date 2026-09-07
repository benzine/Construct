import { useEffect, useRef, useState } from "react";
import { CLIENTS, TESTIMONIALS } from "../data";
import { IconQuote, Reveal, SectionHead, TickSep } from "../ui";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    if (paused) return;
    timer.current = window.setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(timer.current);
  }, [paused]);

  const t = TESTIMONIALS[idx];

  return (
    <section id="voices" className="relative bg-bg clip-slash-t noise scroll-mt-10">
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 pt-24 md:pt-36 pb-28">
        <SectionHead
          kicker="Owner Testimony"
          title={<>Clients on the record,<br /> <span className="text-accent">under oath.</span></>}
        />

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
          <Reveal>
            <figure
              className="relative bg-surface border border-line clip-notch-card p-8 md:p-12 min-h-[320px] flex flex-col"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <IconQuote className="w-10 h-10 text-accent absolute top-8 left-8 opacity-90" />
              <div className="pl-0 md:pl-16 mt-8 md:mt-4" aria-live="polite">
                <blockquote
                  key={idx}
                  className="font-display font-medium text-[clamp(1.15rem,2.4vw,1.7rem)] leading-snug text-ink reveal in"
                  style={{ animation: "none" }}
                >
                  â{t.quote}â
                </blockquote>
                <figcaption className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="font-display font-bold uppercase tracking-wide text-ink">{t.name}</span>
                  <span className="font-mono text-[11px] text-muted tracking-[0.1em]">{t.role}</span>
                  <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase bg-accent/15 text-accent border border-accent/40 px-2.5 py-1 clip-tag">
                    {t.project}
                  </span>
                </figcaption>
              </div>
              <div className="mt-auto pt-8 flex items-center justify-between">
                <div className="flex gap-2.5">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      aria-label={`Show testimonial ${i + 1}`}
                      className={`h-[5px] transition-all duration-400 ${i === idx ? "w-10 bg-accent" : "w-5 bg-line hover:bg-steel"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-muted tracking-[0.2em] tabular-nums">
                    {String(idx + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    className="w-10 h-10 grid place-items-center border border-line text-ink hover:border-accent hover:text-accent transition-colors clip-tag"
                    aria-label="Previous testimonial"
                  >
                    â
                  </button>
                  <button
                    onClick={() => setIdx((i) => (i + 1) % TESTIMONIALS.length)}
                    className="w-10 h-10 grid place-items-center border border-line text-ink hover:border-accent hover:text-accent transition-colors clip-tag"
                    aria-label="Next testimonial"
                  >
                    â
                  </button>
                </div>
              </div>
            </figure>
          </Reveal>

          <Reveal variant="right" delay={140}>
            <div className="bg-surface2 border border-line p-7 clip-bevel">
              <p className="font-mono text-[10.5px] tracking-[0.26em] uppercase text-accent mb-5">// Repeat owners</p>
              <p className="text-muted leading-relaxed text-[15px]">
                <span className="font-display font-bold text-ink text-2xl block mb-1">68%</span>
                of our contract volume comes from owners who built with us before. The ledger speaks; they keep signing it.
              </p>
              <div className="border-t border-line mt-6 pt-5">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-3">Exit survey 2025</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`text-lg ${i <= 4 ? "text-brass" : "text-line"}`}>â</span>
                  ))}
                  <span className="font-mono text-[12px] text-ink ml-2 tabular-nums">4.8 / 5.0</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="mt-16 border-y border-line py-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {CLIENTS.map((c, i) => (
              <span key={c} className="flex items-center font-mono text-[11.5px] tracking-[0.24em] text-muted hover:text-ink transition-colors">
                {c}
                {i < CLIENTS.length - 1 && <TickSep />}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
