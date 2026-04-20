import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <Motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
          >
            <div className="flex flex-col items-center gap-6">
              <Motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                className="h-16 w-16 rounded-full border-2 border-accent/30 border-t-accent"
              />
              <p className="text-xs uppercase tracking-[0.45em] text-slate-300">
                Loading Portfolio
              </p>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: loading ? 0 : 1, y: loading ? 12 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="overflow-x-hidden"
      >
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </Motion.div>
    </>
  );
};

export default Home;
