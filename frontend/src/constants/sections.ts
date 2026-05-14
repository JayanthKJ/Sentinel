export const SECTION_IDS = {
  home: "home",
  problem: "problem",
  aiGenerator: "ai-generator",
  features: "features",
  liveDemo: "live-demo",
  simulation: "simulation",
  output: "output",
  team: "team",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: SECTION_IDS.home, label: "Home" },
  { id: SECTION_IDS.problem, label: "Problem" },
  { id: SECTION_IDS.aiGenerator, label: "AI Generator" },
  { id: SECTION_IDS.features, label: "Features" },
  { id: SECTION_IDS.liveDemo, label: "Live Demo" },
  { id: SECTION_IDS.simulation, label: "Simulation" },
  { id: SECTION_IDS.output, label: "Output" },
  { id: SECTION_IDS.team, label: "Team" },
  { id: SECTION_IDS.contact, label: "Contact" },
];
