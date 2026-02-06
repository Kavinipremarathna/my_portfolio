import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Github, ExternalLink, Folder } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Adjust URL based on your env
                const res = await axios.get('http://localhost:5000/api/projects');
                setProjects(res.data);
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <section id="projects" className="py-20 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
                    <div className="w-20 h-1 bg-accent mx-auto rounded"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center text-accent">Loading projects...</div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <motion.div
                                    key={project._id}
                                    variants={itemVariants}
                                    className="bg-primary rounded-xl overflow-hidden border border-slate-700 hover:border-accent transition-all duration-300 group"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={project.imageUrl || 'https://via.placeholder.com/400x200'}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                            {project.repoLink && (
                                                <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-accent hover:text-primary transition-colors">
                                                    <Github size={20} />
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-accent hover:text-primary transition-colors">
                                                    <ExternalLink size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{project.title}</h3>
                                            <Folder className="text-accent" size={20} />
                                        </div>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {project.tags.map((tag, idx) => (
                                                <span key={idx} className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">
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
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Projects;
