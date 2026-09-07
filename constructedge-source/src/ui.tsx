import React, { useEffect, useRef } from "react";
import { useInView } from "./hooks";

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "left" | "right" | "pop";
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const v = variant === "left" ? "r-left" : variant === "right" ? "r-right" : variant === "pop" ? "r-pop" : "";
  return (
    <div
      ref={ref}
      className={`reveal ${v} ${inView ? "in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHead({
  kicker,
  title,
  sub,
  right,
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-8 mb-12 md:mb-16">
      <div className="max-w-2xl">
        <Reveal variant="left">
          <p className="font-mono text-[11px] md:text-xs tracking-[0.28em] uppercase text-accent flex items-center gap-3">
            <span className="inline-block w-8 h-[2px] bg-accent shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
            {kicker}
          </p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="font-display font-bold uppercase leading-[0.95] tracking-tight text-[clamp(2rem,5vw,3.6rem)] mt-4 text-ink">
            {title}
          </h2>
        </Reveal>
        {sub && (
          <Reveal delay={170}>
            <p className="text-muted mt-4 text-lg leading-relaxed max-w-xl">{sub}</p>
          </Reveal>
        )}
      </div>
      {right && <Reveal variant="right" delay={200}>{right}</Reveal>}
    </div>
  );
}

/* ---------------- Icon set (inline SVG, stroke = currentColor) ---------------- */
type IcProps = { className?: string };
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconCrane = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M5 21V6l14-3v2.5" /><path d="M5 6.5 12 4" /><path d="M3 21h7" /><path d="M15.5 5v7.5" /><path d="M13.5 12.5h4l-2 3z" />
  </svg>
);
export const IconHelmet = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M4 15.5a8 8 0 0 1 5-7.4V12h6V8.1a8 8 0 0 1 5 7.4" /><path d="M2.5 18.5h19" /><path d="M9 8V5.5h6V8" /><path d="M2.5 15.5h19" />
  </svg>
);
export const IconBeam = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M4 4h16v3.5h-5.5v9H20V20H4v-3.5h5.5v-9H4z" />
  </svg>
);
export const IconDraft = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M12 3v2.5" /><path d="M12 5.5 6.5 20M12 5.5 17.5 20" /><path d="M8.6 14.5a7.6 7.6 0 0 0 6.8 0" /><circle cx="12" cy="5.5" r="1.4" />
  </svg>
);
export const IconCivil = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M3 18h18M3 21h18" /><path d="M4 18V9m16 9V9" /><path d="M4 9l4 4 4-4 4 4 4-4" /><path d="M4 13l4-4 4 4 4-4 4 4" />
  </svg>
);
export const IconTower = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M7 21V5l5-2.5L17 5v16" /><path d="M7 9h10M7 13h10M7 17h10" /><path d="M4 21h16" /><path d="M12 2.5V6" />
  </svg>
);
export const IconFactory = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M3 21V10l5 3v-3l5 3v-3l5 3V7h3v14z" /><path d="M8 17h2m4 0h2" /><path d="M3 21h18" />
  </svg>
);
export const IconRetro = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M14.5 6.5 4 17l3 3L17.5 9.5" /><path d="M13 4.5 15 2.5l6.5 6.5-2 2a4.6 4.6 0 0 1-6.5-6.5z" /><path d="M5.5 15.5l3 3" />
  </svg>
);
export const IconPrecon = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <rect x="4" y="3" width="16" height="18" /><path d="M8 7.5h8M8 11h5" /><path d="M8 15.5h2m2 0h2" /><path d="M16 21v-4h4" />
  </svg>
);
export const IconShield = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M12 3 5 6v5.5c0 4.6 3 8 7 9.5 4-1.5 7-4.9 7-9.5V6z" /><path d="M9 12l2.2 2.2L15.5 10" />
  </svg>
);
export const IconHook = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M12 2v9" /><path d="M12 11a4.5 4.5 0 1 0 4.5 4.5" /><path d="M12 2h.01" /><rect x="9.5" y="4" width="5" height="3" />
  </svg>
);
export const IconSun = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5m0 14v2.5M2.5 12H5m14 0h2.5M4.8 4.8l1.8 1.8m10.8 10.8 1.8 1.8m0-14.4-1.8 1.8M6.6 17.4l-1.8 1.8" />
  </svg>
);
export const IconMoon = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /><path d="M16 4.5h4m-2-2v4" />
  </svg>
);
export const IconArrow = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M4 12h15m-6-7 7 7-7 7" />
  </svg>
);
export const IconArrowUR = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M6 18 18 6M9 6h9v9" />
  </svg>
);
export const IconMenu = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M3 6.5h18M3 12h12M3 17.5h18" />
  </svg>
);
export const IconClose = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);
export const IconPhone = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M5 4h4l1.5 4.5-2.2 1.7a13 13 0 0 0 5.5 5.5l1.7-2.2L20 15v4a1.8 1.8 0 0 1-2 1.8A16.8 16.8 0 0 1 3.2 6 1.8 1.8 0 0 1 5 4z" />
  </svg>
);
export const IconPin = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.4" />
  </svg>
);
export const IconMail = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <rect x="3" y="5.5" width="18" height="13" /><path d="m3 7.5 9 6 9-6" />
  </svg>
);
export const IconCheck = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);
export const IconBolt = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5z" />
  </svg>
);
export const IconQuote = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
    <path d="M5 6h6v6H7.5c0 2.2 1 3.4 3.5 3.8V19c-4.4-.5-6-3.3-6-7.5V6zm8.5 0H20v6h-3.5c0 2.2 1 3.4 3.5 3.8V19c-4.4-.5-6-3.3-6-7.5V6z" />
  </svg>
);
export const IconChat = ({ className = "w-6 h-6" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="M4 5.5h16v11H10l-4.5 3.5v-3.5H4z" /><path d="M8 9.5h8M8 12.5h5" />
  </svg>
);
export const IconSend = ({ className = "w-5 h-5" }: IcProps) => (
  <svg viewBox="0 0 24 24" className={className} {...S}>
    <path d="m3.5 11 17-7-4.5 16-4-6.5z" /><path d="m12 13.5 4.5-4.5" />
  </svg>
);

/* ---------------- Hex nut badge ---------------- */
export function HexBadge({ code, name, delay = 0 }: { code: string; name: string; delay?: number }) {
  return (
    <Reveal variant="pop" delay={delay}>
      <div className="group flex flex-col items-center gap-3">
        <div className="clip-hex bg-surface2 p-[1.5px] transition-transform duration-300 group-hover:-translate-y-1.5">
          <div className="clip-hex bg-surface w-[104px] h-[104px] md:w-[120px] md:h-[120px] flex items-center justify-center">
            <span className="font-display font-bold text-lg md:text-xl text-brass group-hover:text-accent transition-colors">
              {code}
            </span>
          </div>
        </div>
        <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted text-center">{name}</p>
      </div>
    </Reveal>
  );
}

/* ---------------- Ticker separator ---------------- */
export function TickSep() {
  return (
    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-accent inline-block mx-5 shrink-0" aria-hidden="true">
      <path d="M6 0.8 11.2 6 6 11.2 0.8 6Z" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Stair-step edge ---------------- */
export function StairEdge({ flip = false, fill = "var(--bg)", className = "" }: { flip?: boolean; fill?: string; className?: string }) {
  const steps = 8;
  const H = 100;
  const w = 100 / steps;
  const runs: string[] = [];
  for (let i = 0; i < steps; i++) {
    const y = ((H / steps) * (i + 1)).toFixed(2);
    runs.push(`${(i * w).toFixed(2)},${y}`, `${((i + 1) * w).toFixed(2)},${y}`);
  }
  const d = flip
    ? `M0,100 ${runs.map((p) => { const [x, y] = p.split(","); return `L${x},${(100 - Number(y)).toFixed(2)}`; }).join(" ")} L100,100 Z`
    : `M0,0 H100 V100 ${[...runs].reverse().map((p) => `L${p}`).join(" ")} Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`block w-full ${className}`} aria-hidden="true">
      <path d={d} fill={fill} />
    </svg>
  );
}

/* ---------------- Scroll progress ---------------- */
export function useScrollProgress<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useStateLocal(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let tick = false;
    const on = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = el.offsetHeight - vh;
        if (total <= 0) return;
        const prog = Math.min(1, Math.max(0, -r.top / total));
        setP(prog);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return [ref, p];
}

import { useState as useStateLocal } from "react";
