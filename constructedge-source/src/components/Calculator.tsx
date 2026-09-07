import { useMemo, useState } from "react";
import { CALC, fmtMoney } from "../data";
import { scrollToId, useTween } from "../hooks";
import { IconArrowUR, Reveal, SectionHead } from "../ui";

const MIN = 2000;
const RATIO = 250;

export default function Calculator() {
  const [typeId, setTypeId] = useState(CALC.types[1].id);
  const [qualityId, setQualityId] = useState(CALC.quality[0].id);
  const [timelineId, setTimelineId] = useState(CALC.timeline[0].id);
  const [locId, setLocId] = useState(CALC.location[1].id);
  const [v, setV] = useState(46);

  const sqft = useMemo(() => Math.round((MIN * Math.pow(RATIO, v / 100)) / 100) * 100, [v]);
  const type = CALC.types.find((t) => t.id === typeId)!;
  const quality = CALC.quality.find((q) => q.id === qualityId)!;
  const timeline = CALC.timeline.find((t) => t.id === timelineId)!;
  const loc = CALC.location.find((l) => l.id === locId)!;

  const mid = sqft * type.base * quality.mult * timeline.mult * loc.mult;
  const low = mid * (1 - CALC.variance);
  const high = mid * (1 + CALC.variance);

  const tLow = useTween(low);
  const tHigh = useTween(high);
  const tSqft = useTween(sqft, 350);
  const duration = Math.max(4, Math.round(sqft / 9000));

  const summary = `Project type: ${type.name}%0AFootprint: ${sqft.toLocaleString()} sq-ft%0AQuality: ${quality.name}%0ASchedule: ${timeline.name}%0ASite: ${loc.name}%0AROM range: ${fmtMoney(low)} â ${fmtMoney(high)}`;

  return (
    <section id="calculator" className="relative bg-bg2 clip-slash-t noise scroll-mt-10">
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 pt-24 md:pt-36 pb-28">
        <SectionHead
          kicker="ROM Estimator"
          title={<>Ballpark the build<br /> <span className="text-accent">before the call.</span></>}
          sub="Our preconstruction desk prices with 5D BIM. This is the same formula's skeleton â slide the inputs, watch the number move."
        />

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-start">
          <Reveal variant="left">
            <div className="bg-surface border border-line clip-notch-card p-7 md:p-9 space-y-7">
              <label className="block">
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">01 â Project type</span>
                <select className="field" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                  {CALC.types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} â ${t.base}/sq-ft base
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">
                  02 â Footprint â <span className="text-accent">{Math.round(tSqft).toLocaleString()} sq-ft</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={v}
                  onChange={(e) => setV(Number(e.target.value))}
                  className="slider"
                  style={{ "--fill": `${v}%` } as React.CSSProperties}
                  aria-label="Building footprint in square feet"
                />
                <div className="flex justify-between font-mono text-[10px] text-muted mt-1.5">
                  <span>2,000</span>
                  <span>500,000</span>
                </div>
              </div>

              <div>
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-3">03 â Finish & systems tier</span>
                <div className="grid grid-cols-3 gap-2">
                  {CALC.quality.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setQualityId(q.id)}
                      aria-pressed={qualityId === q.id}
                      className={`clip-tag px-3 py-3 font-display font-semibold text-[12.5px] uppercase tracking-wide transition-all duration-200 ${
                        qualityId === q.id ? "bg-accent text-[#10141a] shadow-[var(--glow)]" : "bg-surface2 text-muted border border-line hover:text-ink hover:border-accent/50"
                      }`}
                    >
                      {q.name}
                    </button>
                  ))}
                </div>
                <p className="font-mono text-[10.5px] text-muted mt-2 tracking-[0.06em]">// {quality.note}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-3">04 â Schedule</span>
                  <div className="grid grid-cols-2 gap-2">
                    {CALC.timeline.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTimelineId(t.id)}
                        aria-pressed={timelineId === t.id}
                        className={`clip-tag px-2 py-3 font-display font-semibold text-[11.5px] uppercase tracking-wide transition-all duration-200 ${
                          timelineId === t.id ? "bg-accent text-[#10141a]" : "bg-surface2 text-muted border border-line hover:text-ink hover:border-accent/50"
                        }`}
                      >
                        {t.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="block">
                  <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-3">05 â Site context</span>
                  <select className="field" value={locId} onChange={(e) => setLocId(e.target.value)}>
                    {CALC.location.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <div className="relative bg-surface border-2 border-dashed border-steel/50 p-7 md:p-9 clip-bevel">
              <div className="absolute -top-3.5 left-8 bg-bg2 px-3 font-mono text-[10px] tracking-[0.28em] uppercase text-muted">
                Estimate Sheet Â· Rev C
              </div>
              <div className="font-mono text-[11px] text-muted tracking-[0.1em] space-y-2.5">
                {[
                  ["BASE RATE", `$${type.base} / sq-ft`],
                  ["FOOTPRINT", `${sqft.toLocaleString()} sq-ft`],
                  ["QUALITY FACTOR", `Ã ${quality.mult.toFixed(2)}`],
                  ["SCHEDULE FACTOR", `Ã ${timeline.mult.toFixed(2)}`],
                  ["SITE FACTOR", `Ã ${loc.mult.toFixed(2)}`],
                  ["EST. DURATION", `â ${duration} months`],
                ].map(([k, val]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <span className="uppercase">{k}</span>
                    <span className="flex-1 border-b border-dotted border-steel/40 translate-y-[-3px]" />
                    <span className="text-ink tabular-nums">{val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t-2 border-accent/70">
                <p className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-accent">ROM range Â· Â±{Math.round(CALC.variance * 100)}%</p>
                <p className="font-display font-bold text-[clamp(1.9rem,4vw,2.9rem)] text-ink leading-tight mt-2 tabular-nums">
                  {fmtMoney(tLow)} <span className="text-muted font-medium text-[0.6em]">â</span> {fmtMoney(tHigh)}
                </p>
                <p className="font-mono text-[10.5px] text-muted mt-2 tracking-[0.06em]">
                  // Order-of-magnitude. A GMP from our precon desk lands at Â±3%.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href={`mailto:precon@constructedge.example?subject=ROM%20Estimate%20Request&body=${summary}`} className="btn-slab btn-ghost px-5 py-3 text-[12px] uppercase">
                  Email me this
                </a>
                <button onClick={() => scrollToId("contact")} className="btn-slab btn-primary px-5 py-3 text-[12px] uppercase">
                  Request detailed quote <IconArrowUR className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
