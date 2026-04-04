import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ArrowDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import profileImg from "../assets/profile.jpg";

const Hero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-24 pb-16 relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_34%),linear-gradient(180deg,#08111f_0%,#0f172a_52%,#111827_100%)]"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute top-24 right-4 md:right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, -16, 0], x: [0, 10, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="absolute bottom-16 left-0 md:left-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, 18, 0], x: [0, -12, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 9, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div className="container mx-auto px-6 z-10 grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
            <Sparkles size={14} className="text-accent" />
            Portfolio / Full-Stack Developer
          </div>
          <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.45em] text-accent/80">
            Hello, I am
          </h2>
          <h1 className="mt-4 text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight">
            Kavini
            <br />
            Premarathna
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate-300 leading-8">
            I build calm, fast, and polished web experiences for people who care
            about performance, clarity, and a premium visual identity.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-start">
            <motion.a
              href="#contact"
              whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-primary shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5"
            >
              Contact Me <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="#projects"
              whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:border-accent/40 hover:bg-white/10"
            >
              View Work
            </motion.a>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            {[
              { label: "Focus", value: "Full-Stack" },
              { label: "Stack", value: "React + Node" },
              { label: "Style", value: "Clean & Modern" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-6 justify-start text-slate-400">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduceMotion ? {} : { y: -4, scale: 1.08 }}
              className="hover:text-white transition-colors"
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduceMotion ? {} : { y: -4, scale: 1.08 }}
              className="hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a
              href="mailto:email@example.com"
              whileHover={reduceMotion ? {} : { y: -4, scale: 1.08 }}
              className="hover:text-white transition-colors"
            >
              <Mail size={24} />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center md:justify-end"
        >
          <motion.div
            className="relative w-[280px] h-[360px] md:w-[360px] md:h-[460px]"
            whileHover={reduceMotion ? {} : { rotate: -2, scale: 1.02 }}
          >
            <motion.div
              className="absolute -inset-6 rounded-[2rem] border border-white/10 bg-white/5 blur-[2px]"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.03, 1], opacity: [0.5, 0.7, 0.5] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
              <img
                src={profileImg}
                alt="Kavini Premarathna"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-white/10 bg-primary/90 px-4 py-3 shadow-xl backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                Available For
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Freelance / Internship
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 1,
          repeat: reduceMotion ? 0 : Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-500"
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;
