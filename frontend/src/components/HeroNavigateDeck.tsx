import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { NAV_ITEMS, type SectionId } from "../constants/sections";

/** First chip starts here; each chip gets its own slot so they appear strictly one after another */
const REVEAL_START = 0.1;
const SLOT = 0.078;
const SLOT_GAP = 0.006;

const CHIP_ACCENTS = [
  "from-electric/25 to-cyan-500/10 text-electric border-electric/45",
  "from-cyan-500/20 to-sky-500/10 text-cyan border-cyan-400/45",
  "from-success/20 to-emerald-500/10 text-success border-success/45",
  "from-fuchsia-500/20 to-violet-500/10 text-fuchsia-300 border-fuchsia-400/45",
];

type Props = {
  active: SectionId;
  heroScrollProgress: MotionValue<number>;
};

function NavChip({
  nav,
  active,
  heroScrollProgress,
  stackIndex,
}: {
  nav: (typeof NAV_ITEMS)[number];
  active: SectionId;
  heroScrollProgress: MotionValue<number>;
  stackIndex: number;
}) {
  const isActive = nav.id === active;
  const start = REVEAL_START + stackIndex * (SLOT + SLOT_GAP);
  const end = start + SLOT;

  const zigRight = stackIndex % 2 === 0;
  const slideX = zigRight ? -72 : 72;
  const liftFrom = zigRight ? 56 : 44;
  const skew = zigRight ? -18 : 18;

  const opacity = useTransform(
    heroScrollProgress,
    [0, start, start + 0.018, end, 1],
    [0, 0, 1, 1, 1]
  );
  const x = useTransform(heroScrollProgress, [0, start, end, 1], [
    slideX,
    slideX,
    0,
    0,
  ]);
  const y = useTransform(heroScrollProgress, [0, start, end, 1], [
    liftFrom,
    liftFrom,
    0,
    0,
  ]);
  const scale = useTransform(heroScrollProgress, [0, start, end, 1], [
    0.78, 0.78, 1, 1,
  ]);

  const rotateX = useTransform(heroScrollProgress, (p) => {
    if (p < start) return 50;
    if (p <= end) {
      const t = (p - start) / (end - start);
      return 50 * (1 - t);
    }
    return Math.sin((p - end) * 5 + stackIndex * 0.3) * 2;
  });

  const rotateY = useTransform(heroScrollProgress, (p) => {
    if (p < start) return skew;
    if (p <= end) {
      const t = (p - start) / (end - start);
      return skew * (1 - t);
    }
    return Math.sin((p - end) * 4 + stackIndex * 0.5) * 2.5;
  });

  const translateZ = useTransform(heroScrollProgress, (p) => {
    if (p < start) return -80;
    if (p <= end) {
      const t = (p - start) / (end - start);
      return -80 * (1 - t);
    }
    return Math.sin((p - end) * 3 + stackIndex) * 5;
  });

  const blurFilter = useTransform(heroScrollProgress, (p) => {
    if (p < start) return "blur(12px)";
    if (p <= end) {
      const t = (p - start) / (end - start);
      const px = 12 * (1 - t);
      return `blur(${Math.max(0, px)}px)`;
    }
    return "blur(0px)";
  });

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const accent = CHIP_ACCENTS[stackIndex % CHIP_ACCENTS.length];
  const ringShift =
    stackIndex % 2 === 0 ? "group-hover:translate-x-1" : "group-hover:-translate-x-1";
  const number = String(stackIndex + 1).padStart(2, "0");

  return (
    <motion.div
      style={{
        opacity,
        x,
        y,
        scale,
        rotateX,
        rotateY,
        translateZ,
        filter: blurFilter,
        transformPerspective: 980,
        transformStyle: "preserve-3d",
      }}
      className="flex w-full justify-center will-change-transform"
    >
      <motion.button
        type="button"
        onClick={() => go(nav.id)}
        whileHover={{
          rotateX: -6,
          rotateY: stackIndex % 2 === 0 ? 4 : -4,
          translateZ: 12,
          boxShadow: "0 0 32px rgba(0,217,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`group relative w-full max-w-[min(100%,18rem)] overflow-hidden border px-4 py-3.5 text-xs font-bold uppercase tracking-wide backdrop-blur-sm transition-colors sm:max-w-[min(100%,20rem)] sm:px-5 sm:py-4 sm:text-sm md:max-w-[min(100%,22rem)] md:px-6 md:py-5 md:text-[15px] md:tracking-[0.12em] ${
          isActive
            ? "border-electric/70 bg-electric/20 text-electric shadow-neon-sm"
            : `border-cyan-500/35 bg-[rgba(11,16,32,0.78)] text-surface/90 hover:border-electric/55 hover:text-electric bg-gradient-to-br ${accent}`
        } rounded-2xl`}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-electric to-cyan opacity-80"
          animate={{ opacity: isActive ? [0.7, 1, 0.7] : 0.55 }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] tracking-[0.24em] text-muted/90">
          {number}
        </span>
        {isActive && (
          <motion.span
            layoutId="hero-nav-active"
            className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(100%_100%_at_50%_0%,rgba(0,217,255,0.22),transparent_70%)]"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2 line-clamp-2 text-center leading-tight">
          <ArrowUpRight className={`h-3.5 w-3.5 opacity-80 transition-transform ${ringShift}`} />
          {nav.label}
        </span>
      </motion.button>
    </motion.div>
  );
}

export function HeroNavigateDeck({ active, heroScrollProgress }: Props) {
  const captionOpacity = useTransform(
    heroScrollProgress,
    [0, 0.06, 0.18],
    [0, 1, 1]
  );
  const captionY = useTransform(heroScrollProgress, [0, 0.12], [14, 0]);

  return (
    <>
      {/* Fixed Side-Rail Navigation - Right Side, Partially Hidden Until Hover */}
      <div className="pointer-events-none fixed bottom-0 right-0 top-0 z-40 hidden flex-col items-center justify-center py-8 md:flex pr-2">
        <motion.div
          initial={{ x: 120 }}
          whileHover={{ x: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="pointer-events-auto group relative flex flex-col gap-3 rounded-lg bg-[rgba(11,16,32,0.85)] backdrop-blur-md p-3 border border-cyan-500/20 hover:border-electric/40 hover:shadow-neon-sm"
        >
          {/* Buttons - Slide In on Hover */}
          <motion.div className="flex flex-col gap-3">
            {NAV_ITEMS.map((nav, idx) => {
              const isActive = nav.id === active;
              const accentIdx = idx % CHIP_ACCENTS.length;
              const accent = CHIP_ACCENTS[accentIdx];
              return (
                <motion.button
                  key={nav.id}
                  type="button"
                  onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all backdrop-blur-sm ${
                    isActive
                      ? "border-electric/70 bg-electric/20 text-electric shadow-neon-sm"
                      : `border-cyan-500/35 bg-[rgba(11,16,32,0.78)] text-surface/90 hover:border-electric/55 hover:text-electric bg-gradient-to-br ${accent}`
                  }`}
                >
                  {nav.label}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* In-Page Sticky Hero Deck - All Devices */}
      <div className="col-span-full order-3 mt-16 w-full md:mt-24">
        <div className="sticky top-6 z-20 mx-auto max-w-2xl px-2 md:top-8 md:max-w-4xl lg:max-w-5xl">
        <motion.p
          className="mb-4 text-center font-display text-[9px] font-semibold uppercase tracking-[0.28em] text-electric/70 md:mb-5 md:text-[10px]"
          style={{ opacity: captionOpacity, y: captionY }}
        >
          Scroll — cards appear one by one · zigzag path
        </motion.p>
        <div
          className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-7 md:gap-x-6 md:gap-y-9"
          style={{
            perspective: "1100px",
            transformStyle: "preserve-3d",
          }}
        >
          {NAV_ITEMS.map((nav, stackIndex) => {
            const row = Math.floor(stackIndex / 2);
            const zig =
              row % 2 === 0
                ? "translate-y-2 sm:translate-y-2.5 md:translate-y-3"
                : "-translate-y-2 sm:-translate-y-2.5 md:-translate-y-3";
            return (
              <div key={nav.id} className={`flex justify-center ${zig}`}>
                <NavChip
                  nav={nav}
                  active={active}
                  heroScrollProgress={heroScrollProgress}
                  stackIndex={stackIndex}
                />
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </>
  );
}
