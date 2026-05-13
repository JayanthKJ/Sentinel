import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const COMMANDS = [
  "Show pressure status",
  "Open maintenance dashboard",
  "Mute low priority alarms",
];

export function VoiceAssistantSection() {
  return (
    <section
      id="voice-assistant"
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,217,255,0.18),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-electric">
            Voice layer
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface md:text-4xl">
            Talk to your <span className="gradient-text">plant</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted md:text-lg">
            Wake-word optional, command grammar optimized for field operators, with
            visual confirmation on the glass HUD.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto mt-14 max-w-xl"
        >
          <div className="glass-panel neon-border relative rounded-3xl px-5 py-8 md:rounded-[2rem] md:px-8 md:py-10">
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_0%,rgba(0,217,255,0.25),transparent_60%)]" />

            <div className="relative flex flex-col items-center">
              <div className="relative flex h-40 w-40 items-center justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute inline-flex h-full w-full rounded-full border border-electric/40"
                    initial={{ scale: 0.6, opacity: 0.45 }}
                    animate={{ scale: 1.4 + i * 0.25, opacity: 0 }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      delay: i * 0.45,
                      ease: "easeOut",
                    }}
                  />
                ))}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 40px rgba(0,217,255,0.45)",
                      "0 0 70px rgba(56,189,248,0.65)",
                      "0 0 40px rgba(0,217,255,0.45)",
                    ],
                  }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                  className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-electric/40 to-cyan/30 shadow-neon"
                >
                  <Mic className="h-10 w-10 text-bg-primary" />
                </motion.div>
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-muted">
                Listening · Neural beamforming on
              </p>

              <div className="mt-8 flex h-14 w-full max-w-md items-end justify-center gap-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-electric to-cyan"
                    animate={{
                      height: [10, 10 + ((i * 13) % 34), 10],
                      opacity: [0.35, 1, 0.35],
                    }}
                    transition={{
                      duration: 1.1 + (i % 5) * 0.08,
                      repeat: Infinity,
                      delay: i * 0.03,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              <div className="mt-10 grid w-full gap-3 text-left md:grid-cols-1">
                {COMMANDS.map((c, i) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="rounded-2xl border border-cyan-500/25 bg-bg-secondary/70 px-4 py-3 text-sm text-surface backdrop-blur-md"
                  >
                    <span className="text-xs uppercase tracking-[0.25em] text-electric">
                      Sample
                    </span>
                    <p className="mt-1 font-medium">&ldquo;{c}&rdquo;</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
