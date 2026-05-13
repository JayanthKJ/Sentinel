import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  Boxes,
  Cpu,
  LayoutDashboard,
  Mic2,
  MousePointer2,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    title: "AI Dashboard Generator",
    desc: "Natural language to fully instrumented screens.",
    icon: Cpu,
  },
  {
    title: "Drag and Drop No-Code Builder",
    desc: "Snap-to-grid industrial primitives with live data binding.",
    icon: MousePointer2,
  },
  {
    title: "Digital Twin Visualization",
    desc: "Flow, pressure, and energy modeled in cinematic 3D.",
    icon: Boxes,
  },
  {
    title: "Predictive Maintenance AI",
    desc: "Fleet-level anomaly detection with explainable signals.",
    icon: Sparkles,
  },
  {
    title: "Alarm Intelligence",
    desc: "Correlation, deduplication, and severity that respects context.",
    icon: AlertTriangle,
  },
  {
    title: "Voice Assistant",
    desc: "Hands-free navigation tuned for noisy plant environments.",
    icon: Mic2,
  },
  {
    title: "Role-Based Smart Views",
    desc: "Operator, engineer, and executive lenses from one source of truth.",
    icon: Users,
  },
  {
    title: "Emergency Mode",
    desc: "High-contrast, minimal latency UI for crisis operations.",
    icon: Shield,
  },
  {
    title: "AI Chat Assistant",
    desc: "Ask questions across manuals, trends, and shift logs.",
    icon: Bot,
  },
  {
    title: "Smart Recommendations",
    desc: "Nudges that align production, safety, and energy targets.",
    icon: Zap,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-secondary" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-electric">
            Full-stack HMI intelligence
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface md:text-4xl">
            Everything your <span className="gradient-text">control room</span>{" "}
            was missing
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted md:text-lg">
            A cohesive feature surface inspired by Tesla-grade UX, Iron Man HUD
            clarity, and mission-critical reliability.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.55 }}
                whileHover={{
                  y: -10,
                  rotateX: 6,
                  rotateY: -4,
                  transition: { type: "spring", stiffness: 260, damping: 20 },
                }}
                style={{ perspective: 900 }}
                className="group relative"
              >
                <div className="glass-panel neon-border relative h-full overflow-hidden rounded-2xl p-6 transition-shadow duration-300 group-hover:shadow-neon">
                  <motion.div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "conic-gradient(from 180deg at 50% 50%, rgba(0,217,255,0.0), rgba(0,217,255,0.25), rgba(56,189,248,0.0))",
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-xl border border-electric/35 bg-electric/10 p-3 text-electric shadow-neon-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-surface">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-[rgba(15,23,42,0.8)] px-4 py-2 text-xs text-muted backdrop-blur-md">
            <LayoutDashboard className="h-4 w-4 text-electric" />
            Designed for DCS, PLC, and MQTT-native architectures.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
