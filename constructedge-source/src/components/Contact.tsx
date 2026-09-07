import { useMemo, useRef, useState } from "react";
import { CALC, OFFICES } from "../data";
import { scrollToId } from "../hooks";
import { IconCheck, IconPin, Reveal, SectionHead } from "../ui";

type FormState = {
  projType: string;
  sqft: string;
  city: string;
  budget: string;
  timeline: string;
  scope: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

const INIT: FormState = {
  projType: "", sqft: "", city: "", budget: "", timeline: "", scope: "",
  name: "", company: "", email: "", phone: "", message: "", website: "",
};

const STEPS = ["Project", "Scope", "Contact"];

export default function Contact() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormState>(INIT);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [phase, setPhase] = useState<"idle" | "sending" | "done">("idle");
  const refNo = useMemo(() => `CE-2026-${Math.floor(1000 + Math.random() * 9000)}`, []);
  const sparks = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ sx: `${Math.cos((i / 10) * Math.PI * 2) * 46}px`, sy: `${Math.sin((i / 10) * Math.PI * 2) * 46}px`, d: `${i * 40}ms` })),
    [],
  );

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (s === 0) {
      if (!f.projType) e.projType = "Select a project type";
      if (!f.sqft.trim() || isNaN(Number(f.sqft.replace(/,/g, "")))) e.sqft = "Enter the approximate sq-ft";
      if (!f.city.trim()) e.city = "Where is the site?";
    }
    if (s === 1) {
      if (!f.budget) e.budget = "Pick a budget band";
      if (!f.timeline) e.timeline = "Pick a target";
    }
    if (s === 2) {
      if (!f.name.trim()) e.name = "Your name, please";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = "Enter a valid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(2, s + 1));
  };
  const submit = () => {
    if (!validate(2)) return;
    setPhase("sending");
    window.setTimeout(() => setPhase("done"), 1100);
  };

  const err = (k: keyof FormState) =>
    errors[k] ? (
      <p className="font-mono text-[10.5px] text-[#e04f3a] mt-1.5 tracking-[0.06em]">â² {errors[k]}</p>
    ) : null;

  return (
    <section id="contact" className="relative bg-bg2 clip-slash-t noise scroll-mt-10">
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-10 pt-24 md:pt-36 pb-28">
        <SectionHead
          kicker="Open a Work Order"
          title={<>Put it on<br /> <span className="text-accent">our drawing board.</span></>}
          sub="Three short steps. A project director â not a sales rep â replies within one business day with a number and a mobilization date."
        />

        <div className="grid lg:grid-cols-[1fr_1.35fr] gap-10 items-start">
          <div className="space-y-6">
            <Reveal variant="left">
              <div className="bg-surface border border-line p-6 clip-notch-card">
                <p className="font-mono text-[10.5px] tracking-[0.26em] uppercase text-accent mb-5">// Field Offices</p>
                <ul className="space-y-5">
                  {OFFICES.map((o) => (
                    <li key={o.city} className="flex gap-4">
                      <IconPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-display font-bold uppercase tracking-wide text-ink text-[15px]">{o.city}</p>
                        <p className="text-muted text-[13.5px] mt-0.5">{o.addr}</p>
                        <a href={`tel:${o.phone.replace(/[^0-9]/g, "")}`} className="font-mono text-[12px] text-accent hover:underline underline-offset-4">
                          {o.phone}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line mt-6 pt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] text-muted tracking-[0.1em]">
                  <span>HQ â 07:00â17:00 CT</span>
                  <span>FIELD â 06:00â18:00</span>
                  <span className="text-accent">EMERGENCY â 24/7</span>
                </div>
              </div>
            </Reveal>

            <Reveal variant="left" delay={120}>
              <div className="bg-surface border border-line p-6 clip-bevel relative overflow-hidden">
                <svg viewBox="0 0 320 190" className="w-full" aria-label="Stylized service area map">
                  <defs>
                    <pattern id="mg" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M20 0H0v20" fill="none" stroke="var(--line)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="320" height="190" fill="url(#mg)" />
                  <path d="M0 120 60 96 130 110 210 70 320 92" fill="none" stroke="var(--steel)" strokeWidth="2" opacity="0.6" />
                  <path d="M40 0 70 80 60 190M180 0 200 90 260 190" fill="none" stroke="var(--steel)" strokeWidth="1.4" opacity="0.45" />
                  <path d="M70 40 150 30 230 55 250 120 170 150 90 130Z" fill="rgba(255,107,0,0.08)" stroke="var(--accent)" strokeWidth="1.4" strokeDasharray="5 4" />
                  {[
                    [110, 70, "CHI"],
                    [205, 95, "DEN"],
                    [75, 45, "SEA"],
                  ].map(([x, y, l]) => (
                    <g key={l as string}>
                      <rect x={(x as number) - 5} y={(y as number) - 5} width="10" height="10" transform={`rotate(45 ${x} ${y})`} fill="var(--accent)" />
                      <text x={(x as number) + 10} y={(y as number) + 4} fill="var(--muted)" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
                        {l}
                      </text>
                    </g>
                  ))}
                </svg>
                <div className="flex items-center justify-between mt-4">
                  <p className="font-mono text-[10.5px] text-muted tracking-[0.14em] uppercase">Service area â 14 states</p>
                  <a
                    href="https://maps.google.com/?q=2400+S+Ashland+Ave+Chicago+IL"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-accent hover:underline underline-offset-4"
                  >
                    Get directions â
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal variant="right" delay={100}>
            <div className="bg-surface border border-line clip-notch-card p-7 md:p-10 relative overflow-hidden">
              {phase === "done" ? (
                <div className="py-10 text-center">
                  <div className="relative w-24 h-24 mx-auto">
                    {sparks.map((s, i) => (
                      <span key={i} className="spark" style={{ "--sx": s.sx, "--sy": s.sy, animationDelay: s.d } as React.CSSProperties} />
                    ))}
                    <svg viewBox="0 0 96 96" className="w-full h-full">
                      <rect x="8" y="8" width="80" height="80" fill="none" stroke="var(--accent)" strokeWidth="3" pathLength={1} className="draw-path" />
                      <path d="M30 50 44 64 68 36" fill="none" stroke="var(--brass)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="draw-path" style={{ animationDelay: "0.35s" }} />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold uppercase text-2xl md:text-3xl text-ink mt-7">Welded into the queue</h3>
                  <p className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-accent mt-3">REF {refNo}</p>
                  <p className="text-muted max-w-md mx-auto mt-4 leading-relaxed">
                    Work order logged{f.name ? ` for ${f.name}` : ""}. A project director replies within one business day â sooner if the crane is already warm.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <button onClick={() => { setF(INIT); setStep(0); setPhase("idle"); }} className="btn-slab btn-ghost px-5 py-2.5 text-[12px] uppercase">
                      Log another
                    </button>
                    <button onClick={() => scrollToId("top")} className="btn-slab btn-primary px-5 py-2.5 text-[12px] uppercase">
                      Back to site
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-9">
                    {STEPS.map((s, i) => (
                      <div key={s} className={`flex items-center ${i < 2 ? "flex-1" : ""}`}>
                        <div className="flex flex-col items-center">
                          <span
                            className={`w-10 h-10 rotate-45 grid place-items-center border-2 transition-all duration-400 ${
                              i < step ? "bg-accent border-accent" : i === step ? "border-accent bg-accent/10" : "border-line bg-surface2"
                            }`}
                          >
                            <span
                              className="-rotate-45 font-mono text-[12px] font-bold"
                              style={{ color: i < step ? "#10141a" : i === step ? "var(--accent)" : "var(--muted)" }}
                            >
                              {i < step ? <IconCheck className="w-4 h-4" /> : `0${i + 1}`}
                            </span>
                          </span>
                          <span className={`font-mono text-[9.5px] tracking-[0.22em] uppercase mt-3 ${i === step ? "text-accent" : "text-muted"}`}>{s}</span>
                        </div>
                        {i < 2 && <span className={`flex-1 h-[2px] mx-3 mb-6 transition-colors duration-500 ${i < step ? "bg-accent" : "bg-line"}`} />}
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (step < 2) next();
                      else submit();
                    }}
                    noValidate
                  >
                    <div className="overflow-hidden">
                      <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]" style={{ transform: `translateX(-${step * 100}%)` }}>
                        <div className="w-full shrink-0 pr-1 space-y-5">
                          <label className="block">
                            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Project type</span>
                            <select className={`field ${errors.projType ? "err" : ""}`} value={f.projType} onChange={set("projType")}>
                              <option value="">Selectâ¦</option>
                              {CALC.types.map((t) => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                              ))}
                              <option value="Infrastructure">Infrastructure / Civil</option>
                              <option value="Renovation">Renovation / Retrofit</option>
                            </select>
                            {err("projType")}
                          </label>
                          <div className="grid sm:grid-cols-2 gap-5">
                            <label className="block">
                              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Approx. sq-ft</span>
                              <input className={`field ${errors.sqft ? "err" : ""}`} inputMode="numeric" placeholder="e.g. 45000" value={f.sqft} onChange={set("sqft")} />
                              {err("sqft")}
                            </label>
                            <label className="block">
                              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Site city / state</span>
                              <input className={`field ${errors.city ? "err" : ""}`} placeholder="e.g. Milwaukee, WI" value={f.city} onChange={set("city")} />
                              {err("city")}
                            </label>
                          </div>
                        </div>

                        <div className="w-full shrink-0 px-1 space-y-5">
                          <div className="grid sm:grid-cols-2 gap-5">
                            <label className="block">
                              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Budget band</span>
                              <select className={`field ${errors.budget ? "err" : ""}`} value={f.budget} onChange={set("budget")}>
                                <option value="">Selectâ¦</option>
                                <option>Under $2M</option>
                                <option>$2M â $10M</option>
                                <option>$10M â $50M</option>
                                <option>$50M â $200M</option>
                                <option>$200M+</option>
                              </select>
                              {err("budget")}
                            </label>
                            <label className="block">
                              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Target</span>
                              <select className={`field ${errors.timeline ? "err" : ""}`} value={f.timeline} onChange={set("timeline")}>
                                <option value="">Selectâ¦</option>
                                <option>Break ground this quarter</option>
                                <option>Within 6 months</option>
                                <option>6 â 18 months out</option>
                                <option>Exploring feasibility</option>
                              </select>
                              {err("timeline")}
                            </label>
                          </div>
                          <label className="block">
                            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Scope notes (optional)</span>
                            <textarea className="field min-h-[110px] resize-y" placeholder="Levels, parking, process loads, occupied renovation, known site constraintsâ¦" value={f.scope} onChange={set("scope")} />
                          </label>
                        </div>

                        <div className="w-full shrink-0 pl-1 space-y-5">
                          <div className="grid sm:grid-cols-2 gap-5">
                            <label className="block">
                              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Name *</span>
                              <input className={`field ${errors.name ? "err" : ""}`} value={f.name} onChange={set("name")} placeholder="Jordan Steele" autoComplete="name" />
                              {err("name")}
                            </label>
                            <label className="block">
                              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Company</span>
                              <input className="field" value={f.company} onChange={set("company")} placeholder="Steele Development" autoComplete="organization" />
                            </label>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-5">
                            <label className="block">
                              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Email *</span>
                              <input className={`field ${errors.email ? "err" : ""}`} type="email" value={f.email} onChange={set("email")} placeholder="jordan@steele.dev" autoComplete="email" />
                              {err("email")}
                            </label>
                            <label className="block">
                              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Phone</span>
                              <input className="field" type="tel" value={f.phone} onChange={set("phone")} placeholder="(555) 010-0148" autoComplete="tel" />
                            </label>
                          </div>
                          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={f.website} onChange={set("website")} aria-hidden="true" />
                          <label className="block">
                            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-muted block mb-2">Anything else</span>
                            <textarea className="field min-h-[80px] resize-y" value={f.message} onChange={set("message")} placeholder="Drawings, RFP links, deadline pressuresâ¦" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-line">
                      <button
                        type="button"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        className={`btn-slab btn-ghost px-5 py-3 text-[12px] uppercase ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
                      >
                        â Back
                      </button>
                      <button type="submit" disabled={phase === "sending"} className="btn-slab btn-primary px-7 py-3 text-[12.5px] uppercase disabled:opacity-70">
                        {phase === "sending" ? "Weldingâ¦" : step < 2 ? "Next phase â" : "Submit work order"}
                      </button>
                    </div>
                    <p className="font-mono text-[10px] text-muted tracking-[0.1em] mt-4">
                      // Honeypot + time-gate spam protection active. Your details never leave the estimating desk.
                    </p>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
