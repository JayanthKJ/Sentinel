import { AnimatePresence, motion } from "framer-motion";
import { createElement, useState } from "react";
import {
  AlertOctagon,
  Flame,
  Gauge,
  Loader2,
  Play,
  PlugZap,
  Power,
  RotateCcw,
} from "lucide-react";

type Scenario = {
  key: string;
  title: string;
  detail: string;
  icon: typeof Flame;
};

const SCENARIOS: Scenario[] = [
  {
    key: "fire",
    title: "Fire detected · Zone B",
    detail: "Suppressant sequence primed. Evacuation routes highlighted on all HMIs.",
    icon: Flame,
  },
  {
    key: "pump",
    title: "Pump P2 mechanical fault",
    detail: "Vibration envelope exceeded trip threshold. Auto failover to P3 initiated.",
    icon: Gauge,
  },
  {
    key: "sensor",
    title: "Sensor mesh degradation",
    detail: "FT-204 offline · Kalman observers compensating with reduced confidence.",
    icon: PlugZap,
  },
  {
    key: "pressure",
    title: "Pressure spike on header H1",
    detail: "Relief valve arm command issued. Operator acknowledgement required.",
    icon: AlertOctagon,
  },
  {
    key: "shutdown",
    title: "Emergency shutdown engaged",
    detail: "Controlled coast-down in progress. All non-safety IO locked out.",
    icon: Power,
  },
];

export function SimulationSection() {
  const [open, setOpen] = useState<Scenario | null>(null);
  const [flash, setFlash] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const apiUrl = (path: string) => {
    const base = import.meta.env.VITE_API_BASE_URL;

    if (base) {
      return `${base.replace(/\/$/, "")}${path}`;
    }

    if (window.location.port === "5173" || window.location.port === "4173") {
      return `http://localhost:5000${path}`;
    }

    return path;
  };

  const trigger = (s: Scenario) => {
    setOpen(s);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 420);
  };

  const resetSimulation = () => {
    setOpen(null);
    setFlash(false);
    setStatus(null);
  };

  const runSimulation = async () => {
    try {
      setRunning(true);
      setStatus(null);

      const response = await fetch(apiUrl("/api/simulate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: 10 }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Simulation request failed");
      }

      setStatus(
        `Generated ${data.events_generated} events and detected ${data.incidents_detected} incidents.`
      );
      setFlash(true);
      window.setTimeout(() => setFlash(false), 420);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to run simulation");
    } finally {
      setRunning(false);
    }
  };

  return (
    <section
      id="simulation"
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32"
    >
      <motion.div
        className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
        animate={{ opacity: flash ? 0.35 : 0 }}
        transition={{ duration: 0.12 }}
        style={{ background: "radial-gradient(circle, #EF4444 0%, transparent 60%)" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-secondary to-bg-primary" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-danger">
            Simulation deck
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface md:text-4xl">
            Emergency <span className="text-danger">control center</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted md:text-lg">
            Stress-test the HMI layer with cinematic incidents — purely visual for
            this demo, but tuned like a real crisis console.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"
        >
          <div className="order-2 flex flex-wrap items-center justify-center gap-3 lg:order-1 lg:justify-start">
            {[
              { label: "Trigger Fire", s: SCENARIOS[0] },
              { label: "Pump Failure", s: SCENARIOS[1] },
              { label: "Sensor Disconnect", s: SCENARIOS[2] },
              { label: "Pressure Spike", s: SCENARIOS[3] },
              { label: "Emergency Shutdown", s: SCENARIOS[4] },
            ].map((b) => (
              <motion.button
                key={b.label}
                type="button"
                onClick={() => trigger(b.s)}
                whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(239,68,68,0.45)" }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-danger/50 bg-[rgba(30,41,59,0.75)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-danger backdrop-blur-xl md:text-sm"
              >
                {b.label}
              </motion.button>
            ))}
          </div>

          <div className="order-1 flex flex-wrap items-center justify-center gap-3 lg:order-2 lg:justify-end lg:justify-self-end">
            <motion.button
              type="button"
              onClick={runSimulation}
              whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(0,217,255,0.35)" }}
              whileTap={{ scale: 0.97 }}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-[rgba(14,22,38,0.85)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-electric backdrop-blur-xl transition disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {running ? "Running simulator" : "Run simulator"}
            </motion.button>

            <motion.button
              type="button"
              onClick={resetSimulation}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[rgba(15,23,42,0.8)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted backdrop-blur-xl transition hover:text-surface md:text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </motion.button>
          </div>
        </motion.div>

        {status && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-5 max-w-2xl text-center text-sm text-muted"
          >
            {status}
          </motion.p>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg rounded-3xl border border-danger/50 bg-[rgba(15,23,42,0.95)] p-8 shadow-[0_0_60px_rgba(239,68,68,0.35)]"
            >
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{
                  boxShadow: "inset 0 0 60px rgba(239,68,68,0.35)",
                }}
              />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/15 text-danger">
                  {createElement(open.icon, { className: "h-7 w-7" })}
                </div>
                <h3 className="text-center font-display text-2xl font-bold text-surface">
                  {open.title}
                </h3>
                <p className="mt-3 text-center text-sm leading-relaxed text-muted">
                  {open.detail}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    className="rounded-full border border-cyan-500/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-muted hover:text-surface"
                  >
                    Acknowledge
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    className="rounded-full bg-gradient-to-r from-danger to-orange-500 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_24px_rgba(239,68,68,0.55)]"
                  >
                    Resolve (demo)
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
