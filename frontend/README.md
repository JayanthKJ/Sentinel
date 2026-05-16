# Sentinel Frontend

The full project documentation now lives in the root [README](../README.md).

This frontend is the React + TypeScript dashboard for the Sentinel demo. It connects to the Flask backend for:

- `POST /api/simulate`
- `GET /api/dashboard`
- `GET /api/incidents`

## Run locally

```bash
cd frontend
npm install
npm run dev
```

If you need frontend-specific details such as sections, styling, and backend integration notes, see the root [README](../README.md).
