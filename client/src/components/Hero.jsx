import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';

import profileImg from '../assets/profile.jpg';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden bg-gradient-to-b from-primary to-secondary">
            {/* Background Elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 z-10 text-center md:text-left md:flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="md:w-1/2"
                >
                    <h2 className="text-xl md:text-2xl text-accent font-semibold mb-4">Hello, I'm</h2>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Kavini <br /> Premarathna
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl mb-8 max-w-lg">
                        Software Engineering Undergraduate passionate about building scalable web applications and intuitive user experiences.
                    </p>

                    <div className="flex gap-4 justify-center md:justify-start mb-10">
                        <a href="#contact" className="btn-primary">
                            Contact Me
                        </a>
                        <a href="#projects" className="px-6 py-3 border border-slate-600 text-white rounded-lg hover:border-accent hover:text-accent transition-all">
                            View Work
                        </a>
                    </div>

                    <div className="flex gap-6 justify-center md:justify-start text-slate-400">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Github size={24} /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin size={24} /></a>
                        <a href="mailto:email@example.com" className="hover:text-white transition-colors"><Mail size={24} /></a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="md:w-1/2 mt-12 md:mt-0 flex justify-center"
                >
                    {/* Placeholder for Profile Image */}
                    <div className="relative w-64 h-64 md:w-96 md:h-96">
                        <div className="absolute inset-0 bg-accent rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute inset-4 bg-gradient-to-tr from-accent to-purple-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-secondary shadow-2xl">
                            {/* Replace with actual image later */}
                            <img
                                src={profileImg}
                                alt="Kavini Premarathna"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-500"
            >
                <ArrowDown size={24} />
            </motion.div>
        </section>
    );
};

export default Hero;
