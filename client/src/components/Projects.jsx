import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import { API_URL } from "../config/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Adjust URL based on your env
        const res = await axios.get(`${API_URL}/api/projects`);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
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
                <motion.div
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
                </motion.div>
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
