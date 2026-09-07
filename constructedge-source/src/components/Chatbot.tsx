import { useEffect, useRef, useState } from "react";
import { IconChat, IconClose, IconHelmet, IconSend } from "../ui";

type Msg = { from: "bot" | "user"; text: string };

const CHIPS = ["Get a quote", "Services", "Timeline", "Safety record"];

function reply(input: string): string {
  const t = input.toLowerCase();
  if (/(quote|price|cost|estimate|budget|how much)/.test(t))
    return "Copy that. Ballpark first: the ROM estimator runs the same formula my estimators do â type, footprint, tier. For a GMP-grade number, log a work order in the contact section and a project director replies inside one business day.";
  if (/(service|zone|do you|what do|offer)/.test(t))
    return "Six zones: DesignâBuild, Civil & Structural Engineering, Commercial, Industrial Facilities, Renovation & Seismic Retrofit, and Preconstruction. Scroll to Construction Zones â or tell me the asset and I'll dispatch you to the right one.";
  if (/(timeline|schedule|how long|when|duration|fast)/.test(t))
    return "Typical commercial shell lands 10â24 months; our rolling on-time record is 96.4%. Precon runs parallel with permits, so steel is ordered the week the GMP signs. Accelerated 24/7 shift work is available at roughly +18% cost.";
  if (/(safety|osha|emr|incident|recordable)/.test(t))
    return "EMR 0.62, OSHA VPP Star, 412 days since last recordable and counting. Every site runs a daily huddle â safety is the first item, schedule is the second. The Safety Hub has the certificates and protocol downloads.";
  if (/(career|job|hiring|work for|join)/.test(t))
    return "We're hiring â seven open roles right now, mostly superintendents and field engineers. Email careers@constructedge.example with your rÃ©sumÃ© and mention the Foreman sent you. Direct-hire, full benefits, tool allowance.";
  if (/(hi|hello|hey|yo|morning|afternoon)\b/.test(t))
    return "Morning â or night shift, depending on your pour. I'm Mike, the site foreman. Ask me about quotes, timelines, services or safety, and I'll radio the right answer back.";
  if (/(where|location|office|visit)/.test(t))
    return "HQ is 2400 S Ashland Ave, Chicago. Field offices in Denver and Seattle â the Contact section has phones and a map. Site visits by appointment; bring your own hard hat, or borrow one of ours.";
  return "Good question â that one needs a human with a calculator. I've noted it for the dispatch board. Meanwhile, drop a work order in the Contact section and a project director will call you back within one business day. Over.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const interacted = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("ce-foreman")) return;
    } catch {
      /* noop */
    }
    const t1 = window.setTimeout(() => {
      setOpen(true);
      setUnread(true);
      setMsgs([{ from: "bot", text: "Mike here â site foreman. Radio check: need a number, a timeline, or the right crew? I'm on channel 1." }]);
      window.setTimeout(() => {
        if (!interacted.current) setOpen(false);
      }, 3400);
    }, 4200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, open]);

  const markInteracted = () => {
    if (interacted.current) return;
    interacted.current = true;
    try {
      localStorage.setItem("ce-foreman", "1");
    } catch {
      /* noop */
    }
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    markInteracted();
    setUnread(false);
    setMsgs((m) => [...m, { from: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: reply(trimmed) }]);
    }, 750 + Math.min(600, trimmed.length * 12));
  };

  return (
    <>
      <div
        className={`fixed z-[70] right-5 bottom-24 w-[min(350px,calc(100vw-2.5rem))] transition-all duration-400 ease-[cubic-bezier(0.25,0.9,0.3,1)] origin-bottom-right ${
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
        role="dialog"
        aria-label="Chat with Foreman Mike"
        aria-hidden={!open}
      >
        <div className="bg-surface border border-line shadow-[var(--shadow)] clip-notch-card overflow-hidden">
          <div className="flex items-center gap-3 bg-surface2 border-b border-line px-4 py-3">
            <span className="relative grid place-items-center w-10 h-10 bg-accent text-[#10141a] clip-tag shrink-0">
              <IconHelmet className="w-6 h-6" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brass border-2 border-surface2 rounded-full" />
            </span>
            <div className="min-w-0">
              <p className="font-display font-bold uppercase tracking-wide text-ink text-[14px] leading-none">Foreman Mike</p>
              <p className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-muted mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-accent rounded-full blink" /> On site â channel 1
              </p>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                markInteracted();
              }}
              className="ml-auto grid place-items-center w-8 h-8 text-muted hover:text-accent transition-colors"
              aria-label="Minimize chat"
            >
              <IconClose className="w-5 h-5" />
            </button>
          </div>

          <div ref={bodyRef} className="h-64 overflow-y-auto px-4 py-4 space-y-3 bg-bg2/50">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] text-[13.5px] leading-relaxed px-3.5 py-2.5 ${
                    m.from === "user"
                      ? "bg-accent text-[#10141a] clip-tag"
                      : "bg-surface border border-line text-ink"
                  }`}
                  style={m.from === "bot" ? { clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" } : undefined}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <span className="bg-surface border border-line px-4 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="typing-dot w-1.5 h-1.5 bg-accent rounded-full inline-block" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
              </div>
            )}
          </div>

          <div className="px-4 pt-3 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="font-mono text-[10px] tracking-[0.1em] uppercase border border-line text-muted px-2.5 py-1.5 clip-tag hover:border-accent hover:text-accent transition-colors"
              >
                {c}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              className="field text-[13.5px]"
              style={{ padding: "9px 12px" }}
              placeholder="Radio the foremanâ¦"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message Foreman Mike"
            />
            <button type="submit" className="btn-slab btn-primary px-3.5 shrink-0" aria-label="Send message">
              <IconSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={() => {
          markInteracted();
          setUnread(false);
          setOpen((o) => !o);
          if (msgs.length === 0) {
            setMsgs([{ from: "bot", text: "Mike here â site foreman. Need a number, a timeline, or the right crew? Radio it over." }]);
          }
        }}
        className={`fixed z-[70] right-5 bottom-24 w-14 h-14 grid place-items-center clip-tag transition-all duration-300 group ${
          open ? "bg-surface2 border border-line text-accent rotate-90" : "bg-accent text-[#10141a] hover:bg-rust hover:text-[#f5ede4]"
        } shadow-[var(--glow)]`}
        aria-label={open ? "Close foreman chat" : "Open foreman chat"}
      >
        {open ? <IconClose className="w-6 h-6" /> : <IconChat className="w-6 h-6" />}
        {unread && !open && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brass rounded-full blink" />}
        {!open && <span className="absolute -left-24 top-1/2 -translate-y-1/2 font-mono text-[9.5px] tracking-[0.18em] uppercase text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask the foreman
        </span>}
      </button>
    </>
  );
}
