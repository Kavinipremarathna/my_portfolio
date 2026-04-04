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
    items: [
      { name: "React", icon: FaReact },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "UI Motion", icon: FaFigma },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", icon: FaNodeJs },
      { name: "Express.js", icon: SiExpress },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Python", icon: FaPython },
    ],
  },
  {
    category: "Tools & Others",
    items: [
      { name: "Git / GitHub", icon: FaGitAlt },
      { name: "VS Code", icon: TbBrandVscode },
      { name: "Postman", icon: SiPostman },
      { name: "Docker", icon: FaDocker },
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
            Skills Matrix
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-slate-300 text-lg leading-8">
            A clean snapshot of the tools and stacks I use most often.
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
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-white">
                  {group.category}
                </h3>
                <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  {group.items.length} skills
                </span>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4">
                {group.items.map((skill, skillIndex) => {
                  const Icon = skill.icon;
                  return (
                    <Motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.35, delay: skillIndex * 0.06 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group/item rounded-2xl border border-white/10 bg-primary/50 px-4 py-5 text-center shadow-lg shadow-black/10 transition-all hover:border-accent/40 hover:bg-white/5"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-accent transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-3">
                        <Icon size={22} />
                      </div>
                      <p className="mt-4 text-sm font-semibold tracking-wide text-slate-100">
                        {skill.name}
                      </p>
                    </Motion.div>
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
