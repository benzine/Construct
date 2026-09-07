import { STATS, TICKER } from "../data";
import { useCountUp, useInView } from "../hooks";
import { Reveal, StairEdge, TickSep } from "../ui";

/* ---------------- certification ticker ---------------- */
export function Ticker() {
  const row = (hidden: boolean) => (
    <div className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
      {TICKER.map((t) => (
        <span key={t + (hidden ? "-b" : "-a")} className="flex items-center font-mono text-[11.5px] tracking-[0.22em] uppercase text-muted whitespace-nowrap">
          {t}
          <TickSep />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative bg-bg2 border-y border-line overflow-hidden py-3.5" role="marquee" aria-label="Company credentials">
      <div className="ticker-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* ---------------- counting stats band ---------------- */
function Stat({ value, suffix, label, note, decimals = 0, delay }: { value: number; suffix: string; label: string; note: string; decimals?: number; delay: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const n = useCountUp(value, inView, { decimals, duration: 1900 });
  return (
    <div ref={ref} className="relative px-6 py-5 md:px-8 md:py-6">
      <Reveal delay={delay}>
        <p className="font-mono font-bold text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink tabular-nums">
          {n}
          <span className="text-accent">{suffix}</span>
        </p>
        <p className="font-display font-semibold uppercase tracking-[0.14em] text-[12.5px] text-ink mt-3">{label}</p>
        <p className="font-mono text-[10px] text-muted tracking-[0.08em] mt-1 leading-relaxed">{note}</p>
      </Reveal>
    </div>
  );
}

export function StatsBand() {
  return (
    <section className="relative bg-bg overflow-hidden">
      <StairEdge fill="var(--bg2)" className="h-6 md:h-8" />
      <div className="relative grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-line border-x border-line max-w-7xl mx-auto">
        {STATS.map((s, i) => (
          <Stat key={s.label} {...s} delay={i * 110} />
        ))}
      </div>
      <StairEdge flip fill="var(--bg2)" className="h-6 md:h-8" />
    </section>
  );
}
