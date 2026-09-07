export type ServiceIcon = "draft" | "civil" | "tower" | "factory" | "retro" | "precon";

export interface Service {
  code: string;
  name: string;
  tag: string;
  desc: string;
  steps: string[];
  duration: string;
  icon: ServiceIcon;
}

export const SERVICES: Service[] = [
  {
    code: "SVC-01",
    name: "DesignâBuild Delivery",
    tag: "Single contract. Zero blame games.",
    desc: "Architecture and construction under one roof â one team owns the schedule, the budget, and the outcome from napkin sketch to certificate of occupancy.",
    steps: ["Feasibility", "Schematic design", "GMP pricing", "Permits", "Build"],
    duration: "14â30 months typical",
    icon: "draft",
  },
  {
    code: "SVC-02",
    name: "Civil & Structural Engineering",
    tag: "Stamped. Calculated. Over-engineered on purpose.",
    desc: "In-house PE-stamped structural systems, foundations, grading, utilities and stormwater â modeled in 3D before a single yard of concrete is poured.",
    steps: ["Geotech review", "Load modeling", "Foundation design", "Utility coordination"],
    duration: "6â14 weeks design",
    icon: "civil",
  },
  {
    code: "SVC-03",
    name: "Commercial Construction",
    tag: "Tilt-wall, steel frame, Class-A finish.",
    desc: "Office, retail, medical and mixed-use structures delivered with weekly owner dashboards, pull-plan scheduling and a 96.4% on-time record.",
    steps: ["Precon", "Structural frame", "Envelope", "Interiors", "Commissioning"],
    duration: "10â24 months typical",
    icon: "tower",
  },
  {
    code: "SVC-04",
    name: "Industrial Facilities",
    tag: "Heavy process. Heavier discipline.",
    desc: "Manufacturing plants, warehouses and energy facilities with crane-rated slabs, 50-ft clear heights and MEP coordination down to the millimetre.",
    steps: ["Process layout", "Slab design", "Steel erection", "Equipment setting"],
    duration: "12â28 months typical",
    icon: "factory",
  },
  {
    code: "SVC-05",
    name: "Renovation & Seismic Retrofit",
    tag: "New bones inside an old skin.",
    desc: "Structural strengthening, adaptive reuse and occupied-facility renovation â phased so your operation never misses a business day.",
    steps: ["As-built scan", "FRP / steel jacketing", "Phased demo", "Refit"],
    duration: "4â16 months typical",
    icon: "retro",
  },
  {
    code: "SVC-06",
    name: "Preconstruction & Estimating",
    tag: "The number you can take to the bank.",
    desc: "5D BIM estimating, constructability reviews, logistics planning and GMP packages accurate to Â±3% â before you commit a dollar of capital.",
    steps: ["Concept estimate", "Value engineering", "Bid packaging", "GMP"],
    duration: "3â8 weeks",
    icon: "precon",
  },
];

export interface Project {
  id: string;
  name: string;
  type: "High-Rise" | "Infrastructure" | "Industrial" | "Residential" | "Commercial" | "Civic";
  loc: string;
  year: number;
  sqft: string;
  value: string;
  status: "DELIVERED" | "IN PROGRESS";
  img: string;
  scope: string;
}

