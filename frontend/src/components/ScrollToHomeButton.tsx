import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SECTION_IDS } from "../constants/sections";

const SHOW_AFTER_Y = 360;

export function ScrollToHomeButton() {
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(() => {
    setVisible(window.scrollY > SHOW_AFTER_Y);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const goHome = () => {
    document
      .getElementById(SECTION_IDS.home)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          onClick={goHome}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/40 bg-[rgba(11,16,32,0.88)] text-electric shadow-neon-sm backdrop-blur-md transition-colors hover:border-electric/60 hover:text-surface"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.25} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
