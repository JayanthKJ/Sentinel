import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowUpToLine } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SECTION_IDS } from "../constants/sections";

const SHOW_AFTER_Y = 360;
const END_THRESHOLD = 180;

export function ScrollToHomeButton() {
  const [visible, setVisible] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = useCallback(() => {
    setVisible(window.scrollY > SHOW_AFTER_Y);
    const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    setAtEnd(distanceFromBottom < END_THRESHOLD);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const goToSection = () => {
    document
      .getElementById(SECTION_IDS.home)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const label = atEnd ? "Return to top" : "Back to top";
  const Icon = atEnd ? ArrowUpToLine : ArrowUp;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          onClick={goToSection}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-[rgba(11,16,32,0.88)] px-4 py-3 text-electric shadow-neon-sm backdrop-blur-md transition-colors hover:border-electric/60 hover:text-surface"
          aria-label={label}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            {label}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
