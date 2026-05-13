import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import {
  BellOff,
  Gauge,
  Layers,
  SlidersHorizontal,
  Timer,
  Wrench,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    title: "Static manual dashboards",
    body: "Every screen is hand-coded. Changes crawl through change control while downtime clocks tick.",
    icon: SlidersHorizontal,
  },
  {
    title: "Alarm fatigue",
    body: "Critical signals drown in redundant alerts. Operators learn to ignore the very warnings that matter.",
    icon: BellOff,
  },
  {
    title: "Slow engineering workflows",
    body: "Tag mapping, faceplates, and navigation trees consume weeks that should be spent optimizing the process.",
    icon: Timer,
  },
  {
    title: "Poor UX",
    body: "Legacy HMIs were never designed for touch, glanceability, or modern cognitive ergonomics.",
    icon: Gauge,
  },
  {
    title: "Lack of adaptability",
    body: "Same dense screens for every role — from the plant floor to the control room to remote leadership.",
    icon: Layers,
  },
  {
    title: "Complex maintenance interfaces",
    body: "Technicians juggle fragmented tools instead of a unified, context-aware operational picture.",
    icon: Wrench,
  },
];

export function ProblemSection() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".problem-card", {
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
        y: 80,
        opacity: 0,
        rotateX: 12,
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="problem"
      ref={root}
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-electric">
            The industrial UX crisis
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-surface md:text-4xl">
            Traditional control systems were never built for{" "}
            <span className="gradient-text">speed or intelligence</span>
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            SmartHMI AI replaces brittle screen-by-screen engineering with adaptive,
            AI-native interfaces that learn your plant.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            const fromLeft = i % 2 === 0;
            return (
              <motion.div
                key={card.title}
                className="problem-card group relative perspective-1000"
                style={{ perspective: 1200 }}
                whileHover={{ y: -8, rotateX: 4, rotateY: fromLeft ? 3 : -3 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <div className="glass-panel neon-border relative h-full overflow-hidden rounded-2xl p-4 transition-shadow duration-300 group-hover:shadow-neon md:p-5">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-electric/10 blur-3xl transition-opacity group-hover:opacity-100" />
                  <div className="mb-4 inline-flex rounded-xl border border-electric/30 bg-electric/10 p-3 text-electric shadow-neon-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-surface">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {card.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
