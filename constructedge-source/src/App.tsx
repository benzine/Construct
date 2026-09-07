import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { useTheme } from "./hooks";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { Ticker, StatsBand } from "./components/Bands";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Method from "./components/Method";
import Calculator from "./components/Calculator";
import Team from "./components/Team";
import Safety from "./components/Safety";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import BackToTop from "./components/Floaters";
import Cursor from "./components/Cursor";
import Loader from "./components/Loader";

/* Shell-proof theme bootstrap â runs at module evaluation. */
try {
  const docEl = document.documentElement;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem("ce-theme");
  } catch {
    stored = null;
  }
  const t =
    stored === "light" || stored === "dark"
      ? stored
      : window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
  docEl.setAttribute("data-theme", t);
} catch {
  document.documentElement.setAttribute("data-theme", "dark");
}

class FaultWall extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483001,
            display: "grid",
            placeItems: "center",
            background: "#0c0f13",
            color: "#edf2f7",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#ff6b00" }}>
              Structural fault â the frame bent, the site didn't fall
            </p>
            <p style={{ marginTop: 14, fontSize: 14, color: "#94a3b8", maxWidth: 560, lineHeight: 1.6 }}>
              {String(this.state.error?.message || this.state.error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: 22,
                font: "600 12px 'JetBrains Mono', ui-monospace, monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#10141a",
                background: "#ff6b00",
                border: 0,
                padding: "12px 22px",
                cursor: "pointer",
              }}
            >
              Re-pour the slab Â· reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SiteApp() {
  const [theme, toggleTheme] = useTheme();
  const [loaded, setLoaded] = useState(false);
  const onLoaded = useCallback(() => setLoaded(true), []);

  return (
    <div className="min-h-screen bg-bg text-ink font-body antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[110] focus:bg-accent focus:text-[#10141a] focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:tracking-[0.2em] focus:uppercase"
      >
        Skip to content
      </a>

      {!loaded && <Loader onDone={onLoaded} />}
      <Cursor />
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main id="main">
        <Hero theme={theme} />
        <Ticker />
        <StatsBand />
        <Services />
        <Projects />
        <Method />
        <Calculator />
        <Team />
        <Safety />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <Chatbot />
      <BackToTop />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    (window as unknown as { __CE_BOOTED__?: boolean }).__CE_BOOTED__ = true;
    document.getElementById("ce-boot-beacon")?.remove();
  }, []);
  return (
    <FaultWall>
      <SiteApp />
    </FaultWall>
  );
}
