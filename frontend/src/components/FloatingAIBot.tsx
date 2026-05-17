import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingAIBot() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 120);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-16 right-4 z-[75] md:bottom-20 md:right-6"
        >
          <motion.button
            type="button"
            onClick={() => document.getElementById("output")?.scrollIntoView({ behavior: "smooth" })}
            animate={{ y: [0, -6, 0], rotate: [0, -1.2, 1.2, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
            aria-label="Open AI summary"
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(0,217,255,0.35),transparent_68%)] blur-xl" />

            <div className="relative h-[76px] w-[62px] rounded-[24px] border border-cyan-300/45 bg-[linear-gradient(165deg,rgba(56,189,248,0.92),rgba(2,6,23,0.88))] shadow-[0_0_24px_rgba(0,217,255,0.28)]">
              <div className="absolute left-1/2 top-[-7px] h-3 w-3 -translate-x-1/2 rounded-full border border-cyan-300/50 bg-electric/65" />
              <div className="absolute inset-x-1.5 top-2.5 rounded-xl border border-cyan-300/30 bg-[rgba(2,6,23,0.75)] px-1 py-1">
                <div className="flex items-center justify-between px-1">
                  <div className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                  <div className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                </div>
                <div className="mx-auto mt-1 h-1 w-5 rounded-full bg-cyan-300/70" />
              </div>

              <div className="absolute -left-1.5 top-[31px] h-6 w-2.5 rounded-full border border-cyan-300/35 bg-cyan-500/35" />
              <div className="absolute -right-1.5 top-[31px] h-6 w-2.5 rounded-full border border-cyan-300/35 bg-cyan-500/35" />

              <motion.div
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="absolute -right-1.5 -top-1.5 rounded-full border border-electric/60 bg-[rgba(2,6,23,0.86)] p-1 text-electric"
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
            </div>
            <p className="mt-1 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-electric/90">
              AI Summary
            </p>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
