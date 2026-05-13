import { motion } from "framer-motion";

const COUNT = 48;

export function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: COUNT }).map((_, i) => {
        const left = `${(i * 37) % 100}%`;
        const top = `${(i * 53) % 100}%`;
        const delay = (i % 12) * 0.15;
        const duration = 4 + (i % 5);
        return (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-electric/40 shadow-neon-sm"
            style={{ left, top }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        );
      })}
    </div>
  );
}
