import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Cpu, Droplets, Gauge, ShieldAlert, Waves } from "lucide-react";

const PROMPT =
  "Water treatment plant with 3 pumps, 2 tanks, pressure sensors";

const chartData = [
  { t: "00", p: 42 },
  { t: "04", p: 48 },
  { t: "08", p: 52 },
  { t: "12", p: 46 },
  { t: "16", p: 55 },
  { t: "20", p: 50 },
];

export function AIGeneratorSection() {
  const [phase, setPhase] = useState<"idle" | "typing" | "gen" | "done">(
    "idle"
  );
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setPhase("typing"), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(PROMPT.slice(0, i));
      if (i >= PROMPT.length) {
        window.clearInterval(id);
        setPhase("gen");
      }
    }, 32);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "gen") return;
    const t = window.setTimeout(() => setPhase("done"), 2200);
    return () => window.clearTimeout(t);
  }, [phase]);

  const tanks = useMemo(
    () => [
      { label: "Tank A", level: 78 },
      { label: "Tank B", level: 64 },
    ],
    []
  );

  return (
    <section
      id="ai-generator"
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-electric">
            Neural layout synthesis
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface md:text-4xl">
            AI Dashboard <span className="gradient-text">Generator</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted md:text-lg">
            Describe your process in plain language. SmartHMI AI composes gauges,
            trends, alarms, and navigation in seconds.
          </p>
        </motion.div>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-panel neon-border relative rounded-2xl p-4 md:p-5 lg:rounded-3xl"
          >
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted">
              <Cpu className="h-4 w-4 text-electric" />
              Console / Prompt
            </div>
            <div className="min-h-[120px] rounded-2xl border border-cyan-500/20 bg-bg-secondary/80 p-4 font-mono text-sm text-surface shadow-inner">
              {typed}
              <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-electric align-middle" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <AnimatePresence mode="wait">
                {phase === "gen" && (
                  <motion.div
                    key="gen"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3 text-sm text-electric"
                  >
                    <span className="relative flex h-10 w-10 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric/35" />
                      <span className="relative inline-flex h-8 w-8 rounded-full bg-electric/25 shadow-neon-sm" />
                    </span>
                    Generating holographic layout…
                  </motion.div>
                )}
                {phase === "done" && (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-semibold text-success"
                  >
                    Layout compiled · Ready for deployment
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="relative min-h-[420px]"
          >
            {(phase === "idle" || phase === "typing") && (
              <div className="glass-panel neon-border flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border-dashed p-5 text-center md:min-h-[360px] lg:rounded-3xl">
                <p className="text-xs uppercase tracking-[0.35em] text-muted">
                  Awaiting synthesis
                </p>
                <p className="mt-4 max-w-sm text-sm text-surface">
                  The neural renderer will project a full HMI topology here once the
                  prompt is encoded.
                </p>
              </div>
            )}
            <AnimatePresence>
              {(phase === "gen" || phase === "done") && (
                <motion.div
                  initial={{ opacity: 0, rotateX: 18, y: 40 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ perspective: 1400 }}
                  className="glass-panel neon-border relative overflow-hidden rounded-2xl p-4 md:p-5 lg:rounded-3xl"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">
                        Live preview
                      </p>
                      <p className="font-display text-lg text-surface">
                        WTP · Pressure manifold
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                      Online
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-4">
                      <div className="rounded-2xl border border-cyan-500/20 bg-bg-secondary/70 p-4">
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span>Suction pressure</span>
                          <Gauge className="h-4 w-4 text-electric" />
                        </div>
                        <p className="mt-2 font-display text-3xl text-electric">
                          4.8
                          <span className="text-base text-muted"> bar</span>
                        </p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-primary">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-electric to-cyan"
                            initial={{ width: "40%" }}
                            animate={{ width: "72%" }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-danger/35 bg-danger/10 p-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-danger">
                          <ShieldAlert className="h-4 w-4" />
                          Chlorine residual trending low
                        </div>
                        <p className="mt-1 text-[11px] text-muted">
                          Predictive model suggests dosing pump inspection within
                          48h.
                        </p>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="h-40 rounded-2xl border border-cyan-500/15 bg-bg-secondary/60 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#00D9FF" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="t" stroke="#64748B" tick={{ fontSize: 10 }} />
                            <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                            <Area
                              type="monotone"
                              dataKey="p"
                              stroke="#38BDF8"
                              fill="url(#pgrad)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {tanks.map((t) => (
                          <div
                            key={t.label}
                            className="rounded-2xl border border-cyan-500/20 bg-bg-secondary/70 p-3"
                          >
                            <div className="flex items-center justify-between text-xs text-muted">
                              <span>{t.label}</span>
                              <Droplets className="h-4 w-4 text-cyan" />
                            </div>
                            <div className="mt-2 h-24 overflow-hidden rounded-xl bg-bg-primary/80">
                              <motion.div
                                className="w-full bg-gradient-to-t from-electric/40 to-cyan/60"
                                initial={{ height: "20%" }}
                                animate={{ height: `${t.level}%` }}
                                transition={{ duration: 1.4, ease: "easeOut" }}
                              />
                            </div>
                            <p className="mt-2 text-right text-xs text-muted">
                              {t.level}% level
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {["Pump P1 · Run", "Pump P2 · Run", "Pump P3 · Standby"].map(
                          (s) => (
                            <span
                              key={s}
                              className="rounded-full border border-cyan-500/25 bg-[rgba(15,23,42,0.85)] px-3 py-1 text-muted"
                            >
                              <Waves className="mr-1 inline h-3 w-3 text-electric" />
                              {s}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
