import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { GraduationCap, Briefcase, ArrowUpRight } from "lucide-react";
import { API_URL } from "../config/api";

const fallbackExperiences = [
  {
    _id: "experience-1",
    section: "education",
    year: "2022 - Present",
    title: "BSc (Hons) in Software Engineering",
    organization: "University Name (e.g., SLIIT, IIT)",
    description:
      "Currently pursuing undergraduate degree. Focusing on Full Stack Development, Data Structures, and Algorithms.",
  },
  {
    _id: "experience-2",
    section: "education",
    year: "2020 - 2022",
    title: "G.C.E Advanced Level",
    organization: "School Name",
    description: "Physical Science Stream. Achieved high distinction.",
  },
  {
    _id: "experience-3",
    section: "experience",
    year: "2024",
    title: "Full Stack Developer Intern",
    organization: "Tech Company Name",
    description:
      "Assisted in building RESTful APIs using Node.js and Express. Developed responsive frontend UI with React.",
  },
  {
    _id: "experience-4",
    section: "experience",
    year: "2023",
    title: "Freelance Web Developer",
    organization: "Self-Employed",
    description:
      "Developed custom websites for small businesses using HTML, CSS, and JavaScript. Delivered high-quality, responsive designs.",
  },
];

const Experience = () => {
  const [experiences, setExperiences] = useState(fallbackExperiences);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/experiences`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setExperiences(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    void loadExperiences();
  }, []);

  const groupedExperiences = useMemo(() => {
    const groups = experiences.reduce((accumulator, item) => {
      const section = item.section === "education" ? "education" : "experience";
      if (!accumulator[section]) {
        accumulator[section] = [];
      }
      accumulator[section].push(item);
      return accumulator;
    }, {});

    Object.keys(groups).forEach((sectionKey) => {
      groups[sectionKey].sort(
        (left, right) => (left.order || 0) - (right.order || 0),
      );
    });

    return groups;
  }, [experiences]);

  const sections = [
    {
      key: "experience",
      label: "Experience",
      icon: Briefcase,
      accent: "from-sky-500/20 to-cyan-400/5",
    },
    {
      key: "education",
      label: "Education",
      icon: GraduationCap,
      accent: "from-emerald-500/20 to-lime-400/5",
    },
  ];

  return (
    <section id="experience" className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience & Education
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const items = groupedExperiences[section.key] || [];

            return (
              <div
                key={section.key}
                className={`rounded-3xl border border-white/10 bg-gradient-to-br ${section.accent} p-6 md:p-8 shadow-xl shadow-black/20`}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="rounded-2xl border border-white/10 bg-primary/70 p-3 text-accent">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {section.label}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {items.length} entries
                    </p>
                  </div>
                </div>

                <div className="space-y-6 border-l-2 border-slate-700 ml-3 pl-8 relative">
                  {items.map((item, index) => (
                    <Motion.div
                      key={item._id}
                      initial={{
                        opacity: 0,
                        x: section.key === "experience" ? 20 : -20,
                      }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileHover={{ x: 4 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="relative rounded-2xl border border-white/5 bg-primary/55 p-5"
                    >
                      <Motion.span
                        className="absolute -left-[41px] top-6 w-5 h-5 bg-accent rounded-full border-4 border-secondary"
                        whileHover={{ scale: 1.18 }}
                      />
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <span className="text-accent font-medium text-sm uppercase tracking-[0.25em]">
                            {item.year}
                          </span>
                          <h4 className="text-xl font-bold text-white mt-2">
                            {item.title}
                          </h4>
                          <p className="text-slate-400 text-sm mb-3">
                            {item.organization}
                          </p>
                        </div>
                        <ArrowUpRight
                          className="text-slate-500 mt-1"
                          size={18}
                        />
                      </div>
                      <p className="text-slate-300 leading-7">
                        {item.description}
                      </p>
                    </Motion.div>
                  ))}

                  {items.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-primary/40 p-5 text-slate-400 text-sm">
                      No {section.label.toLowerCase()} entries yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