export const PROJECTS: Project[] = [
  {
    id: "meridian-one",
    name: "Meridian One Tower",
    type: "High-Rise",
    loc: "Chicago, IL",
    year: 2025,
    sqft: "1.2M",
    value: "$486M",
    status: "DELIVERED",
    img: "images/meridian-one.svg",
    scope: "62-story composite steel core, jump-form core, 3-level below-grade parking",
  },
  {
    id: "harborline",
    name: "Harborline Crossing",
    type: "Infrastructure",
    loc: "Tacoma, WA",
    year: 2024,
    sqft: "2,400 LF",
    value: "$212M",
    status: "DELIVERED",
    img: "images/harborline.svg",
    scope: "Cable-stayed main span, marine foundations, 900-day tide-restricted window",
  },
  {
    id: "apex-plant",
    name: "Apex Assembly Plant",
    type: "Industrial",
    loc: "Austin, TX",
    year: 2025,
    sqft: "840K",
    value: "$158M",
    status: "IN PROGRESS",
    img: "images/apex.svg",
    scope: "EV battery shell, 240-ton crane runway, Â±3mm slab flatness spec",
  },
  {
    id: "foundry-lofts",
    name: "The Foundry Lofts",
    type: "Residential",
    loc: "Detroit, MI",
    year: 2023,
    sqft: "210K",
    value: "$74M",
    status: "DELIVERED",
    img: "images/foundry.svg",
    scope: "1917 foundry adaptive reuse, 214 units, historic facade retention",
  },
  {
    id: "cascade-pavilion",
    name: "Cascade Medical Pavilion",
    type: "Commercial",
    loc: "Portland, OR",
    year: 2024,
    sqft: "330K",
    value: "$196M",
    status: "DELIVERED",
    img: "images/cascade.svg",
    scope: "Mass-timber canopy, seismic base isolation, LEED Gold targeting",
  },
  {
    id: "summit-ridge",
    name: "Summit Ridge Stadium",
    type: "Civic",
    loc: "Denver, CO",
    year: 2026,
    sqft: "690K",
    value: "$402M",
    status: "IN PROGRESS",
    img: "images/summit.svg",
    scope: "38,000-seat bowl, 4,100-ton roof truss, phased steel erection",
  },
];

export interface CrewMember {
  name: string;
  role: string;
  creds: string[];
  years: number;
  focus: string;
  initials: string;
}

export const CREW: CrewMember[] = [
  { name: "Dana Okafor", role: "Chief Executive Officer", creds: ["PE", "LEED AP", "DBIA"], years: 27, focus: "Mega-project delivery & client alliances", initials: "DO" },
  { name: "Marcus Reyes", role: "VP, Field Operations", creds: ["OSHA 500", "CHC", "Crane Signal Cert."], years: 22, focus: "Superintendent corps & safety culture", initials: "MR" },
  { name: "Ingrid Halvorsen", role: "Director of Engineering", creds: ["SE", "SECB", "AWS CWI"], years: 19, focus: "Structural systems & seismic retrofit", initials: "IH" },
  { name: "Theo Brandt", role: "Director of Preconstruction", creds: ["PMP", "CEP", "Lean Gold"], years: 15, focus: "5D BIM estimating & GMP accuracy", initials: "TB" },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  project: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { quote: "ConstructEdge handed us the keys nine days early and $2.1M under GMP. In thirty years of capital programs I have never written that sentence before.", name: "Priya Raman", role: "VP Facilities, Northlake Health", project: "Cascade Medical Pavilion" },
  { quote: "Their superintendents run a tighter site than the factory we were building. Tolerance reports every Friday, zero recordables across 1.4 million hours.", name: "Elliot Voss", role: "Director of Capital Projects, Apex Mobility", project: "Apex Assembly Plant" },
  { quote: "They treated a 108-year-old facade like a museum piece and the new structure like a machine. The lofts leased out in eleven weeks.", name: "Camille Fontaine", role: "Principal, Fontaine Urban Partners", project: "The Foundry Lofts" },
  { quote: "The tide window on the marine foundations was brutal. Their marine crew hit 94 of 96 planned pours. The schedule never blinked.", name: "Ray Delgado", role: "Program Manager, WA State Ferries", project: "Harborline Crossing" },
];

export const STATS: { value: number; suffix: string; label: string; note: string; decimals?: number }[] = [
  { value: 38, suffix: "", label: "Years in the field", note: "Est. 1987 â still family-held" },
  { value: 1240, suffix: "+", label: "Structures delivered", note: "Across 14 states & 2 provinces" },
  { value: 96.4, suffix: "%", label: "On-time handover", note: "Rolling 10-year record", decimals: 1 },
  { value: 2.1, suffix: "M", label: "Safe labor hours", note: "Without a lost-time incident", decimals: 1 },
];

