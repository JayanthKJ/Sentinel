# SmartHMI AI — Frontend

Single-page marketing and demo experience for **SmartHMI AI**, an AI-powered industrial HMI / control dashboard concept (hackathon build). This folder contains the full **frontend-only** application; there is no backend in this repo.

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — layout, glassmorphism utilities, responsive design
- **Framer Motion** — page load, section reveals, hovers, modals, micro-interactions
- **GSAP** + **ScrollTrigger** — scroll-driven animations (e.g. problem cards, digital twin pipes)
- **Lenis** — smooth scrolling, integrated with GSAP’s ticker for ScrollTrigger compatibility
- **React Three Fiber** + **Three.js** + **@react-three/drei** — hero 3D hologram (distorted icosahedron)
- **Recharts** — AI generator preview charts, live demo area / flow / health charts
- **Lucide React** — icons across sections

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview   # optional: serve dist
```

## What’s in the UI

| Area | Description |
|------|-------------|
| **Main-page scroll navigation** | Centered bottom “deck” on the viewport (not a side rail): glass panel, page scroll progress bar, and numbered section buttons that **spring in one-by-one** as you scroll down; tap any unlocked button to jump. Subtle gradient scrim behind it so it feels part of the page. |
| **Hero** | Full-viewport grid, particles, animated SVG “circuits”, 3D object, staggered headline, parallax on scroll, CTAs. |
| **Problem** | Six cards on legacy HMI pain points; GSAP stagger on scroll; 3D tilt on hover. |
| **AI Generator** | Simulated prompt typing, “Generating…” pulse, holographic dashboard preview (gauges, pressure chart, tanks, pumps, alert). |
| **Features** | Ten feature cards with neon-style hover and 3D lift. |
| **Live Demo** | Industrial-style dashboard mockup with fake live-updating metrics, area chart, pie health, line chart, alarm feed. |
| **Digital Twin** | SVG process schematic, GSAP-animated pipe strokes, nodes, buffer tank fill animation. |
| **Voice** | Mic orb, pulse rings, animated waveform bars, sample voice commands. |
| **Simulation** | Buttons for incident types; red flash + modal with dramatic styling (frontend-only, no real control). |
| **Team** | Four placeholder team cards with glass styling and social icons. |
| **Contact / footer** | Branding, quick nav links, placeholder contact and socials. |

## Design tokens (strict theme)

- Background primary: `#0B1020`
- Background secondary: `#111827`
- Card glass: `rgba(30, 41, 59, 0.55)` (see `.glass-panel` in `src/index.css`)
- Electric accent: `#00D9FF`
- Cyan glow: `#38BDF8`
- Text: `#F8FAFC` · Muted: `#94A3B8`
- Danger: `#EF4444` · Success: `#10B981`

Fonts: **Inter** + **Orbitron** (Google Fonts, linked in `src/index.css`).

## Project layout

```
frontend/
├── public/           # static assets (e.g. favicon)
├── src/
│   ├── App.tsx       # page shell, Lenis, sections order
│   ├── main.tsx
│   ├── index.css     # Tailwind + global glass / neon / gradient text
│   ├── constants/    # section IDs + nav config
│   ├── hooks/        # Lenis, scroll-spy for navbar
│   └── components/   # Navbar, particles, circuits, section modules
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig*.json
└── eslint.config.js
```

## Notes

- **Bundle size**: Three.js / R3F adds a large JS chunk; acceptable for a demo. You can lazy-load the hero `Canvas` later if you need a smaller first load.
- **Data**: All numbers, alarms, and “AI” behavior are simulated in the browser for presentation.
