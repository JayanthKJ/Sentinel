import { motion } from "framer-motion";

export function CircuitBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wire" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00D9FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 120 H400 V280 H900 V80 H1400"
        fill="none"
        stroke="url(#wire)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.path
        d="M200 600 H700 V420 H1200 V200 H1800"
        fill="none"
        stroke="url(#wire)"
        strokeWidth="1"
        strokeDasharray="6 10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.5 }}
      />
      <motion.path
        d="M100 900 H500 V700 H1100"
        fill="none"
        stroke="#00D9FF"
        strokeOpacity="0.25"
        strokeWidth="1"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: [0.1, 0.45, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </svg>
  );
}
