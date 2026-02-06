import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';

const Experience = () => {
    const educationData = [
        {
            year: "2022 - Present",
            title: "BSc (Hons) in Software Engineering",
            institution: "University Name (e.g., SLIIT, IIT)",
            description: "Currently pursuing undergraduate degree. Focusing on Full Stack Development, Data Structures, and Algorithms."
        },
        {
            year: "2020 - 2022",
            title: "G.C.E Advanced Level",
            institution: "School Name",
            description: "Physical Science Stream. Achieved high distinction."
        }
    ];

    const experienceData = [
        {
            year: "2024",
            title: "Full Stack Developer Intern",
            company: "Tech Company Name",
            description: "Assisted in building RESTful APIs using Node.js and Express. Developed responsive frontend UI with React."
        },
        {
            year: "2023",
            title: "Freelance Web Developer",
            company: "Self-Employed",
            description: "Developed custom websites for small businesses using HTML, CSS, and JavaScript. Delivered high-quality, responsive designs."
        }
    ];

    return (
        <section id="experience" className="py-20 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience & Education</h2>
                    <div className="w-20 h-1 bg-accent mx-auto rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Education Column */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <GraduationCap className="text-accent" size={32} />
                            <h3 className="text-2xl font-bold text-white">Education</h3>
                        </div>
                        <div className="space-y-8 border-l-2 border-slate-700 ml-3 pl-8 relative">
                            {educationData.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 bg-accent rounded-full border-4 border-secondary"></span>
                                    <span className="text-accent font-medium text-sm">{item.year}</span>
                                    <h4 className="text-xl font-bold text-white mt-1">{item.title}</h4>
                                    <p className="text-slate-400 text-sm mb-2">{item.institution}</p>
                                    <p className="text-slate-500">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Experience Column */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <Briefcase className="text-accent" size={32} />
                            <h3 className="text-2xl font-bold text-white">Experience</h3>
                        </div>
                        <div className="space-y-8 border-l-2 border-slate-700 ml-3 pl-8 relative">
                            {experienceData.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 bg-accent rounded-full border-4 border-secondary"></span>
                                    <span className="text-accent font-medium text-sm">{item.year}</span>
                                    <h4 className="text-xl font-bold text-white mt-1">{item.title}</h4>
                                    <p className="text-slate-400 text-sm mb-2">{item.company}</p>
                                    <p className="text-slate-500">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
