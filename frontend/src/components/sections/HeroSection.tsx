import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Hero3D } from "./Hero3D";
import { ParticleField } from "../ParticleField";
import { CircuitBackdrop } from "../CircuitBackdrop";
import { HeroNavigateDeck } from "../HeroNavigateDeck";
import type { SectionId } from "../../constants/sections";

type Props = {
  activeSection: SectionId;
};

export function HeroSection({ activeSection }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-20 pt-28 md:px-10 md:pb-24"
    >
      <motion.div style={{ y: yBg, opacity }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-bg-primary" />
        <div className="absolute inset-0 bg-radial-glow opacity-90" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,217,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.07) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <ParticleField />
        <CircuitBackdrop />
      </motion.div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="order-1 lg:order-none">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-[rgba(30,41,59,0.45)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-electric backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" />
            Next-Gen Industrial HMI
          </motion.div>

          <motion.h1
            className="font-display text-4xl font-bold leading-tight tracking-tight text-surface md:text-5xl lg:text-6xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.15 },
              },
            }}
          >
            {[
              "Reinventing",
              "Industrial",
              "Control",
              "Interfaces",
              "with",
              "AI",
            ].map((word, i) => (
              <motion.span
                key={word + i}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="mr-[0.35em] inline-block"
              >
                {word === "AI" ? (
                  <span className="gradient-text animate-glow-text font-extrabold">
                    {word}
                  </span>
                ) : (
                  <span className="text-surface">{word}</span>
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-6 max-w-xl text-lg text-muted md:text-xl"
          >
            Design adaptive industrial dashboards in minutes, not weeks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-x-4 gap-y-3"
          >
            <motion.button
              type="button"
              onClick={() => scrollTo("live-demo")}
              whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(0,217,255,0.45)" }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-electric to-cyan px-8 py-3.5 font-semibold text-bg-primary shadow-neon"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => scrollTo("features")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-cyan-500/40 bg-[rgba(17,24,39,0.65)] px-8 py-3.5 font-semibold text-surface backdrop-blur-xl transition-colors hover:border-electric/70 hover:text-electric"
            >
              Explore Features
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotateX: 12 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ perspective: 1200 }}
          className="order-2 flex flex-col items-center justify-center lg:order-none lg:items-end"
        >
          <div className="glass-panel neon-border relative w-full max-w-[540px] rounded-2xl p-4 md:p-5 lg:rounded-3xl">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-electric/20 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-cyan/25 blur-3xl" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Hero3D />
            </motion.div>
            <p className="mt-4 text-center text-xs uppercase tracking-[0.35em] text-muted">
              Live neural mesh preview
            </p>
          </div>
        </motion.div>

        <HeroNavigateDeck
          active={activeSection}
          heroScrollProgress={scrollYProgress}
        />
      </div>
    </section>
  );
}
