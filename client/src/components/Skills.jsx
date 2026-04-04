import React from "react";
import { motion as Motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaFigma,
  FaDocker,
} from "react-icons/fa";
import { SiTailwindcss, SiMongodb, SiPostman, SiExpress } from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";

const skillsData = [
  {
    category: "Frontend",
    description: "Visual engineering for crisp, responsive user experiences.",
    items: [
      { name: "React", level: 92, icon: FaReact },
      { name: "Tailwind", level: 89, icon: SiTailwindcss },
      { name: "UI Animation", level: 85, icon: FaFigma },
    ],
  },
  {
    category: "Backend",
    description:
      "Reliable APIs and secure architecture with scalable patterns.",
    items: [
      { name: "Node.js", level: 88, icon: FaNodeJs },
      { name: "Express", level: 86, icon: SiExpress },
      { name: "MongoDB", level: 84, icon: SiMongodb },
      { name: "Python", level: 79, icon: FaPython },
    ],
  },
  {
    category: "Tools & Others",
    description: "Tooling and workflow that keep delivery smooth and fast.",
    items: [
      { name: "Git / GitHub", level: 90, icon: FaGitAlt },
      { name: "VS Code", level: 94, icon: TbBrandVscode },
      { name: "Postman", level: 82, icon: SiPostman },
      { name: "Docker", level: 72, icon: FaDocker },
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.1),transparent_36%)]" />
      <div className="container mx-auto px-6 relative">
        <div className="relative text-center mb-16 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold mb-4">
            Expertise
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Skills That Deliver
          </h2>
          <p className="text-slate-300 text-lg leading-8">
            A practical stack with strong fundamentals across frontend, backend,
            and developer tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {skillsData.map((group, groupIndex) => (
            <Motion.article
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: groupIndex * 0.1 }}
              whileHover={{ y: -6 }}
              className="group rounded-[1.75rem] border border-white/10 bg-secondary/65 p-7 backdrop-blur-lg shadow-xl shadow-black/20"
            >
              <h3 className="text-2xl font-bold text-white">
                {group.category}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-7">
                {group.description}
              </p>

              <div className="mt-7 space-y-5">
                {group.items.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="rounded-xl border border-white/10 bg-primary/50 p-4 transition-colors group-hover:border-accent/30"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-3">
                          <Icon className="text-accent" size={20} />
                          <span className="font-medium text-slate-200">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-accent">
                          {skill.level}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <Motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-accent to-cyan-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
