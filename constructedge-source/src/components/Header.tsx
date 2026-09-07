import { useEffect, useRef, useState } from "react";
import { scrollToId, useScrollY, type Theme } from "../hooks";
import { OFFICES, PROJECTS, SERVICES } from "../data";
import { useBO, NAV_LABELS, type MegaVariant } from "../bo";
import { IconArrowUR, IconClose, IconMenu, IconMoon, IconPhone, IconPin, IconSun } from "../ui";

function Logo({ compact }: { compact: boolean }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className="flex items-center gap-3 group"
      aria-label="ConstructEdge â back to top"
    >
      <span className={`grid place-items-center bg-accent text-[#10141a] clip-tag transition-all duration-300 ${compact ? "w-8 h-8" : "w-10 h-10"}`}>
        <svg viewBox="0 0 24 24" className="w-[62%] h-[62%]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 17a8 8 0 0 1 16 0v1.5H4z" fill="currentColor" stroke="none" />
          <path d="M2.5 20.5h19" />
          <path d="M10 9V6h4v3" />
        </svg>
      </span>
      <span className="text-left leading-none">
        <span className={`font-display font-bold tracking-[0.06em] text-ink block transition-all duration-300 ${compact ? "text-[15px]" : "text-[17px]"}`}>
          CONSTRUCT<span className="text-accent">EDGE</span>
        </span>
        {!compact && (
          <span className="font-mono text-[9px] tracking-[0.34em] text-muted uppercase block mt-1">Group Â· Est. 1987</span>
        )}
      </span>
    </button>
  );
}

