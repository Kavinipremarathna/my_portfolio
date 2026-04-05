import React, { useState, useEffect } from "react";
import { Menu, X, Code, ArrowRight, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState("dark");
  const { pathname } = useLocation();
  const isAboutPage = pathname === "/about";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const nextTheme = savedTheme === "light" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 24);

      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const progress = scrollHeight > 0 ? (offset / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("light", nextTheme === "light");
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  const navLinks = isAboutPage
    ? [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Gallery", href: "/gallery" },
        { name: "Skills", href: "/skills" },
        { name: "Projects", href: "/projects" },
        { name: "Experience", href: "/experience" },
        { name: "Contact", href: "/contact" },
        { name: "Blogs", href: "/blog" },
        {
          name: "Medium",
          href: "https://medium.com/@kavinipremarathna",
          external: true,
        },
      ]
    : [
        { name: "Home", href: "/#home" },
        { name: "About", href: "/about" },
        { name: "Gallery", href: "/gallery" },
        { name: "Skills", href: "/skills" },
        { name: "Projects", href: "/projects" },
        { name: "Experience", href: "/experience" },
        { name: "Contact", href: "/contact" },
        { name: "Blogs", href: "/blog" },
        {
          name: "Medium",
          href: "https://medium.com/@kavinipremarathna",
          external: true,
        },
      ];

  return (
    <nav className="fixed w-full z-50">
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-cyan-300 via-accent to-indigo-400"
        style={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.2 }}
      />

      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-accent tracking-wide"
        >
          <Code size={32} />
          <span>Kavini.dev</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              download={
                link.download ? "Kavini-Premarathna-Resume.pdf" : undefined
              }
              className="text-text hover:text-accent transition-colors font-medium tracking-wide"
            >
              {link.name}
            </a>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-all hover:border-accent/40 hover:text-accent"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!isAboutPage && (
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
            >
              View About <ArrowRight size={16} />
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text hover:text-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`mx-auto h-[1px] w-[min(1120px,calc(100%-3rem))] transition-opacity ${scrolled ? "opacity-100" : "opacity-0"}`}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div
        className={`absolute inset-x-0 -z-10 transition-all duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`}
      >
        <div className="h-full bg-primary/85 backdrop-blur-xl" />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary/95 backdrop-blur-xl border-t border-white/10 absolute w-full shadow-2xl">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                download={
                  link.download ? "Kavini-Premarathna-Resume.pdf" : undefined
                }
                className="text-text hover:text-accent transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            {!isAboutPage && (
              <a
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                onClick={() => setIsOpen(false)}
              >
                View About <ArrowRight size={16} />
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
