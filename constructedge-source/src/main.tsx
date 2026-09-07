import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

export const CE_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap";

/* Non-blocking font load: media="print" flips to "all" once fetched. */
export function loadFontsNonBlocking() {
  if (typeof document === "undefined" || document.getElementById("ce-fonts")) return;
  try {
    for (const host of ["https://fonts.googleapis.com", "https://fonts.gstatic.com"]) {
      const pc = document.createElement("link");
      pc.rel = "preconnect";
      pc.href = host;
      if (host.includes("gstatic")) pc.crossOrigin = "anonymous";
      document.head.appendChild(pc);
    }
    const link = document.createElement("link");
    link.id = "ce-fonts";
    link.rel = "stylesheet";
    link.href = CE_FONT_URL;
    link.media = "print";
    link.onload = () => {
      link.media = "all";
    };
    document.head.appendChild(link);
  } catch {
    /* fallback fonts only */
  }
}

/* Day Shift / Night Shift bootstrap before first paint. */
(function bootstrapTheme() {
  try {
    const root = document.documentElement;
    let t = localStorage.getItem("ce-theme");
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    root.setAttribute("data-theme", t);
  } catch {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

loadFontsNonBlocking();

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
} else {
  const fallback = document.createElement("div");
  fallback.id = "root";
  document.body.appendChild(fallback);
  ReactDOM.createRoot(fallback).render(<App />);
}
