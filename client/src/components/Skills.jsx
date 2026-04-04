import React, { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { API_URL } from "../config/api";
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
import { FiLayers, FiCode, FiTool } from "react-icons/fi";

const fallbackSkills = [
  { _id: "fallback-1", name: "React", category: "Frontend" },
  { _id: "fallback-2", name: "Tailwind CSS", category: "Frontend" },
  { _id: "fallback-3", name: "UI Motion", category: "Frontend" },
  { _id: "fallback-4", name: "Node.js", category: "Backend" },
  { _id: "fallback-5", name: "Express.js", category: "Backend" },
  { _id: "fallback-6", name: "MongoDB", category: "Backend" },
  { _id: "fallback-7", name: "Git / GitHub", category: "Tools" },
  { _id: "fallback-8", name: "VS Code", category: "Tools" },
  { _id: "fallback-9", name: "Postman", category: "Tools" },
];

const iconMap = {
  React: FaReact,
  "Tailwind CSS": SiTailwindcss,
  "UI Motion": FaFigma,
  "Node.js": FaNodeJs,
  "Express.js": SiExpress,
  MongoDB: SiMongodb,
  Python: FaPython,
  "Git / GitHub": FaGitAlt,
  "VS Code": TbBrandVscode,
  Postman: SiPostman,
  Docker: FaDocker,
};

const categoryIconMap = {
  Frontend: FiCode,
  Backend: FiLayers,
  Tools: FiTool,
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${API_URL}/api/skills`);
        const data = await response.json();
        setSkills(
          Array.isArray(data) && data.length > 0 ? data : fallbackSkills,
        );
      } catch {
        setSkills(fallbackSkills);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const groupedSkills = useMemo(() => {
    const grouped = skills.reduce((accumulator, skill) => {
      const category = skill.category || "Other";
      if (!accumulator[category]) {
        accumulator[category] = [];
      }
      accumulator[category].push(skill);
      return accumulator;
    }, {});

    return Object.entries(grouped);
  }, [skills]);

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
            A living map of the tools, frameworks, and workflow habits I use
            across projects.
          </p>
        </div>

        {loading ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-secondary/60 py-8 text-center text-slate-300 backdrop-blur-lg">
            Loading skills...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {groupedSkills.map(([category, items], groupIndex) => {
              const CategoryIcon = categoryIconMap[category] || FiLayers;

              return (
                <Motion.article
                  key={category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: groupIndex * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-[1.75rem] border border-white/10 bg-secondary/65 p-7 backdrop-blur-lg shadow-xl shadow-black/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {category}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-400">
                        {items.length} skills logged
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-accent transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                      <CategoryIcon size={20} />
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-4">
                    {items.map((skill, skillIndex) => {
                      const SkillIcon = iconMap[skill.name] || FiCode;

                      return (
                        <Motion.div
                          key={skill._id || skill.name}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{
                            duration: 0.35,
                            delay: skillIndex * 0.06,
                          }}
                          whileHover={{ y: -4 }}
                          className="group/item rounded-2xl border border-white/10 bg-primary/50 px-4 py-5 text-center shadow-lg shadow-black/10 transition-all hover:border-accent/40 hover:bg-white/5"
                        >
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-accent transition-transform duration-300 group-hover/item:rotate-6">
                            <SkillIcon size={22} />
                          </div>
                          <p className="mt-4 text-sm font-semibold tracking-wide text-slate-100">
                            {skill.name}
                          </p>
                        </Motion.div>
                      );
                    })}
                  </div>
                </Motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
