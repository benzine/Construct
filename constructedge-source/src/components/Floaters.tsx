import { useScrollY } from "../hooks";
import { IconHook } from "../ui";

export default function BackToTop() {
  const y = useScrollY();
  const visible = y > 480;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`fixed z-[65] right-5 bottom-6 w-12 h-12 grid place-items-center bg-surface border-2 border-steel text-steel clip-tag transition-all duration-400 group hover:border-accent hover:text-accent hover:shadow-[var(--glow)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <IconHook className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="absolute inset-x-0 top-0 h-[3px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" aria-hidden="true" />
    </button>
  );
}
