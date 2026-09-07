import { useEffect, useRef } from "react";
import { usePointerFine, usePrefersReducedMotion } from "../hooks";

/* Custom cursor: blueprint crosshair â T-square on hover â laser-level snap on click */
export default function Cursor() {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("fancy-cursor");
      return;
    }
    document.documentElement.classList.add("fancy-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let hovering = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const d = dotRef.current;
      if (d) d.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const t = e.target as HTMLElement | null;
      const hot = !!t?.closest?.("a, button, [role='button'], input, select, textarea, label, .tilt-card");
      if (hot !== hovering) {
        hovering = hot;
        const r = ringRef.current;
        if (r) {
          r.classList.toggle("cursor-hot", hovering);
          r.setAttribute("data-hot", hovering ? "1" : "0");
        }
      }
    };

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      const r = ringRef.current;
      if (r) r.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const snap = (e: MouseEvent) => {
      const h = document.createElement("span");
      h.className = "laser-h";
      h.style.top = `${e.clientY}px`;
      const v = document.createElement("span");
      v.className = "laser-v";
      v.style.left = `${e.clientX}px`;
      document.body.append(h, v);
      window.setTimeout(() => h.remove(), 420);
      window.setTimeout(() => v.remove(), 420);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mousedown", snap);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("fancy-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousedown", snap);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ marginLeft: -19, marginTop: -19 }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38" className="block">
          <rect x="1.5" y="1.5" width="35" height="35" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.85" />
          <path d="M19 6v8M19 24v8M6 19h8M24 19h8" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="12" y="12" width="14" height="14" fill="var(--grid)" opacity="0.5" />
        </svg>
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[9999] pointer-events-none will-change-transform"
        style={{ marginLeft: -2.5, marginTop: -2.5 }}
      >
        <span className="block w-[5px] h-[5px] bg-accent rotate-45 shadow-[0_0_8px_rgba(255,107,0,0.9)]" />
      </div>
    </>
  );
}
