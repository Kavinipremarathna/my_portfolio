import React from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Code2, Rocket, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-secondary to-primary"
    >
      <div className="container mx-auto px-6">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="lg:w-5/12 space-y-6">
              <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold">
                About Me
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Building thoughtful digital products with a premium feel.
              </h2>
              <p className="text-slate-300 text-lg leading-8">
                I’m a software engineering undergraduate focused on creating
                polished web apps, useful interfaces, and systems that stay fast
                as they scale.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                View full about page <ArrowRight size={16} />
              </Link>
            </div>

            <div className="lg:w-7/12 grid gap-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: Rocket,
                    label: "Fast delivery",
                    value: "Practical builds",
                  },
                  { icon: Code2, label: "Core stack", value: "React + Node" },
                  {
                    icon: Award,
                    label: "Quality focus",
                    value: "Clean UI systems",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <item.icon className="text-accent" size={22} />
                    <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-primary/70 p-6 md:p-8 shadow-2xl shadow-black/20">
                <p className="text-sm uppercase tracking-[0.35em] text-accent font-semibold">
                  What I do
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2 text-slate-300 leading-7">
                  <p>
                    I turn ideas into responsive interfaces, connecting frontend
                    polish with reliable backend logic and deployment workflows.
                  </p>
                  <p>
                    When I’m not building, I’m learning better ways to improve
                    user experience, performance, and maintainable code
                    structure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default About;
