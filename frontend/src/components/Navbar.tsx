import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useMemo, useState } from "react";
import { NAV_ITEMS, type SectionId } from "../constants/sections";

type Props = {
  active: SectionId;
};

export function Navbar({ active }: Props) {
  const [visibleCount, setVisibleCount] = useState(1);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.35,
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = NAV_ITEMS.length;
    const next = Math.min(n, Math.max(1, Math.ceil(v * n)));
    setVisibleCount((c) => (c !== next ? next : c));
  });

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeIndex = useMemo(
    () => NAV_ITEMS.findIndex((x) => x.id === active),
    [active]
  );

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent"
        aria-hidden
      />

      <motion.nav
        aria-label="Section navigation"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-3 pt-1 md:px-4 md:pb-4"
      >
        <motion.div
          layout
          className="glass-panel neon-border pointer-events-auto w-full max-w-3xl overflow-hidden rounded-xl border px-2.5 py-2 shadow-depth md:max-w-4xl md:rounded-2xl md:px-3 md:py-2.5"
        >
          <div className="relative mb-2 h-1 overflow-hidden rounded-full bg-bg-secondary md:mb-2.5">
            <motion.div
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-electric via-cyan to-electric/70"
              style={{ scaleX: smoothProgress }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-1 md:gap-1.5">
            {NAV_ITEMS.map((item, i) => {
              const isActive = item.id === active;
              const unlocked = i < visibleCount;

              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{
                    opacity: unlocked ? 1 : 0,
                    y: unlocked ? 0 : 20,
                    scale: unlocked ? 1 : 0.65,
                    rotateX: unlocked ? 0 : -14,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                    delay: unlocked ? i * 0.05 : 0,
                  }}
                  style={{
                    pointerEvents: unlocked ? "auto" : "none",
                    perspective: 800,
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={() => go(item.id)}
                    whileHover={{
                      y: -2,
                      scale: 1.03,
                      boxShadow: "0 0 20px rgba(0,217,255,0.35)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    className={`relative overflow-hidden rounded-lg border px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide transition-colors sm:px-2 sm:py-1.5 sm:text-[9px] md:rounded-xl md:px-2.5 md:py-1.5 md:text-[10px] md:tracking-[0.12em] ${
                      isActive
                        ? "border-electric/60 bg-electric/15 text-electric shadow-neon-sm"
                        : "border-cyan-500/25 bg-[rgba(15,23,42,0.75)] text-muted backdrop-blur-md hover:border-electric/40 hover:text-surface"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-main"
                        className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-[radial-gradient(100%_120%_at_50%_0%,rgba(0,217,255,0.28),transparent_65%)] md:rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1 md:gap-1.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-cyan-500/35 bg-bg-primary/90 font-display text-[8px] text-electric md:h-5 md:w-5 md:rounded-md md:text-[9px]">
                        {i + 1}
                      </span>
                      <span className="max-w-[4.5rem] truncate sm:max-w-[6rem] md:max-w-[8.5rem]">
                        {item.label}
                      </span>
                    </span>

                    {unlocked && isActive && (
                      <motion.span
                        layoutId="nav-scan"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-120%" }}
                        animate={{ x: "120%" }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          repeatDelay: 0.8,
                          ease: "linear",
                        }}
                      />
                    )}

                    {unlocked && activeIndex === i && (
                      <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-electric shadow-[0_0_8px_rgba(0,217,255,0.85)]" />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-1.5 text-center text-[8px] font-medium uppercase tracking-[0.2em] text-muted md:mt-2 md:text-[9px]">
            Scroll — buttons unlock in order · tap to jump
          </p>
        </motion.div>
      </motion.nav>
    </>
  );
}
