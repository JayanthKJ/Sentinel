# Sentinel

Sentinel is a full-stack industrial monitoring demo platform with a Flask backend and a React + TypeScript frontend. It simulates plant telemetry, processes event severity, groups incidents, and presents the results through an interactive high-visual operations UI.

---

## 1) Project structure

```text
Sentinel/
├── backend/      # Flask API, simulation services, event/incident processing
└── frontend/     # React + Vite interface, charts, 3D hero, motion UX
```

---

## 2) What Sentinel does (end-to-end)

1. Generates mock industrial events (cooling, power, pressure, network, etc.).
2. Processes and classifies these events (including severity escalation rules).
3. Detects incident groups from event clusters.
4. Serves all monitoring data via JSON endpoints.
5. Visualizes telemetry, incidents, and summaries in a modern dashboard.
6. Lets operators trigger simulations and reset in-memory state live from the UI.

---

## 3) Complete tech stack

### Backend stack

- Python 3.10+
- Flask 3.0.0
- Flask-CORS 4.0.0
- Dataclass-style in-memory models (events + incidents)

### Frontend stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS 3
- Framer Motion
- GSAP
- Lenis
- Three.js + @react-three/fiber + @react-three/drei
- Recharts
- Lucide React

### Tooling

- ESLint (React + TypeScript config)
- PostCSS + Autoprefixer

---

## 4) Backend architecture and behavior

Backend entry point: [backend/app.py](backend/app.py)

### Core backend modules

- [backend/app.py](backend/app.py)  
  Flask app creation, CORS setup, root and health endpoints, API blueprint registration.

- [backend/routes/api.py](backend/routes/api.py)  
  Main API routes for events, incidents, simulation, dashboard summary, and reset.

- [backend/services/simulator.py](backend/services/simulator.py)  
  Synthetic event generation (batch + related event generation for specific systems).

- [backend/services/event_processor.py](backend/services/event_processor.py)  
  Event normalization and severity handling.

- [backend/services/incident_manager.py](backend/services/incident_manager.py)  
  Incident detection, grouping, lifecycle handling.

- [backend/models/event.py](backend/models/event.py)  
  Event model structure.

- [backend/models/incident.py](backend/models/incident.py)  
  Incident model structure.

### Backend execution flow

1. `POST /api/simulate` requests data generation.
2. Simulator creates raw events.
3. Event processor analyzes + enriches event details.
4. Incident manager clusters events into incidents.
5. Data is available through `/api/events`, `/api/incidents`, `/api/dashboard`.

### API reference

Base URL: `http://localhost:5000`

- `GET /`  
  Returns API status/version metadata.

- `GET /health`  
  Returns health status.

- `GET /api/events`  
  Returns processed events.  
  Optional query params: `severity`, `system`, `status`

- `GET /api/incidents`  
  Returns incidents with event relationships.  
  Optional query params: `priority`, `status`

- `POST /api/simulate`  
  Generates events + detects incidents.  
  Optional JSON body:
  ```json
  {
    "count": 10,
    "system": "cooling_system"
  }
  ```

- `GET /api/dashboard`  
  Returns summary object:
  - total events
  - active events
  - total incidents
  - open incidents
  - severity breakdown
  - system breakdown

- `POST /api/reset`  
  Clears simulator, processor, and incident in-memory data.

### Backend constraints

- Data is in-memory (intentionally demo/MVP style).
- Restarting backend clears data.
- Best used as a simulation-ready prototype, not persistent production service.

---

## 5) Frontend architecture and all added features

Frontend entry: [frontend/src/App.tsx](frontend/src/App.tsx)

### Main frontend modules

- [frontend/src/App.tsx](frontend/src/App.tsx)  
  App composition, section ordering, fixed header lane spacing, global floating controls.

- [frontend/src/components/HeroNavigateDeck.tsx](frontend/src/components/HeroNavigateDeck.tsx)  
  Progressive section pill navigation (appears on scroll, grows one-by-one with active section, shrinks back when scrolling up).

- [frontend/src/components/sections/HeroSection.tsx](frontend/src/components/sections/HeroSection.tsx)  
  Animated hero, 3D preview, redesigned simulator controls (`Run` + `Reset`) without outer card.

