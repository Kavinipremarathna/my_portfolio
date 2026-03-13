import React, { useState } from "react";
import { motion } from "framer-motion";

const skillsData = [
  {
    category: "Frontend",
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
    items: [
      "Git & Hubble",
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
    <section id="skills" className="py-20 bg-primary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            My Skills
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillsData.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              onHoverStart={() => setActiveCard(index)}
              onHoverEnd={() => setActiveCard(null)}
              className="relative bg-secondary p-8 rounded-xl border border-slate-700 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10"
            >
              <motion.div
                className="absolute top-0 left-0 h-1 bg-accent rounded-t-xl"
                initial={{ width: 0 }}
                animate={{ width: activeCard === index ? "100%" : "0%" }}
                transition={{ duration: 0.35 }}
              />
              <h3 className="text-xl font-bold text-accent mb-6 text-center">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {category.items.map((item, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-sm border border-slate-700"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
