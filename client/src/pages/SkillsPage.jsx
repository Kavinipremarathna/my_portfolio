import React from "react";
import Navbar from "../components/Navbar";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

const SkillsPage = () => {
  return (
    <div className="min-h-screen bg-primary text-text">
      <Navbar />
      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.94))]">
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="container mx-auto px-6 py-20 relative max-w-6xl">
            <p className="text-xs uppercase tracking-[0.45em] text-accent font-semibold">
              Skills
            </p>
            <h1 className="mt-5 text-5xl md:text-7xl font-black leading-[0.95] text-white max-w-4xl">
              Skills Matrix
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-8 text-slate-300">
              A focused view of the technologies I work with, organized into
              separate sections for easier browsing.
            </p>
          </div>
        </section>

        <Skills />
      </main>
      <Footer />
    </div>
  );
};

export default SkillsPage;
