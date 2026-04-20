import React from "react";
import { motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight, Mail, MapPin, Github, Linkedin } from "lucide-react";

const timeline = [
  {
    year: "2024 - Present",
    title: "Software Engineering Undergraduate",
    company: "Sabaragamuwa University of Sri Lanka",
    description:
      "Studying software engineering with a focus on full-stack development, scalable design, and problem solving.",
  },
  {
    year: "Current",
    title: "Portfolio Builder",
    company: "Independent Projects",
    description:
      "Designing and shipping responsive interfaces, project dashboards, and admin workflows for real-world use cases.",
  },
  {
    year: "Always",
    title: "Continuous Learning",
    company: "Web + UI Systems",
    description:
      "Improving in React, Node.js, deployment, and visual storytelling so the work feels clean and complete.",
  },
];

const expertise = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Tailwind CSS",
  "Framer Motion",
  "REST APIs",
  "JWT Auth",
  "Vercel Deployments",
  "Responsive UI",
  "UI Systems",
  "Git & GitHub",
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-primary text-text">
      <Navbar />

      <main className="pt-24">
        <section
          id="top"
          className="relative overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.94))]"
        >
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="container mx-auto px-6 py-20 relative">
            <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold">
                  About
                </p>
                <h1 className="mt-5 text-5xl md:text-7xl font-black leading-[0.95] text-white">
                  Kavini
                  <br />
                  Premarathna
                </h1>
                <p className="mt-6 max-w-2xl text-lg md:text-xl leading-8 text-slate-300">
                  Software engineering undergraduate building sharp, reliable,
                  and visually refined web applications.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="/#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-primary shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5"
                  >
                    Hire Me <ArrowRight size={16} />
                  </a>
                  <a
                    href="/#projects"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:border-accent/40 hover:bg-white/10"
                  >
                    View Projects
                  </a>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Focus", "Full-stack UI"],
                    ["Approach", "Clean systems"],
                    ["Style", "Premium dark UI"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                        {label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-sm shadow-2xl shadow-black/30"
              >
                <h2 className="text-2xl font-bold text-white">Quick profile</h2>
                <p className="mt-4 text-slate-300 leading-8">
                  I like building interfaces that feel deliberate. Every section
                  should have a purpose, every interaction should feel smooth,
                  and every screen should load with confidence.
                </p>

                <div className="mt-8 space-y-4 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-accent" />{" "}
                    kavinipremarathna@gmail.com
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-accent" /> Colombo, Sri
                    Lanka
                  </div>
                </div>

                <div className="mt-8 flex gap-4 text-slate-400">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    <Github size={22} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    <Linkedin size={22} />
                  </a>
                </div>
              </Motion.div>
            </div>
          </div>
        </section>

        <section
          id="about-details"
          className="py-24 bg-secondary/80 border-b border-white/5"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold">
                  About Me
                </p>
                <h2 className="mt-4 text-3xl md:text-4xl font-black text-white">
                  A calm, polished way to build on the web.
                </h2>
                <p className="mt-5 text-slate-300 leading-8">
                  I’m currently pursuing software engineering while building
                  practical apps that balance visuals, performance, and
                  reliability.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["3+", "Core stack areas"],
                  ["5+", "Portfolio projects"],
                  ["1", "Clear design direction"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-primary/70 p-6"
                  >
                    <p className="text-4xl font-black text-white">{value}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.35em] text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className="py-24 bg-primary">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold">
                  Journey
                </p>
                <h2 className="mt-4 text-3xl md:text-4xl font-black text-white">
                  Where I’ve been
                </h2>
              </div>
            </div>

            <div className="grid gap-5">
              {timeline.map((item, index) => (
                <Motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-[1.75rem] border border-white/10 bg-secondary/70 p-6 md:p-8"
                >
                  <p className="text-sm uppercase tracking-[0.35em] text-accent font-semibold">
                    {item.year}
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-[0.85fr_1.15fr] items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-slate-400">{item.company}</p>
                    </div>
                    <p className="text-slate-300 leading-8">
                      {item.description}
                    </p>
                  </div>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="expertise" className="py-24 bg-secondary/80">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold">
                Expertise
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-black text-white">
                Tools and skills I use daily
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {expertise.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-primary/70 px-4 py-2 text-sm text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 bg-primary">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.12),rgba(15,23,42,0.92))] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold">
                  Contact
                </p>
                <h2 className="mt-4 text-3xl md:text-4xl font-black text-white">
                  Let’s build something clean and memorable.
                </h2>
                <p className="mt-4 text-slate-300 max-w-2xl leading-8">
                  If you want a portfolio site, product interface, or full-stack
                  build that feels premium, I’m open to the right opportunity.
                </p>
              </div>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-primary shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5"
              >
                Start a project <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
