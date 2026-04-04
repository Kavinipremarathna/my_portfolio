import React, { useState } from "react";
import { Layers3, Sparkles, Wrench } from "lucide-react";

const skillsData = [
  {
    category: "Frontend",
    description: "Interfaces with motion, clarity, and responsive behavior.",
    icon: Sparkles,
    items: [
      "React.js",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "HTML5/CSS3",
      "Framer Motion",
      "Redux",
    ],
  },
  {
    category: "Backend",
    description:
      "APIs, data flows, and authentication that hold up in production.",
    icon: Layers3,
    items: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
      "SQL",
      "Authentication (JWT)",
    ],
  },
  {
    category: "Tools & Others",
    description:
      "Shipping, debugging, and collaborating with the right tooling.",
    icon: Wrench,
    items: [
      "Git & GitHub",
      "VS Code",
      "Postman",
      "Figma",
      "Vercel/Netlify",
      "Agile/Scrum",
    ],
  },
];

const Skills = () => {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section id="skills" className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_28%)]" />
      <div className="container mx-auto px-6">
        <div className="relative text-center mb-16 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold mb-4">
            Capabilities
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            My Skills
          </h2>
          <p className="text-slate-300 text-lg leading-8">
            The stack I use to build responsive, maintainable products with a
            clean visual finish.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillsData.map((category, index) => (
            <div
              key={index}
              onHoverStart={() => setActiveCard(index)}
              onHoverEnd={() => setActiveCard(null)}
              className="relative bg-secondary/80 p-8 rounded-[1.75rem] border border-white/10 hover:border-accent/40 transition-all hover:shadow-xl hover:shadow-accent/10 backdrop-blur-sm"
            >
              <div
                className="absolute top-0 left-0 h-1 bg-accent rounded-t-xl transition-all duration-300"
                style={{ width: activeCard === index ? "100%" : "0%" }}
              />
              <div className="flex items-center justify-between gap-4 mb-5">
                <h3 className="text-xl font-bold text-white">
                  {category.category}
                </h3>
                <category.icon className="text-accent" size={20} />
              </div>
              <p className="text-sm text-slate-400 mb-6 leading-6">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {category.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-900/80 text-slate-200 px-3 py-1 rounded-full text-sm border border-white/10 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
