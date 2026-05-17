import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV_ITEMS, type SectionId } from "../constants/sections";

type Props = {
  active: SectionId;
};

export function HeroNavigateDeck({ active }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === active);
  const visibleCount = isVisible ? Math.max(1, activeIndex + 1) : 0;
  const visibleItems = NAV_ITEMS.slice(0, visibleCount);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      const revealAt = 8;
      setIsVisible(window.scrollY > revealAt);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
      aria-hidden={!isVisible}
    >
      <div className="pointer-events-auto mx-auto flex h-16 w-full max-w-7xl items-center justify-center px-3 md:h-20 md:px-6">
        <AnimatePresence initial={false}>
          {visibleCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex max-w-full gap-2 overflow-x-auto rounded-full px-2 py-1"
            >
              <AnimatePresence initial={false}>
                {visibleItems.map((nav, idx) => {
                  const isActive = nav.id === active;
                  return (
                    <motion.button
                      key={nav.id}
                      type="button"
                      onClick={() => go(nav.id)}
                      initial={{ opacity: 0, y: -8, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.92 }}
                      whileHover={{ y: -2, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      className={`group shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition md:px-3.5 md:py-2 ${
                        isActive
                          ? "border-electric/75 bg-electric/15 text-electric shadow-[0_0_0_1px_rgba(0,217,255,0.3),0_0_14px_rgba(0,217,255,0.22)]"
                          : "border-cyan-500/30 bg-[rgba(15,23,42,0.75)] text-surface/90 hover:border-electric/55 hover:text-electric"
                      }`}
                    >
                      {nav.label}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
