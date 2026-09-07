import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks";

export default function Loader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [fold, setFold] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setFold(true), reduced ? 250 : 1350);
    const t2 = window.setTimeout(() => setGone(true), reduced ? 400 : 1950);
    const t3 = window.setTimeout(onDone, reduced ? 450 : 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone, reduced]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-bg2 flex items-center justify-center transition-all duration-500 ease-in-out ${
        fold ? "opacity-0 pointer-events-none [clip-path:inset(0_0_100%_0)]" : "opacity-100 [clip-path:inset(0_0_0%_0)]"
      }`}
      aria-hidden="true"
    >
      <div className="bp-grid-fine absolute inset-0 opacity-60" />
      <div className="relative text-center px-6">
        <svg viewBox="0 0 220 120" className="w-[260px] md:w-[320px] mx-auto" fill="none">
          <rect x="10" y="10" width="200" height="100" stroke="var(--steel)" strokeWidth="1" pathLength={1} className="draw-path" style={{ animationDelay: "0ms" }} />
          <path d="M10 110 110 10 210 110" stroke="var(--steel)" strokeWidth="0.8" pathLength={1} className="draw-path" style={{ animationDelay: "180ms" }} opacity="0.7" />
          <path d="M60 110V62h40v48M120 110V45h45v65" stroke="var(--accent)" strokeWidth="1.4" pathLength={1} className="draw-path" style={{ animationDelay: "340ms" }} />
          <path d="M10 118h60M160 118h50" stroke="var(--steel)" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="110" cy="10" r="3" fill="var(--accent)" className="blink" />
        </svg>
        <p className="font-mono text-[11px] tracking-[0.42em] uppercase text-muted mt-6">
          ConstructEdge <span className="text-accent">//</span> Loading site plan
        </p>
      </div>
    </div>
  );
}
