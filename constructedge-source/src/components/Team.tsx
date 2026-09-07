import { CREW } from "../data";
import { useTilt } from "../hooks";
import { IconHelmet, Reveal, SectionHead } from "../ui";

function CrewCard({ m, delay }: { m: (typeof CREW)[number]; delay: number }) {
  const { ref, onMove, onLeave } = useTilt<HTMLDivElement>(7);
  return (
    <Reveal variant="pop" delay={delay}>
      <article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="tilt-card group bg-surface border border-line clip-notch-card overflow-hidden hover:border-accent/70 h-full"
      >
        <div className="relative h-52 bp-grid-fine bg-surface2 overflow-hidden">
          <span className="absolute inset-0 grid place-items-center font-display font-bold text-[84px] text-steel/35 group-hover:text-accent/30 transition-colors duration-500 select-none">
            {m.initials}
          </span>
          <span className="absolute bottom-3 right-3 text-accent transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-8deg]">
            <IconHelmet className="w-12 h-12" />
          </span>
          <span className="absolute top-0 left-0 h-[5px] w-0 bg-accent group-hover:w-full transition-all duration-500" aria-hidden="true" />
          <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.22em] uppercase text-muted bg-bg2/80 px-2.5 py-1">
            {m.years} yrs field
          </span>
        </div>
        <div className="p-6">
          <h3 className="font-display font-bold text-xl uppercase tracking-wide text-ink">{m.name}</h3>
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent mt-1">{m.role}</p>
          <p className="text-muted text-[14px] leading-relaxed mt-3">{m.focus}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {m.creds.map((c) => (
              <span key={c} className="font-mono text-[10px] border border-brass/50 text-brass px-2 py-0.5 tracking-[0.1em]">
                {c}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Team() {
  return (
    <section id="crew" className="relative bg-bg clip-slash-t noise scroll-mt-10">
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 pt-24 md:pt-36 pb-28">
        <SectionHead
          kicker="The Crew"
          title={<>The people who<br /> <span className="text-accent">sign the drawings.</span></>}
          sub="Leadership averages 20+ years in the field. Every one of them has worn the white hat on a pour â not just in a boardroom."
          right={
            <div className="text-right">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted leading-loose">
                Open roles â <a href="mailto:careers@constructedge.example?subject=Open%20roles" className="text-accent hover:underline underline-offset-4">07 positions</a>
              </p>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted leading-loose">
                Craft roster â <span className="text-ink">340 direct-hire</span>
              </p>
            </div>
          }
        />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {CREW.map((m, i) => (
            <CrewCard key={m.name} m={m} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
