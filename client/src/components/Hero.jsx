import React, { useEffect, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import axios from "axios";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowDown,
  FiArrowRight,
  FiDownload,
  FiCode,
} from "react-icons/fi";
import { Sparkles } from "lucide-react";

import profileImg from "../assets/profile.jpg";
import { API_URL } from "../config/api";

const defaultHeroConfig = {
  badgeText: "Portfolio / Full-Stack Developer",
  greeting: "Hello, I am",
  firstName: "Kavini",
  lastName: "Premarathna",
  roles: [
    "Software Engineer",
    "Cybersecurity Enthusiast",
    "Full-Stack Developer",
  ],
  bio: "Building secure and scalable digital experiences with elegant UI, smooth motion, and production-ready engineering.",
  primaryCtaText: "View Projects",
  primaryCtaHref: "#projects",
  secondaryCtaText: "Contact Me",
  secondaryCtaHref: "#contact",
  resumeButtonText: "Download Resume",
  resumeUrl: "/resume.pdf",
  availabilityText: "Freelance / Internship",
  stats: {
    focus: "Full-Stack",
    stack: "React + Node",
    style: "Clean & Modern",
  },
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:email@example.com",
  },
  profileImageUrl: "",
};

const Hero = () => {
  const reduceMotion = useReducedMotion();
  const [heroConfig, setHeroConfig] = useState(defaultHeroConfig);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [deleting, setDeleting] = useState(false);

  const roles =
    Array.isArray(heroConfig.roles) && heroConfig.roles.length > 0
      ? heroConfig.roles
      : defaultHeroConfig.roles;

  useEffect(() => {
    const loadHeroConfig = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/hero`);
        if (response.data && typeof response.data === "object") {
          setHeroConfig((prev) => ({
            ...prev,
            ...response.data,
            stats: {
              ...prev.stats,
              ...(response.data.stats || {}),
            },
            social: {
              ...prev.social,
              ...(response.data.social || {}),
            },
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    void loadHeroConfig();
  }, []);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const speed = deleting ? 42 : 78;

    const timer = setTimeout(
      () => {
        if (!deleting && typedRole.length < currentRole.length) {
          setTypedRole(currentRole.slice(0, typedRole.length + 1));
          return;
        }

        if (!deleting && typedRole.length === currentRole.length) {
          setDeleting(true);
          return;
        }

        if (deleting && typedRole.length > 0) {
          setTypedRole(currentRole.slice(0, typedRole.length - 1));
          return;
        }

        setDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      },
      typedRole.length === roles[roleIndex].length && !deleting ? 1200 : speed,
    );

    return () => clearTimeout(timer);
  }, [typedRole, deleting, roleIndex, roles]);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-24 pb-16 relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),transparent_35%),linear-gradient(180deg,#060b13_0%,#0a1220_55%,#0f172a_100%)]"
    >
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:54px_54px]" />

      <Motion.div
        className="absolute top-24 right-4 md:right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, -16, 0], x: [0, 10, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <Motion.div
        className="absolute bottom-16 left-0 md:left-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, 18, 0], x: [0, -12, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 9, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <Motion.div
        className="absolute top-1/3 left-1/4 w-52 h-52 rounded-full bg-indigo-400/10 blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, 20, 0], x: [0, -12, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-5 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14 lg:px-8 z-10">
        <Motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl lg:mx-0"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
            <Sparkles size={14} className="text-accent" />
            {heroConfig.badgeText}
          </div>
          <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.45em] text-accent/80">
            {heroConfig.greeting}
          </h2>
          <h1 className="mt-4 text-[2.8rem] font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
            {heroConfig.firstName}
            <br />
            {heroConfig.lastName}
          </h1>

          <div className="mt-4 h-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4">
            <FiCode className="text-accent" />
            <p className="text-base md:text-lg font-medium text-slate-100">
              {typedRole}
              <span className="ml-1 text-accent">|</span>
            </p>
          </div>

          <p className="mt-6 max-w-[37rem] text-lg leading-8 text-slate-300 md:text-xl">
            {heroConfig.bio}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-start">
            <Motion.a
              href={heroConfig.primaryCtaHref || "#projects"}
              whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-primary shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5"
            >
              {heroConfig.primaryCtaText} <FiArrowRight size={16} />
            </Motion.a>
            <Motion.a
              href={heroConfig.resumeUrl || "/resume.pdf"}
              download="Kavini-Premarathna-Resume.pdf"
              whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-6 py-3 font-semibold text-accent transition-colors hover:bg-accent/20"
            >
              {heroConfig.resumeButtonText || "Download Resume"}{" "}
              <FiDownload size={16} />
            </Motion.a>
            <Motion.a
              href={heroConfig.secondaryCtaHref || "#contact"}
              whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:border-accent/40 hover:bg-white/10"
            >
              {heroConfig.secondaryCtaText}
            </Motion.a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Focus", value: heroConfig.stats?.focus },
              { label: "Stack", value: heroConfig.stats?.stack },
              { label: "Style", value: heroConfig.stats?.style },
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
            <Motion.a
              href={heroConfig.social?.github || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduceMotion ? {} : { y: -4, scale: 1.08 }}
              className="hover:text-white transition-colors"
            >
              <FiGithub size={24} />
            </Motion.a>
            <Motion.a
              href={heroConfig.social?.linkedin || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduceMotion ? {} : { y: -4, scale: 1.08 }}
              className="hover:text-white transition-colors"
            >
              <FiLinkedin size={24} />
            </Motion.a>
            <Motion.a
              href={heroConfig.social?.email || "mailto:email@example.com"}
              whileHover={reduceMotion ? {} : { y: -4, scale: 1.08 }}
              className="hover:text-white transition-colors"
            >
              <FiMail size={24} />
            </Motion.a>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-center xl:justify-end"
        >
          <Motion.div
            className="relative h-[330px] w-[260px] sm:h-[410px] sm:w-[320px] lg:h-[460px] lg:w-[360px] xl:h-[500px] xl:w-[390px]"
            whileHover={reduceMotion ? {} : { rotate: -2, scale: 1.02 }}
          >
            <Motion.div
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
                src={heroConfig.profileImageUrl || profileImg}
                alt="Kavini Premarathna"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute z-30 bottom-2 left-2 md:-bottom-6 md:-left-4 rounded-2xl border border-white/10 bg-primary/95 px-4 py-3 shadow-2xl backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                Available For
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {heroConfig.availabilityText}
              </p>
            </div>
          </Motion.div>
        </Motion.div>
      </div>

      <Motion.div
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
        <FiArrowDown size={24} />
      </Motion.div>
    </section>
  );
};

export default Hero;
