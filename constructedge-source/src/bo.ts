/**
 * Backoffice (BO) — TypeScript interface + hook for consuming wpReactSettings.bo
 *
 * This module mirrors the PHP backoffice structure so the React components can
 * access all editable content via the useBO() hook. All text displayed on the
 * site flows through this object, making it fully editable from the WP Customizer.
 */

declare global {
  interface Window {
    wpReactSettings?: {
      bo?: BackofficeContent;
      hero?: {
        scrollVh?: number;
        rotationMs?: number;
        idleAnim?: boolean;
        idleGhost?: boolean;
        printBeam?: boolean;
        taglines?: string[];
        phaseTaglines?: string[];
        kicker?: string;
        ctaPrimary?: string;
        ctaSecondary?: string;
      };
      motion?: {
        speed?: number;
      };
      nav?: Record<string, NavItem>;
      contact?: {
        recipient?: string;
        subjectPattern?: string;
        honeypot?: string;
        recaptcha?: {
          enabled?: boolean;
          siteKey?: string;
        };
      };
      selector?: {
        questions?: Array<{ label: string; options: string[] }>;
        results?: Record<string, string>;
      };
      search?: {
        zIndex?: number;
      };
    };
  }
}

export interface NavItem {
  enabled: boolean;
  variant?: MegaVariant;
}

export type MegaVariant = "services" | "work" | "company";

export const NAV_LABELS = ["Services", "Work", "Method", "Safety", "Team", "Contact"] as const;

export interface BackofficeContent {
  hero: {
    kicker: string;
    taglines: string[];
    phaseTaglines: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    subtext: string;
  };
  services: Record<
    string,
    {
      name: string;
      tag: string;
      desc: string;
      duration: string;
    }
  >;
  projects: Record<
    string,
    {
      name: string;
      scope: string;
    }
  >;
  team: Record<
    string,
    {
      focus: string;
    }
  >;
  testimonials: Array<{
    quote: string;
  }>;
  contact: {
    kicker: string;
    title: string;
    sub: string;
  };
  safety: {
    kicker: string;
    title: string;
  };
  method: {
    kicker: string;
  };
  footer: {
    copyright: string;
  };
  header: {
    topbar_phone: string;
    topbar_hours: string;
  };
}

const DEFAULT_BO: BackofficeContent = {
  hero: {
    kicker: "From Blueprint to Handover",
    taglines: ["From first line to final beam.", "Engineered precision. Field discipline.", "One team. Zero blame games."],
    phaseTaglines: [
      "Drawing board active.",
      "Steel rising.",
      "Pouring floors.",
      "Glass ascending.",
      "Grounds taking shape.",
      "Keys ready.",
    ],
    ctaPrimary: "Start Your Project",
    ctaSecondary: "View Our Work",
    subtext: "High-rise, industrial and civil structures — engineered in-house, erected by our own crews. 1,240 delivered since 1987.",
  },
  services: {
    "SVC-01": { name: "Design–Build Delivery", tag: "Single contract. Zero blame games.", desc: "", duration: "" },
    "SVC-02": { name: "Civil & Structural Engineering", tag: "Stamped. Calculated. Over-engineered on purpose.", desc: "", duration: "" },
    "SVC-03": { name: "Commercial Construction", tag: "Tilt-wall, steel frame, Class-A finish.", desc: "", duration: "" },
    "SVC-04": { name: "Industrial Facilities", tag: "Heavy process. Heavier discipline.", desc: "", duration: "" },
    "SVC-05": { name: "Renovation & Seismic Retrofit", tag: "New bones inside an old skin.", desc: "", duration: "" },
    "SVC-06": { name: "Preconstruction & Estimating", tag: "The number you can take to the bank.", desc: "", duration: "" },
  },
  projects: {},
  team: {},
  testimonials: [],
  contact: {
    kicker: "Open a Work Order",
    title: "Put it on our drawing board.",
    sub: "Three short steps. A project director — not a sales rep — replies within one business day.",
  },
  safety: {
    kicker: "Safety & Certifications",
    title: "Everyone goes home. Every shift. No asterisks.",
  },
  method: {
    kicker: "The Method",
  },
  footer: {
    copyright: "© 2026 ConstructEdge Group · Lic. CGC-04821 · Bonded to $250M",
  },
  header: {
    topbar_phone: "(312) 555-0148",
    topbar_hours: "Field offices open 06:00–18:00 CT",
  },
};

export function useBO(): BackofficeContent {
  const bo = window.wpReactSettings?.bo;
  if (!bo) {
    return DEFAULT_BO;
  }
  // Merge with defaults to ensure all keys exist.
  return {
    ...DEFAULT_BO,
    ...bo,
    hero: { ...DEFAULT_BO.hero, ...bo.hero },
    contact: { ...DEFAULT_BO.contact, ...bo.contact },
    safety: { ...DEFAULT_BO.safety, ...bo.safety },
    method: { ...DEFAULT_BO.method, ...bo.method },
    footer: { ...DEFAULT_BO.footer, ...bo.footer },
    header: { ...DEFAULT_BO.header, ...bo.header },
  };
}
