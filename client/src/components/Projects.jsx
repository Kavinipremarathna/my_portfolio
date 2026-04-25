import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import { API_URL } from "../config/api";

const fallbackProjects = [
  {
    _id: "46a91db7-be9e-462d-a1e8-d3d42b263112",
    title: "TrustLayer AI – File & URL Threat Detection System",
    description:
      "Developed a containerized security analysis system that evaluates files and URLs to detect potential threats using heuristic-based risk scoring. The platform analyzes file signatures, identifies suspicious patterns, and inspects URLs for phishing indicators, providing real-time risk classification with actionable insights through an interactive web interface.",
    tags: [
      "FastAPI",
      "Python",
      "Docker",
      "HTML",
      "CSS",
      "JavaScript",
      "File Signature Analysis",
      "URL Parsing",
    ],
    imageUrl:
      "https://www.image2url.com/r2/default/images/1776677286247-377582fe-cfef-4c09-b6b6-8862c18e2149.jpg",
    liveLink: "",
    repoLink: "https://github.com/Kavinipremarathna/trustlayer-ai.git",
    featured: true,
    createdAt: "2026-04-20T09:34:03.500Z",
  },
  {
    _id: "72f60cf5-c262-4b5d-a682-a828fe5bd3ec",
    title: "Album Management System",
    description:
      "Album Management System is a full-stack web application designed to provide a seamless platform for browsing and managing music albums. The system features a modern, responsive user interface for end users and a secure admin dashboard for content management.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "JWT",
      "Cloudinary",
    ],
    imageUrl:
      "https://www.image2url.com/r2/default/images/1776677086493-7bd312d2-d461-411f-b22b-f9213f3d0463.png",
    liveLink: "https://photography-dun-delta.vercel.app/",
    repoLink: "https://github.com/Kavinipremarathna/Photography.git",
    featured: true,
    createdAt: "2026-04-20T09:30:28.983Z",
  },
  {
    _id: "55957331-776f-4703-afc2-7a3ee1d3cdce",
    title: "Real-Time Crypto Forecasting App",
    description:
      "Developed and deployed an interactive time-series forecasting web application that predicts cryptocurrency prices using historical market data. The system enables users to dynamically select assets and adjust forecasting parameters, providing real-time visualization of actual versus predicted trends.",
    tags: ["Python", "Streamlit", "Scikit-learn", "Pandas", "yFinance"],
    imageUrl:
      "https://www.image2url.com/r2/default/images/1776675595480-72607b43-ace2-430a-a241-9b59a2d3095d.png",
    liveLink: "https://cryptoforecast-app.streamlit.app/",
    repoLink: "https://github.com/Kavinipremarathna/CryptoForecast-App.git",
    featured: true,
    createdAt: "2026-04-20T09:02:18.110Z",
  },
  {
    _id: "e2efc48b-7392-4232-9a8e-3eeeb73e12cf",
    title: "ScanMe – AI-Based Body Posture Analysis System",
    description:
      "Developed a web-based AI-powered posture analysis system that detects body alignment issues using full-body images. Integrated MediaPipe Pose and OpenCV to extract 33 skeletal landmarks and compute joint angles for identifying posture deviations.",
    tags: ["Laravel", "PHP", "Python", "MediaPipe", "OpenCV", "Bootstrap"],
    imageUrl:
      "https://www.image2url.com/r2/default/images/1776674828864-029c3f20-c89e-4c80-82ed-5c36b8b967fc.png",
    liveLink: "",
    repoLink:
      "https://github.com/AI-full-body-Image-analysis/AI-full-body-image-analysis",
    featured: true,
    createdAt: "2026-04-20T08:47:35.951Z",
  },
  {
    _id: "a7e832cc-db3c-4eea-ae44-d2a427219597",
    title: "Planova",
    description:
      "Planova is a modern web-based event management platform created to transform the way people organize weddings, birthdays, and engagements. The system combines event creation, theme customization, budget tracking, vendor package browsing, and secure online payments into a seamless experience.",
    tags: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Stripe API",
      "Tailwind CSS",
      "Figma",
      "Postman",
      "Git/GitHub",
    ],
    imageUrl:
      "https://mir-s3-cdn-cf.behance.net/projects/404/ef4fb2200784279.66686f8b5be30.jpg",
    liveLink:
      "https://www.linkedin.com/posts/kavini-premarathna_webdevelopment-reactjs-nodejs-activity-7369738007467233280-Ht-K?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEUuUucBgAieWhM6s-XjrZwS_dXN60YHdAc",
    repoLink: "",
    featured: true,
    createdAt: "2026-03-13T16:41:08.098Z",
  },
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Adjust URL based on your env
        const res = await axios.get(`${API_URL}/api/projects`);
        setProjects(
          Array.isArray(res.data) && res.data.length > 0
            ? res.data
            : fallbackProjects,
        );
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      className="py-24 bg-secondary relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_35%)]" />
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold mb-4">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-slate-300 text-lg leading-8">
            Selected work focused on practical solutions, clean architecture,
            and polished interfaces.
          </p>
        </div>

        {loading ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-primary/40 py-8 text-center text-accent">
            Loading projects...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <Motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-primary/65 backdrop-blur-lg shadow-xl shadow-black/20"
                >
                  <div className="pointer-events-none absolute -inset-px rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(120deg,rgba(56,189,248,0.45),rgba(59,130,246,0.12),transparent_65%)]" />

                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={
                        project.imageUrl ||
                        "https://via.placeholder.com/400x200"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                    <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/35 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white">
                      <FiArrowUpRight />
                    </div>
                    <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.repoLink && (
                        <a
                          href={project.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent hover:text-primary"
                        >
                          <FiGithub size={18} /> GitHub
                        </a>
                      )}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent hover:text-primary"
                        >
                          <FiExternalLink size={18} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="relative p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-slate-300 text-sm mb-5 leading-7 min-h-[4.8rem]">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(project.tags || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-slate-200 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center text-slate-500">
                No projects found. Admin needs to add some!
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
