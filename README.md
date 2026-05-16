# Sentinel

Sentinel is a full-stack industrial monitoring demo with a Flask backend and a React + TypeScript frontend. The project simulates events from plant systems, groups them into incidents, and visualizes the results in a cinematic dashboard UI.

## Project layout

```text
Sentinel/
├── backend/   # Flask API, event simulator, incident intelligence layer
└── frontend/  # React + Vite dashboard and landing experience
```

## What it does

- Generates mock industrial monitoring events for systems like cooling, power, pressure, and network
- Processes those events and escalates critical conditions
- Detects incidents from clustered event patterns
- Exposes a simple JSON API for the frontend
- Renders a high-visual dashboard with simulation controls, analytics, and summary output

## Tech stack

### Backend

- Python 3
- Flask 3
- Flask-CORS
- In-memory dataclass models for events and incidents

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Lenis
- React Three Fiber / Three.js
- Recharts
- Lucide React

## Backend overview

The backend lives in [backend](backend) and is a lightweight Flask API designed for demo use.

### Main modules

- [backend/app.py](backend/app.py) — Flask app factory, CORS setup, health routes, blueprint registration
- [backend/routes/api.py](backend/routes/api.py) — API endpoints for events, incidents, simulation, dashboard, and reset
- [backend/services/simulator.py](backend/services/simulator.py) — creates realistic mock events
- [backend/services/event_processor.py](backend/services/event_processor.py) — processes and classifies events
- [backend/services/incident_manager.py](backend/services/incident_manager.py) — groups events into incidents
- [backend/models/event.py](backend/models/event.py) — event dataclass
- [backend/models/incident.py](backend/models/incident.py) — incident dataclass

### Data flow

1. The simulator generates raw monitoring events.
2. The processor normalizes and escalates event severity when needed.
3. The incident manager groups related events into incidents.
4. The API exposes the data as JSON for the frontend.

### API endpoints

Base URL: `http://localhost:5000`

- `GET /` — backend status and version
- `GET /health` — health check
- `GET /api/events` — list all processed events
  - Optional query params: `severity`, `system`, `status`
- `GET /api/incidents` — list detected incidents
  - Optional query params: `priority`, `status`
- `POST /api/simulate` — generate new mock events and incidents
  - Optional JSON body:
    ```json
    {
      "count": 10,
      "system": "cooling_system"
    }
    ```
- `GET /api/dashboard` — dashboard summary statistics
- `POST /api/reset` — clear all in-memory data

### Backend behavior notes

- All data is stored in memory for the demo
- Restarting the server clears events and incidents
- `POST /api/simulate` is the main way to populate the dashboard
- Critical event types such as `fan_failure`, `generator_failure`, `valve_stuck`, and `power_surge` are escalated automatically

## Frontend overview

The frontend lives in [frontend](frontend) and provides the visual product experience.

### Main modules

- [frontend/src/App.tsx](frontend/src/App.tsx) — page composition and section order
- [frontend/src/components/sections](frontend/src/components/sections) — all major UI sections
- [frontend/src/hooks/useLenis.ts](frontend/src/hooks/useLenis.ts) — smooth scrolling integration
- [frontend/src/hooks/useNavActiveSection.ts](frontend/src/hooks/useNavActiveSection.ts) — section tracking for navigation
- [frontend/src/index.css](frontend/src/index.css) — global theme, glassmorphism, neon styling, fonts

### UI sections

- Hero section with animated intro and 3D visual
- Problem section describing legacy monitoring pain points
- AI generator section with simulated prompt and preview
- Features section with capability cards
- Live dashboard section with charts and incident feed
- Digital twin section with process schematic animation
- Voice assistant section with voice-command style interaction
- Simulation section for triggering backend event generation
- Output section for backend-driven summary and analysis
- Team section for team cards
- Contact section with footer links and contact details

### Backend integration

The frontend calls the Flask API directly.

- `POST /api/simulate` from the simulation and output sections
- `GET /api/dashboard` from the output section
- `GET /api/incidents` from the live dashboard section

The app uses `VITE_API_BASE_URL` when it is set. If the variable is missing, the frontend falls back to `http://localhost:5000`.

### Frontend environment variable

Create a file named [frontend/.env](frontend/.env) if you want to override the backend host:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

## Local setup

### 1) Start the backend

```bash
cd Sentinel/backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`.

### 2) Start the frontend

Open a second terminal:

```bash
cd Sentinel/frontend
npm install
npm run dev
```

Frontend runs on Vite’s default dev server, usually `http://localhost:5173`.

## Build and preview

### Frontend production build

```bash
cd Sentinel/frontend
npm run build
npm run preview
```

### Backend manual run

```bash
cd Sentinel/backend
python app.py
```

## Example workflow

1. Start the backend.
2. Open the frontend in the browser.
3. Use the simulation controls to generate mock incidents.
4. Refresh the output section to fetch the latest summary.
5. Inspect the incidents list and dashboard charts.

## Requirements

### Backend

- Python 3.10+ recommended
- `Flask==3.0.0`
- `Flask-CORS==4.0.0`

### Frontend

- Node.js 18+ recommended
- npm

## Troubleshooting

- If the frontend cannot reach the backend, confirm the Flask server is running on port `5000`.
- If port `5000` is busy, stop the process using it or change the port in [backend/app.py](backend/app.py).
- If the frontend shows stale data, use `POST /api/reset` or restart the backend because the data is in memory.
- If you change `VITE_API_BASE_URL`, restart the frontend dev server so Vite picks up the new environment value.

## Notes

- This is a hackathon-style demo rather than a production system.
- The backend is intentionally simple and stateless.
- The frontend focuses on a polished industrial UI with motion, charts, and simulated operational data.
