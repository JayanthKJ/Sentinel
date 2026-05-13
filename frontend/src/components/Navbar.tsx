import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
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
    stiffness: 90,
    damping: 28,
    mass: 0.4,
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = NAV_ITEMS.length;
    const next = Math.min(n, Math.max(1, Math.ceil(v * n)));
    setVisibleCount((c) => (c !== next ? next : c));
  });

  const lineScale = useTransform(smoothProgress, (p) => Math.max(0.04, p));

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeIndex = useMemo(
    () => NAV_ITEMS.findIndex((x) => x.id === active),
    [active]
  );

  return (
    <>
      {/* Desktop: vertical scroll-reveal rail */}
      <motion.nav
        aria-label="Section navigation"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed right-2 top-1/2 z-50 hidden w-[200px] -translate-y-1/2 md:block lg:right-6 lg:w-[220px]"
      >
        <div className="pointer-events-auto relative pl-6">
          <div className="absolute left-2 top-1 bottom-1 w-px overflow-hidden rounded-full bg-surface/10">
            <motion.div
              className="w-full origin-top bg-gradient-to-b from-electric via-cyan to-electric/40"
              style={{ scaleY: lineScale, height: "100%" }}
            />
          </div>

          <ul className="flex flex-col items-stretch gap-1.5">
            {NAV_ITEMS.map((item, i) => {
              const isActive = item.id === active;
              const unlocked = i < visibleCount;

              return (
                <motion.li
                  key={item.id}
                  className="relative"
                  initial={false}
                  animate={{
                    opacity: unlocked ? 1 : 0,
                    x: unlocked ? 0 : 28,
                    scale: unlocked ? 1 : 0.92,
                    filter: unlocked ? "blur(0px)" : "blur(3px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                    delay: unlocked ? i * 0.05 : 0,
                  }}
                  style={{ pointerEvents: unlocked ? "auto" : "none" }}
                >
                  <motion.button
                    type="button"
                    onClick={() => go(item.id)}
                    whileHover={{
                      x: -6,
                      scale: 1.02,
                      boxShadow: "0 0 28px rgba(0,217,255,0.35)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative w-full overflow-hidden rounded-2xl border px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] transition-colors lg:px-4 lg:text-[11px] ${
                      isActive
                        ? "border-electric/60 bg-electric/15 text-electric shadow-neon-sm"
                        : "border-cyan-500/20 bg-[rgba(17,24,39,0.72)] text-muted backdrop-blur-xl hover:border-electric/35 hover:text-surface"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-desktop"
                        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(120%_100%_at_100%_50%,rgba(0,217,255,0.22),transparent)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 34,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <motion.span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-bg-primary/80 font-display text-[10px] text-electric"
                        animate={{
                          borderColor: isActive
                            ? "rgba(0,217,255,0.65)"
                            : "rgba(56,189,248,0.25)",
                          boxShadow: isActive
                            ? "0 0 14px rgba(0,217,255,0.45)"
                            : "0 0 0 rgba(0,0,0,0)",
                        }}
                      >
                        {i + 1}
                      </motion.span>
                      <span className="truncate">{item.label}</span>
                    </span>

                    {unlocked && (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-electric/8 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          repeatDelay: 2 + i * 0.3,
                          ease: "linear",
                        }}
                      />
                    )}
                  </motion.button>

                  {unlocked && activeIndex === i && (
                    <motion.span
                      layoutId="nav-node-pulse"
                      className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-electric shadow-[0_0_12px_2px_rgba(0,217,255,0.8)]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </motion.nav>

      {/* Mobile: bottom scroll-reveal chips */}
      <motion.nav
        aria-label="Section navigation"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed bottom-3 left-0 right-0 z-50 px-2 md:hidden"
      >
        <div className="pointer-events-auto mx-auto flex max-w-[100vw] justify-center gap-1 overflow-x-auto pb-safe scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((item, i) => {
            const isActive = item.id === active;
            const unlocked = i < visibleCount;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                initial={false}
                animate={{
                  opacity: unlocked ? 1 : 0,
                  y: unlocked ? 0 : 12,
                  scale: unlocked ? 1 : 0.85,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 28,
                  delay: unlocked ? i * 0.04 : 0,
                }}
                style={{ pointerEvents: unlocked ? "auto" : "none" }}
                whileTap={{ scale: 0.94 }}
                className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wide ${
                  isActive
                    ? "border-electric/60 bg-electric/20 text-electric shadow-neon-sm"
                    : "border-cyan-500/25 bg-[rgba(17,24,39,0.88)] text-muted backdrop-blur-md"
                }`}
              >
                {item.label.split(" ")[0]}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
