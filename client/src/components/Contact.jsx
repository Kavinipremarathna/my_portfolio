import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-primary">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
                    <div className="w-20 h-1 bg-accent mx-auto rounded"></div>
                </div>

                <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:w-1/2"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Let's Talk</h3>
                        <p className="text-slate-400 mb-8">
                            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Email</h4>
                                    <p>kavini@example.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Phone</h4>
                                    <p>+94 77 123 4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Location</h4>
                                    <p>Colombo, Sri Lanka</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:w-1/2 bg-secondary p-8 rounded-xl border border-slate-700"
                    >
                        <form className="space-y-6">
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Name</label>
                                <input type="text" className="input-field" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Email</label>
                                <input type="email" className="input-field" placeholder="Your Email" />
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Message</label>
                                <textarea className="input-field h-32 resize-none" placeholder="Your Message"></textarea>
                            </div>
                            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
