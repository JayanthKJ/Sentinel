import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { NAV_ITEMS } from "../../constants/sections";

export function ContactSection() {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer
      id="contact"
      className="relative border-t border-cyan-500/15 px-4 pb-16 pt-20 md:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-bg-primary" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-sm font-semibold uppercase tracking-[0.35em] text-electric">
              SmartHMI AI
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-surface md:text-4xl">
              Bring your plant into the{" "}
              <span className="gradient-text">intelligent HMI era</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              This repository ships as a premium single-page experience — wire it to
              your historians, MQTT buses, and safety systems when you are ready.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-electric" />
                team@smarthmi.ai
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-electric" />
                Remote-first · Global pilots
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel neon-border rounded-2xl p-4 md:p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
              Quick navigation
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {NAV_ITEMS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => go(n.id)}
                  className="rounded-xl border border-transparent px-2 py-2 text-left text-muted transition-colors hover:border-cyan-500/30 hover:text-surface"
                >
                  {n.label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3 text-xs text-muted">
              <span className="cursor-pointer hover:text-electric">GitHub</span>
              <span className="cursor-pointer hover:text-electric">YouTube</span>
              <span className="cursor-pointer hover:text-electric">Devpost</span>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cyan-500/10 pt-6 text-xs text-muted md:flex-row">
          <span>© {new Date().getFullYear()} SmartHMI AI · Hackathon concept build.</span>
          <span className="text-[11px]">
            Crafted with React, Tailwind, Framer Motion, GSAP, R3F, Lenis &amp; Recharts.
          </span>
        </div>
      </div>
    </footer>
  );
}