/* ---------- mega panel content variants ---------- */
function MegaServices({ go }: { go: (href: string) => void }) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr_0.9fr]">
      <div className="p-7 border-r border-line">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-4">// Construction Zones</p>
        <ul className="space-y-2.5">
          {SERVICES.map((s) => (
            <li key={s.code}>
              <a href="#services" onClick={(e) => { e.preventDefault(); go("#services"); }} className="group flex items-baseline gap-3 hover:text-accent transition-colors">
                <span className="font-mono text-[10px] text-muted group-hover:text-accent">{s.code}</span>
                <span className="font-display font-semibold text-[15px]">{s.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-7 border-r border-line">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-4">// Featured Pour</p>
        <a href="#work" onClick={(e) => { e.preventDefault(); go("#work"); }} className="group block">
          <div className="overflow-hidden clip-tag">
            <img src={PROJECTS[0].img} alt="Meridian One Tower" className="w-full h-36 object-cover img-develop transition-transform duration-700 group-hover:scale-105" />
          </div>
          <p className="font-display font-semibold mt-3 group-hover:text-accent transition-colors">{PROJECTS[0].name}</p>
          <p className="font-mono text-[11px] text-muted mt-1">{PROJECTS[0].loc} Â· {PROJECTS[0].value} Â· {PROJECTS[0].year}</p>
        </a>
      </div>
      <div className="p-7">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-4">// Quick Quote</p>
        <p className="text-[14px] text-muted leading-relaxed">
          Tell us the footprint and the deadline. A ROM number lands in your inbox within 48 hours.
        </p>
        <button onClick={() => go("#calculator")} className="btn-slab btn-ghost px-4 py-2 text-[12px] uppercase mt-4">
          Cost Calculator <IconArrowUR className="w-4 h-4" />
        </button>
        <button onClick={() => go("#contact")} className="btn-slab btn-primary px-4 py-2 text-[12px] uppercase mt-2.5 w-full justify-center">
          Start a Project
        </button>
      </div>
    </div>
  );
}

function MegaProjects({ go }: { go: (href: string) => void }) {
  return (
    <div className="p-7">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-5">// From the Project Ledger</p>
      <div className="grid grid-cols-3 gap-5">
        {PROJECTS.slice(0, 3).map((pr) => (
          <a key={pr.id} href="#work" onClick={(e) => { e.preventDefault(); go("#work"); }} className="group">
            <div className="overflow-hidden clip-tag">
              <img src={pr.img} alt={pr.name} className="w-full h-32 object-cover img-develop transition-transform duration-700 group-hover:scale-105" />
            </div>
            <p className="font-display font-semibold text-[14px] mt-2.5 group-hover:text-accent transition-colors">{pr.name}</p>
            <p className="font-mono text-[10.5px] text-muted mt-0.5">{pr.loc} Â· {pr.value}</p>
          </a>
        ))}
      </div>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-line">
        <p className="font-mono text-[10.5px] text-muted">6 of 1,240 entries shown â the full ledger ships under NDA.</p>
        <button onClick={() => go("#work")} className="btn-slab btn-ghost px-4 py-2 text-[12px] uppercase">
          Open the ledger <IconArrowUR className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MegaOffices({ go }: { go: (href: string) => void }) {
  return (
    <div className="p-7 grid grid-cols-[1.2fr_1fr] gap-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-5">// Field Offices</p>
        <ul className="space-y-4">
          {OFFICES.map((o) => (
            <li key={o.city} className="flex gap-3.5">
              <IconPin className="w-4.5 h-4.5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-semibold text-[14.5px]">{o.city}</p>
                <p className="text-muted text-[12.5px]">{o.addr}</p>
                <a href={`tel:${o.phone.replace(/[^0-9]/g, "")}`} className="font-mono text-[11.5px] text-accent">{o.phone}</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-5">// Direct Lines</p>
        <a href="tel:+13125550148" className="flex items-center gap-2.5 font-mono text-[13px] hover:text-accent transition-colors">
          <IconPhone className="w-4 h-4 text-accent" /> 24/7 emergency â (312) 555-0148
        </a>
        <p className="text-[13.5px] text-muted leading-relaxed mt-4">
          Site visits by appointment. Bring your own hard hat â or borrow one of ours.
        </p>
        <button onClick={() => go("#contact")} className="btn-slab btn-primary px-4 py-2 text-[12px] uppercase mt-5 w-full justify-center">
          Book a site visit
        </button>
      </div>
    </div>
  );
}

export default function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const bo = useBO();
  const y = useScrollY();
  const compact = y > 50;
  const [megaFor, setMegaFor] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [prog, setProg] = useState(0);
  const enterT = useRef(0);
  const leaveT = useRef(0);

  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProg(max > 0 ? window.scrollY / max : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const go = (href: string) => {
    setDrawer(false);
    setMegaFor(null);
    scrollToId(href.slice(1));
  };

  const megaEnter = (label: string) => {
    if (!bo.nav[label]?.enabled) return;
    clearTimeout(leaveT.current);
    enterT.current = window.setTimeout(() => setMegaFor(label), 130);
  };
  const megaLeave = () => {
    clearTimeout(enterT.current);
    leaveT.current = window.setTimeout(() => setMegaFor(null), 220);
  };

  const openVariant: MegaVariant | null = megaFor ? bo.nav[megaFor]?.variant ?? null : null;
  const anyMegaOpen = !!megaFor && bo.nav[megaFor]?.enabled;

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50">
        <div
          className={`hidden md:flex items-center justify-between px-6 lg:px-10 h-9 bg-bg2/95 border-b border-line font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted transition-all duration-300 overflow-hidden ${
            compact ? "h-0 opacity-0 border-transparent" : ""
          }`}
        >
          <a href="tel:+13125550148" className="flex items-center gap-2 hover:text-accent transition-colors">
            <IconPhone className="w-3.5 h-3.5 text-accent" /> 24/7 Emergency Line â (312) 555-0148
          </a>
          <div className="flex items-center gap-6">
            <span className="hidden lg:inline">Chicago Â· Denver Â· Seattle</span>
            <span className="text-accent">Field offices open 06:00â18:00 CT</span>
          </div>
        </div>

        <header
          className={`relative flex items-center justify-between px-5 lg:px-10 transition-all duration-300 ${
            compact
              ? "h-14 bg-surface/95 backdrop-blur-md border-b border-line border-t-[3px] border-t-accent shadow-[var(--shadow)]"
              : "h-[72px] bg-transparent"
          }`}
        >
          <Logo compact={compact} />

          {/* nav â items hang from cables off the jib; any item can drop a mega */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Primary">
            {NAV_LABELS.map((label) => {
              const href = `#${label.toLowerCase()}`;
              const mega = bo.nav[label]?.enabled;
              return (
                <div key={label} className="relative" onMouseEnter={() => megaEnter(label)} onMouseLeave={megaLeave}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(href);
                    }}
                    className={`link-laser group relative inline-flex flex-col items-center pt-2 font-display font-medium text-[12.5px] uppercase tracking-[0.16em] transition-colors ${
                      megaFor === label ? "text-accent active" : "text-ink hover:text-accent"
                    }`}
                    aria-expanded={mega ? megaFor === label : undefined}
                  >
                    <span className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-steel/60 transition-all duration-300 h-[5px] group-hover:h-[8px] group-hover:bg-accent" />
                    <span className="transition-transform duration-300 group-hover:translate-y-[3px] inline-block flex items-center gap-1.5">
                      {label}
                      {mega && (
                        <svg viewBox="0 0 10 6" className={`w-2 h-1.5 transition-transform duration-300 ${megaFor === label ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M1 1l4 4 4-4" />
                        </svg>
                      )}
                    </span>
                  </a>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              role="switch"
              aria-checked={theme === "dark"}
              aria-label={`Switch to ${theme === "dark" ? "day" : "night"} shift`}
              title={theme === "dark" ? "Night Shift â switch to Day Shift" : "Day Shift â switch to Night Shift"}
              className="relative flex items-center w-[74px] h-9 bg-surface2 border border-line clip-tag group overflow-hidden"
            >
              <span className="absolute inset-0 grid grid-cols-2 place-items-center">
                <IconSun className={`w-4 h-4 transition-colors ${theme === "light" ? "text-accent" : "text-muted"}`} />
                <IconMoon className={`w-4 h-4 transition-colors ${theme === "dark" ? "text-accent" : "text-muted"}`} />
              </span>
              <span
                className={`absolute top-[3px] bottom-[3px] w-[32px] bg-accent clip-tag transition-transform duration-300 ease-out ${
                  theme === "dark" ? "translate-x-[37px]" : "translate-x-[3px]"
                }`}
              />
            </button>

            <button onClick={() => go("#contact")} className="btn-slab btn-primary px-5 py-2.5 text-[12.5px] uppercase hidden xl:inline-flex">
              Request Quote
            </button>

            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden grid place-items-center w-11 h-11 border border-line text-ink hover:text-accent hover:border-accent transition-colors clip-tag"
              aria-label="Open menu"
            >
              <IconMenu />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent">
            <div className="h-full bg-accent shadow-[0_0_8px_rgba(255,107,0,0.8)] transition-[width] duration-150 ease-out" style={{ width: `${prog * 100}%` }} />
          </div>

          {/* mega dropdown â staggered steel-beam layers, variant-driven */}
          <div
            className={`absolute left-1/2 top-full -translate-x-1/2 mt-3 w-[min(940px,94vw)] bg-surface border border-line shadow-[var(--shadow)] clip-notch-card transition-all duration-300 hidden lg:block ${
              anyMegaOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"
            }`}
            onMouseEnter={() => megaFor && megaEnter(megaFor)}
            onMouseLeave={megaLeave}
          >
            <div className={`transition-opacity duration-200 ${anyMegaOpen ? "opacity-100" : "opacity-0"}`}>
              {openVariant === "services" && <MegaServices go={go} />}
              {openVariant === "projects" && <MegaProjects go={go} />}
              {openVariant === "offices" && <MegaOffices go={go} />}
            </div>
            {anyMegaOpen && (
              <p className="px-7 py-2.5 border-t border-line font-mono text-[9.5px] tracking-[0.24em] uppercase text-muted flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rotate-45 inline-block" />
                {megaFor} â steel beam drop Â· assigned in Site Office â Mega Menu
              </p>
            )}
          </div>
        </header>
      </div>

      {/* mobile drawbridge drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${drawer ? "" : "pointer-events-none"}`} aria-hidden={!drawer}>
        <div
          className={`absolute inset-0 bg-[rgba(5,8,13,0.72)] transition-opacity duration-400 ${drawer ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawer(false)}
        />
        <div
          className={`absolute top-0 inset-x-0 bg-bg2 border-b-4 border-accent shadow-[var(--shadow)] transition-transform duration-500 ease-[cubic-bezier(0.22,0.9,0.24,1)] ${
            drawer ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-14 border-b border-line">
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full border border-steel/70" />
              ))}
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted ml-2">Drawbridge Â· Open</span>
            </div>
            <button onClick={() => setDrawer(false)} className="grid place-items-center w-10 h-10 border border-line text-ink hover:text-accent hover:border-accent transition-colors" aria-label="Close menu">
              <IconClose />
            </button>
          </div>
          <nav className="px-6 py-7 flex flex-col gap-1" aria-label="Mobile">
            {NAV_LABELS.concat("Contact").map((label, i) => {
              const href = `#${label.toLowerCase()}`;
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(href);
                  }}
                  className={`flex items-center justify-between py-3 border-b border-line/60 font-display font-bold uppercase text-2xl tracking-wide text-ink hover:text-accent transition-all duration-500 ${
                    drawer ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  }`}
                  style={{ transitionDelay: drawer ? `${90 + i * 55}ms` : "0ms" }}
                >
                  <span className="flex items-center gap-3">
                    {label}
                    {label !== "Contact" && bo.nav[label]?.enabled && (
                      <span className="font-mono text-[9px] tracking-[0.2em] text-accent border border-accent/50 px-1.5 py-0.5">MEGA</span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-muted">0{i + 1}</span>
                </a>
              );
            })}
          </nav>
          <div className="px-6 pb-8 flex items-center justify-between">
            <a href="tel:+13125550148" className="flex items-center gap-2 font-mono text-sm text-accent">
              <IconPhone className="w-4 h-4" /> (312) 555-0148
            </a>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted">Est. 1987</span>
          </div>
        </div>
      </div>
    </>
  );
}
