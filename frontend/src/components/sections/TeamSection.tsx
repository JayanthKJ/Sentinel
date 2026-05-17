import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

const TEAM = [
  {
    name: "Harish J Gowda",
    role: "AI Developer",
    handle: "@harish",
    linkedin: "https://www.linkedin.com/in/harish-gowda-j-2a4361369?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/HarishGowdaJ",
  },
  {
    name: "Shreya S R",
    role: "Backend Developer",
    handle: "@shreya",
    initials: "SRS",
    linkedin: "https://www.linkedin.com/in/shreya-sr-937545287?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/shreya04-anie",
  },
  {
    name: "Jayanth K J",
    role: "Backend Developer",
    handle: "@jayanth",
    linkedin: "https://www.linkedin.com/in/jayanth-k-j?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/JayanthKJ",
  },
  {
    name: "Aditya A S",
    role: "Frontend Developer",
    handle: "@aditya",
    initials: "ASA",
    linkedin: "https://www.linkedin.com/in/aditya-haradibots?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/asaoxm",
  },
  {
    name: "Veekshitha K",
    role: "Frontend Developer",
    handle: "@veekshitha",
    linkedin: "https://www.linkedin.com/in/veekshitha-k-2145-dbrv-?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/Veekshitha21",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="relative px-4 py-24 md:px-10 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-electric">
            Crew
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface md:text-4xl">
            Built by operators, <span className="gradient-text">for operators</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {TEAM.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -10, rotateX: 5 }}
              style={{ perspective: 900 }}
              className="group"
            >
              <div className="glass-panel neon-border relative overflow-hidden rounded-2xl p-4 text-center transition-shadow duration-300 group-hover:shadow-neon md:p-5">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-electric/40 to-cyan/25 font-display text-lg font-bold text-bg-primary shadow-neon-sm">
                  {m.initials ??
                    m.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                </div>
                <h3 className="font-display text-lg font-semibold text-surface">
                  {m.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                  {m.role}
                </p>
                <p className="mt-3 text-xs text-electric">{m.handle}</p>
                <div className="mt-4 flex justify-center gap-3 text-muted">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${m.name} LinkedIn profile`}
                    className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 px-3 py-1 text-[11px] text-electric transition hover:border-electric/70 hover:bg-electric/10"
                  >
                    <Linkedin className="h-4 w-4" />
                    Profile
                  </a>
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${m.name} GitHub profile`}
                    className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 px-3 py-1 text-[11px] text-electric transition hover:border-electric/70 hover:bg-electric/10"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
