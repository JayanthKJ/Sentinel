import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  Database,
  RefreshCw,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";

type DashboardSummary = {
  total_events: number;
  active_events: number;
  total_incidents: number;
  open_incidents: number;
  severity_breakdown: Record<string, number>;
  system_breakdown: Record<string, number>;
};

type ApiResponse = {
  success: boolean;
  summary?: DashboardSummary;
  message?: string;
  error?: string;
};

const severityOrder = ["critical", "high", "medium", "low"];

export function OutputSection() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const summaryPanelRef = useRef<HTMLDivElement>(null);

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

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/api/dashboard"));
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success || !data.summary) {
        throw new Error(data.error || "Failed to load output summary");
      }

      setSummary(data.summary);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load output summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSummary();
  }, []);

  const refreshSummary = async () => {
    await fetchSummary();
  };

  const analyzeLogs = async () => {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/api/simulate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: 10 }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze logs");
      }

      await fetchSummary();
      summaryPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze logs");
    } finally {
      setAnalyzing(false);
    }
  };

  const severityEntries = useMemo(
    () =>
      severityOrder.map((severity) => ({
        severity,
        value: summary?.severity_breakdown?.[severity] ?? 0,
      })),
    [summary]
  );

  const systemEntries = useMemo(
    () =>
      Object.entries(summary?.system_breakdown ?? {}).sort((a, b) => b[1] - a[1]),
    [summary]
  );

  const cards = [
    {
      label: "Total events",
      value: summary?.total_events ?? "—",
      icon: Database,
      tone: "text-electric",
    },
    {
      label: "Active events",
      value: summary?.active_events ?? "—",
      icon: Activity,
      tone: "text-success",
    },
    {
      label: "Incidents detected",
      value: summary?.total_incidents ?? "—",
      icon: AlertTriangle,
      tone: "text-danger",
    },
    {
      label: "Open incidents",
      value: summary?.open_incidents ?? "—",
      icon: Server,
      tone: "text-cyan",
    },
  ];

  return (
    <section
      id="output"
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,217,255,0.1),transparent_50%),linear-gradient(to_bottom,rgba(2,6,23,0.4),rgba(2,6,23,0.95))]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-electric">
            Output display
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface md:text-4xl">
            Backend <span className="gradient-text">summary output</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted md:text-lg">
            This is the main deliverable: log analysis results, incident counts,
            and the generated operational summary presented in one place.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <motion.button
            type="button"
            onClick={analyzeLogs}
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0,217,255,0.35)" }}
            whileTap={{ scale: 0.98 }}
            disabled={analyzing}
            className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-electric backdrop-blur-xl transition disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
          >
            <Sparkles className="h-4 w-4" />
            {analyzing ? "Analyzing logs" : "Generate summary"}
          </motion.button>

          <motion.button
            type="button"
            onClick={refreshSummary}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[rgba(15,23,42,0.8)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted backdrop-blur-xl transition hover:text-surface disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh summary
          </motion.button>
        </div>

        {error && (
          <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="glass-panel neon-border rounded-2xl p-5"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted">
                  <span>{card.label}</span>
                  <Icon className={`h-4 w-4 ${card.tone}`} />
                </div>
                <p className={`mt-4 font-mono text-5xl font-bold tracking-tight tabular-nums ${card.tone}`}>
                  {loading ? "…" : card.value}
                </p>
              </div>
            );
          })}
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            ref={summaryPanelRef}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="glass-panel neon-border scroll-mt-32 rounded-3xl p-5 md:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                  Generated summary
                </p>
                <h3 className="mt-2 font-display text-2xl text-surface">
                  Operational report
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                <Zap className="h-4 w-4" />
                {loading ? "Loading" : "Ready"}
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
              {summary
                ? `The backend currently tracks ${summary.total_events} total events, with ${summary.active_events} active and ${summary.open_incidents} open incidents. This output panel is built for the most important requirement in the project: presenting the analyzed log summary clearly and immediately.`
                : "Loading the latest backend summary…"}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {severityEntries.map((item) => (
                <div
                  key={item.severity}
                  className="rounded-2xl border border-cyan-500/15 bg-bg-secondary/60 p-4"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted">
                    <span>{item.severity}</span>
                    <span className="text-electric tabular-nums">{item.value}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-bg-primary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-electric to-cyan"
                      style={{ width: `${Math.min(100, item.value * 12)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-500/15 bg-bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                Refresh state
              </p>
              <p className="mt-2 text-sm text-muted">
                {lastUpdated
                  ? `Last updated at ${lastUpdated}.`
                  : "No refresh has been completed yet."}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-6"
          >
            <div className="glass-panel neon-border rounded-3xl p-5 md:p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                <Brain className="h-4 w-4 text-electric" />
                Summary intelligence
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <p>• Backend log analysis and incident aggregation in one view.</p>
                <p>• Designed to surface the actionable summary immediately.</p>
                <p>• Built to refresh after every simulation run or backend update.</p>
              </div>
            </div>

            <div className="glass-panel neon-border rounded-3xl p-5 md:p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                <Server className="h-4 w-4 text-cyan" />
                System breakdown
              </div>
              <div className="mt-4 space-y-3">
                {systemEntries.length > 0 ? (
                  systemEntries.map(([system, count]) => (
                    <div
                      key={system}
                      className="flex items-center justify-between rounded-2xl border border-cyan-500/15 bg-bg-secondary/60 px-4 py-3 text-sm"
                    >
                      <span className="text-surface">{system}</span>
                      <span className="font-semibold text-electric tabular-nums">
                        {count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">No system breakdown data yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}