export const SAFETY_STATS = [
  { value: 412, suffix: "", label: "Days since last recordable", decimals: 0 },
  { value: 0.62, suffix: "", label: "EMR experience modifier", decimals: 2 },
  { value: 18400, suffix: "", label: "Craft training hours / yr", decimals: 0 },
  { value: 100, suffix: "%", label: "Sites on daily huddle program", decimals: 0 },
];

export const CERTS = [
  { code: "OSHA", name: "VPP Star Site" },
  { code: "ISO", name: "9001 : 2015" },
  { code: "AWS", name: "D1.1 Welding" },
  { code: "LEED", name: "Gold Builder" },
  { code: "AGC", name: "Member #04821" },
  { code: "DBIA", name: "Professional" },
];

export const TICKER = [
  "1,240+ structures delivered",
  "OSHA VPP Star Site",
  "EMR 0.62 â elite safety tier",
  "LEED Gold builder",
  "Est. 1987",
  "2.1M safe labor hours",
  "AWS D1.1 certified welding",
  "DesignâBuild delivery",
  "96.4% on-time record",
];

export const METHOD = [
  { n: "01", title: "Preconstruction", desc: "Feasibility, 5D BIM estimate, value engineering and a GMP you can take to the bank â before dirt moves.", dur: "WK 0â8" },
  { n: "02", title: "Design & Engineering", desc: "In-house structural and civil engineers stamp the package. Clash detection resolves conflicts on-screen, not on-site.", dur: "WK 4â20" },
  { n: "03", title: "Permits & Procurement", desc: "Long-lead steel, switchgear and elevators ordered at GMP. Permit strategy runs parallel, not sequential.", dur: "WK 12â28" },
  { n: "04", title: "Vertical Construction", desc: "Pull-plan scheduling, weekly owner dashboards, laser-scan tolerance verification on every floor deck.", dur: "WK 24â90" },
  { n: "05", title: "Commission & Handover", desc: "Full systems commissioning, as-built digital twin, warranty binder and a superintendent on call for 24 months.", dur: "WK 84â104" },
];

export const OFFICES = [
  { city: "Chicago HQ", addr: "2400 S Ashland Ave, Chicago, IL 60608", phone: "(312) 555-0148" },
  { city: "Denver Field Office", addr: "5890 Fox St, Denver, CO 80221", phone: "(720) 555-0173" },
  { city: "Seattle Marine Division", addr: "1101 W Commodore Way, Seattle, WA 98119", phone: "(206) 555-0119" },
];

export const CLIENTS = [
  "NORTHLAKE HEALTH",
  "APEX MOBILITY",
  "FONTAINE URBAN",
  "WA STATE FERRIES",
  "RIDGELINE CAPITAL",
  "CIVIC ARENA AUTH.",
  "HALSTAD AEROSPACE",
];

export const CALC = {
  types: [
    { id: "residential", name: "Residential Multi-Family", base: 218 },
    { id: "commercial", name: "Commercial / Office", base: 265 },
    { id: "medical", name: "Medical / Lab", base: 342 },
    { id: "industrial", name: "Industrial / Warehouse", base: 196 },
    { id: "civic", name: "Civic / Recreation", base: 305 },
  ],
  quality: [
    { id: "standard", name: "Standard", mult: 1.0, note: "Code-minimum envelope, value MEP" },
    { id: "premium", name: "Premium", mult: 1.28, note: "Enhanced finishes, high-efficiency MEP" },
    { id: "flagship", name: "Flagship", mult: 1.55, note: "Class-A architectural, smart systems" },
  ],
  timeline: [
    { id: "standard", name: "Standard Schedule", mult: 1.0 },
    { id: "accelerated", name: "Accelerated (24/7 shifts)", mult: 1.18 },
  ],
  location: [
    { id: "urban", name: "Dense Urban Core", mult: 1.12 },
    { id: "suburban", name: "Suburban Site", mult: 1.0 },
    { id: "rural", name: "Rural / Greenfield", mult: 0.94 },
  ],
  variance: 0.12,
};

export const fmtMoney = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M`
    : `$${Math.round(n / 1000)}K`;
