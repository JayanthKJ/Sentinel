import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function DigitalTwinSection() {
  const root = useRef<HTMLDivElement>(null);
  const flow = useRef<SVGPathElement>(null);
  const flow2 = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    const p1 = flow.current;
    const p2 = flow2.current;
    if (!el || !p1 || !p2) return;

    const ctx = gsap.context(() => {
      gsap.set(".twin-node", { transformOrigin: "50% 50%", scale: 0.6, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
      tl.fromTo(
        p1,
        { strokeDashoffset: 400 },
        { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }
      ).fromTo(
        p2,
        { strokeDashoffset: 320 },
        { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" },
        "-=1.4"
      );

      gsap.to(".twin-node", {
        scrollTrigger: { trigger: el, start: "top 65%" },
        scale: 1,
        opacity: 1,
        stagger: 0.12,
        duration: 0.6,
        ease: "back.out(1.6)",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="digital-twin"
      ref={root}
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-electric">
            Digital twin
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface md:text-4xl">
            See the plant as a <span className="gradient-text">living system</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted md:text-lg">
            Pipes, pumps, and buffers rendered as an always-on holographic topology —
            perfect for control room immersion.
          </p>
        </motion.div>

        <div className="glass-panel neon-border relative mt-14 overflow-hidden rounded-2xl p-4 md:p-6 lg:rounded-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,217,255,0.12),transparent_55%)]" />
          <svg
            viewBox="0 0 900 420"
            className="relative mx-auto h-auto w-full max-w-5xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pipe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M40 220 H220 V120 H420 V260 H700 V160 H860"
              fill="none"
              stroke="url(#pipe)"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.35"
            />
            <path
              ref={flow}
              d="M40 220 H220 V120 H420 V260 H700 V160 H860"
              fill="none"
              stroke="#00D9FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="400"
              strokeDashoffset="400"
              filter="url(#glow)"
            />
            <path
              d="M120 360 H320 V220 H520 V320 H780"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              ref={flow2}
              d="M120 360 H320 V220 H520 V320 H780"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="320"
              strokeDashoffset="320"
              filter="url(#glow)"
            />

            <g className="twin-node">
              <circle cx="220" cy="120" r="18" fill="#0B1020" stroke="#00D9FF" strokeWidth="2" />
              <text x="220" y="125" textAnchor="middle" fill="#F8FAFC" fontSize="10">
                HX1
              </text>
            </g>
            <g className="twin-node">
              <circle cx="420" cy="260" r="20" fill="#0B1020" stroke="#38BDF8" strokeWidth="2" />
              <text x="420" y="266" textAnchor="middle" fill="#F8FAFC" fontSize="10">
                P1
              </text>
            </g>
            <g className="twin-node">
              <circle cx="700" cy="160" r="20" fill="#0B1020" stroke="#00D9FF" strokeWidth="2" />
              <text x="700" y="166" textAnchor="middle" fill="#F8FAFC" fontSize="10">
                TK1
              </text>
            </g>

            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "420px 260px" }}
            >
              <circle cx="420" cy="260" r="34" fill="none" stroke="#00D9FF" strokeOpacity="0.25" />
            </motion.g>

            <rect
              x="600"
              y="300"
              width="120"
              height="80"
              rx="14"
              fill="rgba(15,23,42,0.85)"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            <motion.rect
              x="610"
              y="360"
              width="100"
              height="10"
              rx="4"
              fill="#00D9FF"
              opacity="0.35"
              animate={{ y: [360, 332, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <text x="660" y="295" textAnchor="middle" fill="#94A3B8" fontSize="11">
              Buffer tank
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
