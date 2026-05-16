import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BellRing, Flame, Gauge } from "lucide-react";

const pieColors = ["#00D9FF", "#38BDF8", "#10B981", "#64748B"];

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

export function LiveDashboardSection() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  const buildTrend = () =>
    Array.from({ length: 18 }).map((_, i) => ({
      t: `${i * 2}s`,
      q: 110 + Math.sin(i / 2) * 14 + i * 0.4,
    }));

  const trend = useMemo(() => buildTrend(), []);

  const [trendData, setTrendData] = useState(trend);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTrendData((d) => {
        const next = [...d.slice(1)];
        const last = d[d.length - 1];
        next.push({
          t: `${Number.parseInt(last.t, 10) + 2}s`,
          q: Math.max(
            95,
            last.q + (Math.random() - 0.5) * 10 + (Math.random() - 0.5) * 3
          ),
        });
        return next;
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  const health = dashboardData
  ? (Object.entries(dashboardData.severity_breakdown) as [string, number][])
      .map(([name, value]) => ({
        name,
        value,
      }))
  : [];

  type Alarm = {
    incident_id: string;
    timestamp: string;
    incident_title: string;
    priority: string;
  };

  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [lastGraphRefresh, setLastGraphRefresh] = useState<string | null>(null);

  const refreshGraphData = () => {
    setTrendData(buildTrend());
    setLastGraphRefresh(new Date().toLocaleTimeString());

    Promise.all([fetch(apiUrl("/api/incidents")), fetch(apiUrl("/api/dashboard"))])
      .then(async ([incidentsRes, dashboardRes]) => {
        const incidentsData = await incidentsRes.json();
        const dashboardJson = await dashboardRes.json();

        setAlarms(incidentsData?.incidents ?? []);
        setDashboardData(dashboardJson?.summary ?? null);
      })
      .catch(() => {
        // Keep existing data visible even if refresh fails.
      });
  };


  useEffect(() => {
    refreshGraphData();
    const id = window.setInterval(refreshGraphData, 5000);
    return () => window.clearInterval(id);
  }, []);

  // trigger re-renders so relative times refresh periodically
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 5000);
    return () => window.clearInterval(id);
  }, []);

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return ts;
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const timeAgo = (ts: string) => {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (Math.abs(seconds) < 60) return rtf.format(-seconds, "second");
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return rtf.format(-minutes, "minute");
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return rtf.format(-hours, "hour");
    const days = Math.floor(hours / 24);
    return rtf.format(-days, "day");
  };

  return (
    <section
      id="live-demo"
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,217,255,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.12),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-electric">
              Live Demo
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-surface md:text-4xl">
              Industrial monitoring, <span className="gradient-text">alive</span>
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              A Tesla-grade supervisory canvas with synthetic live telemetry — no
              backend required for this hackathon build.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-success/35 bg-success/10 px-4 py-2 text-xs font-semibold text-success">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Synthetic live stream
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="glass-panel neon-border mt-12 rounded-2xl p-3 md:p-4 lg:rounded-3xl"
        >
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-cyan-500/20 bg-bg-secondary/70 p-4 lg:col-span-1">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Active Events</span>
                <Flame className="h-4 w-4 text-electric" />
              </div>
              <p className="mt-3 font-display text-4xl text-electric">
                {dashboardData?.active_events ?? 0}
                <span className="text-base text-muted"> events</span>
              </p>
              {/* <div className="mt-4 h-2 rounded-full bg-bg-primary">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-electric to-cyan"
                  animate={{ width: `${Math.min(100, (temp / 120) * 100)}%` }}
                />
              </div> */}
              <p className="mt-2 text-xs text-muted">Live system event stream</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-bg-secondary/70 p-4 lg:col-span-1">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Open Incidents</span>
                <Gauge className="h-4 w-4 text-cyan" />
              </div>
              <p className="mt-3 font-display text-4xl text-surface">
                {dashboardData?.open_incidents ?? 0}
                <span className="text-base text-muted"> active</span>
              </p>
              <p className="mt-2 text-xs text-muted">Requires operator attention</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-bg-secondary/70 p-4 lg:col-span-1">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Critical Alerts</span>
                <Activity className="h-4 w-4 text-success" />
              </div>
              <p className="mt-3 font-display text-4xl text-success">
                {dashboardData?.severity_breakdown?.critical ?? 0}
                <span className="text-base text-muted"> critical</span>
              </p>
              <p className="mt-2 text-xs text-muted">High priority failures detected</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-bg-secondary/70 p-4 lg:col-span-1">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Total Incidents</span>
                <Activity className="h-4 w-4 text-electric" />
              </div>
              <p className="mt-3 font-display text-4xl text-electric">
                {dashboardData?.total_incidents ?? 0}
                <span className="text-base text-muted"> detected</span>
              </p>
              <p className="mt-2 text-xs text-muted">AI grouped incident clusters</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-cyan-500/15 bg-bg-secondary/60 p-3">
              <div className="mb-2 flex items-center justify-between px-1 text-xs text-muted">
                <span>Event Activity Trend</span>
                <span className="text-electric">Live</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="flowFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#00D9FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 6" stroke="#1f2937" />
                    <XAxis dataKey="t" stroke="#64748B" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#0B1020",
                        border: "1px solid rgba(56,189,248,0.35)",
                        borderRadius: 12,
                        color: "#F8FAFC",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="q"
                      stroke="#38BDF8"
                      strokeWidth={2}
                      fill="url(#flowFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/15 bg-bg-secondary/60 p-4">
              <p className="text-xs font-semibold text-surface">System Alert Distribution</p>
              <div className="mt-2 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={health}
                      innerRadius={48}
                      outerRadius={68}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="#0B1020"
                      strokeWidth={2}
                      isAnimationActive={false}
                      label={false}
                    >
                      {health.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      cursor={{ fill: "rgba(0, 217, 255, 0.12)" }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const row = payload[0];
                        return (
                          <div className="min-w-[130px] rounded-xl border border-cyan-500/40 bg-[#0B1020] px-3 py-2 shadow-xl">
                            <p className="text-sm font-semibold text-surface">
                              {row.name}
                            </p>
                            <p className="mt-0.5 text-xs tabular-nums text-electric">
                              {row.value}%
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1.5 text-[11px]">
                {health.map((h, i) => (
                  <div
                    key={h.name}
                    className="flex items-center justify-between gap-2 text-surface"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full ring-1 ring-surface/30"
                        style={{ background: pieColors[i % pieColors.length] }}
                      />
                      <span className="truncate font-medium">{h.name}</span>
                    </span>
                    <span className="shrink-0 tabular-nums font-semibold text-electric">
                      {dashboardData
                        ? Math.round(
                            (h.value / dashboardData.total_events) * 100
                          )
                        : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-cyan-500/15 bg-bg-secondary/60 p-3 lg:col-span-2">
              <div className="mb-2 flex items-center justify-between px-1 text-xs text-muted">
                <span>Alert Intensity Timeline</span>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                  >
                    <CartesianGrid strokeDasharray="3 6" stroke="#1f2937" />
                    <XAxis dataKey="t" hide />
                    <YAxis stroke="#64748B" tick={{ fontSize: 10 }} domain={[0, 2]} />
                    <Tooltip
                      contentStyle={{
                        background: "#0B1020",
                        border: "1px solid rgba(56,189,248,0.35)",
                        borderRadius: 12,
                        color: "#F8FAFC",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/15 bg-bg-secondary/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted">
                <BellRing className="h-4 w-4 text-electric" />
                Alarm feed
              </div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted">
                {lastGraphRefresh
                  ? `Auto-refreshed at ${lastGraphRefresh}`
                  : "Auto-refresh active every 5 seconds"}
              </p>
              <div className="space-y-3">
                {alarms.map((a, index) => (
                  <div
                    key={a.incident_id || index}
                    className={`rounded-xl border px-3 py-2 text-[11px] ${
                      a.priority === "critical"
                        ? "border-danger/50 bg-danger/10 text-danger"
                        : a.priority === "warning"
                          ? "border-electric/40 bg-electric/5 text-surface"
                          : "border-cyan-500/20 text-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-wide opacity-70">
                        {formatTimestamp(a.timestamp)}
                      </p>
                      <p className="text-[10px] opacity-70 text-muted ml-2">
                        {timeAgo(a.timestamp)}
                      </p>
                    </div>
                    <p className="mt-1 leading-snug">{a.incident_title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
