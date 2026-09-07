import type { CSSProperties } from "react";
import { METHOD } from "../data";
import { Reveal, SectionHead } from "../ui";

export default function Method() {
  return (
    <section id="method" className="relative bg-bg clip-slash-t noise scroll-mt-10 overflow-hidden">
      <div className="absolute inset-0 bp-grid opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" aria-hidden="true" />
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 pt-24 md:pt-36 pb-32">
        <SectionHead
          kicker="The Method"
          title={<>Five phases descend<br /> like <span className="text-accent">stadium terraces.</span></>}
          sub="No phase starts blind. Each terrace steps down from the one above it â cost certainty first, steel last."
        />

        <div className="relative">
          <div className="absolute left-0 right-0 top-8 h-[2px] bg-gradient-to-r from-accent via-accent/40 to-transparent hidden lg:block" aria-hidden="true" />
          <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-5">
            {METHOD.map((m, i) => (
              <Reveal key={m.n} variant="left" delay={i * 120} className="flex-1 lg:mt-[var(--mt)]">
                <div style={{ "--mt": `${i * 3.1}rem` } as CSSProperties} className="h-full">
                  <article className="group relative bg-surface border border-line p-6 md:p-7 clip-notch-card h-full transition-all duration-300 hover:border-accent/70 hover:-translate-y-1.5 hover:shadow-[var(--shadow)]">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-4xl md:text-5xl text-transparent [-webkit-text-stroke:1.3px_var(--steel)] group-hover:[-webkit-text-stroke:1.3px_var(--accent)] transition-all">
                        {m.n}
                      </span>
                      <span className="w-3.5 h-3.5 rotate-45 border-2 border-accent bg-bg group-hover:bg-accent transition-colors" aria-hidden="true" />
                    </div>
                    <h3 className="font-display font-bold uppercase text-lg text-ink tracking-wide mt-4">{m.title}</h3>
                    <p className="text-muted text-[14.5px] leading-relaxed mt-2.5">{m.desc}</p>
                    <p className="font-mono text-[10.5px] tracking-[0.2em] text-brass mt-5 border-t border-line pt-3.5 uppercase">{m.dur}</p>
                  </article>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mt-14 flex flex-wrap items-center gap-6 justify-between">
            <p className="font-mono text-[11.5px] tracking-[0.16em] uppercase text-muted max-w-xl leading-loose">
              // Every phase gates on a signed checklist â the next terrace doesn't pour until the one above cures.
            </p>
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="block bg-accent/80" style={{ width: 10 + i * 4, height: 10 + i * 4, clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} aria-hidden="true" />
              ))}
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent ml-2">Phase gates</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