- [frontend/src/components/sections/LiveDashboardSection.tsx](frontend/src/components/sections/LiveDashboardSection.tsx)  
  Live telemetry trend, distribution chart, alarm feed ordering by priority, KPI cards.

- [frontend/src/components/sections/OutputSection.tsx](frontend/src/components/sections/OutputSection.tsx)  
  Backend summary visualization with improved numeric typography.

- [frontend/src/components/sections/TeamSection.tsx](frontend/src/components/sections/TeamSection.tsx)  
  Real team roster, developer role labels, custom initials, LinkedIn + GitHub profile links.

- [frontend/src/components/ScrollToHomeButton.tsx](frontend/src/components/ScrollToHomeButton.tsx)  
  Reduced-size back-to-top control.

- [frontend/src/components/FloatingAIBot.tsx](frontend/src/components/FloatingAIBot.tsx)  
  Reduced-size floating AI shortcut.

- [frontend/src/hooks/useLenis.ts](frontend/src/hooks/useLenis.ts)  
  Smooth scrolling behavior.

- [frontend/src/hooks/useNavActiveSection.ts](frontend/src/hooks/useNavActiveSection.ts)  
  Active section detection used by progressive header pills.

### Current frontend section flow

1. Hero
2. Problem
3. AI Generator
4. Features
5. Live Dashboard
6. Output
7. Team
8. Contact

### Notable UX/UI additions tracked in this version

- Progressive header pills in reserved top lane (no overlap with content).
- Header remains hidden initially, appears on scroll, and adds items one-by-one.
- Pill list decreases one-by-one when scrolling back up.
- Live dashboard rows refined:
  - full-width trend row
  - side-by-side distribution and alarm feed row
- Alarm feed sorted by severity priority.
- Team cards updated with accurate names, roles, initials, and social links.
- Back-to-top + AI bot controls resized to reduce visual clutter.
- Hero simulator actions redesigned to cleaner capsule style (no bulky outer control card).

### Frontend ↔ Backend integration

- `POST /api/simulate` from hero/output flows
- `GET /api/dashboard` for summary cards and output metrics
- `GET /api/incidents` for live alarm feed

API URL handling:

- Uses `VITE_API_BASE_URL` if provided
- Otherwise falls back to `http://localhost:5000`

Frontend env file (optional): [frontend/.env](frontend/.env)

```bash
VITE_API_BASE_URL=http://localhost:5000
```

---

## 6) Local development setup

### Backend

```bash
cd Sentinel/backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Backend: `http://localhost:5000`

### Frontend

Open a second terminal:

```bash
cd Sentinel/frontend
npm install
npm run dev
```

Frontend (Vite): usually `http://localhost:5173`

---

## 7) Build / preview

### Frontend build

```bash
cd Sentinel/frontend
npm run build
npm run preview
```

### Backend run

```bash
cd Sentinel/backend
python app.py
```

---

## 8) Typical operator demo workflow

1. Start backend.
2. Start frontend.
3. Scroll through sections to reveal progressive header pills.
4. Trigger simulation from hero controls.
5. Watch live dashboard cards/charts/alarm feed update.
6. Open output section for backend summary numbers.
7. Use reset to clear state and rerun scenario.

---

## 9) Requirements summary

### Backend

- Python 3.10+
- Flask 3.0.0
- Flask-CORS 4.0.0

### Frontend

- Node.js 18+
- npm

---

## 10) Troubleshooting

- Frontend cannot fetch API:
  - verify backend is running on port `5000`
  - verify `VITE_API_BASE_URL` value if set

- Wrong/stale dashboard values:
  - use `POST /api/reset`
  - or restart backend (in-memory state)

- Port conflicts:
  - change backend port in [backend/app.py](backend/app.py)
  - restart frontend after env changes

- UI overlap concerns:
  - top spacing lane for progressive pills is already reserved in [frontend/src/App.tsx](frontend/src/App.tsx)

---

## 11) Status / scope note

Sentinel is a hackathon-style MVP focused on explainable event-to-incident simulation and polished operator-facing UI interactions. It is intentionally lightweight and optimized for demonstration velocity.
