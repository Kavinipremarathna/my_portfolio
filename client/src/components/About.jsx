import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="py-20 bg-secondary">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center md:text-left"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Me</h2>
                        <div className="w-20 h-1 bg-accent mx-auto rounded"></div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 text-slate-300 text-lg leading-relaxed">
                            <p className="mb-6">
                                I am currently pursuing a degree in Software Engineering. My journey began with a curiosity for how things work on the web, which has evolved into a passion for building robust, user-centric applications.
                            </p>
                            <p className="mb-6">
                                I have hands-on experience with modern web technologies including the MERN stack (MongoDB, Express, React, Node.js). I love solving complex problems and turning ideas into reality through clean code and efficient design.
                            </p>
                            <p>
                                When I'm not coding, you can find me exploring new tech trends, contributing to open-source, or gaming.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-accent font-bold text-xl">0+</h4>
                                    <span className="text-sm text-slate-400">Years Experience</span>
                                </div>
                                <div>
                                    <h4 className="text-accent font-bold text-xl">5+</h4>
                                    <span className="text-sm text-slate-400">Projects Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
