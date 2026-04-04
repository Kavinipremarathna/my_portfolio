import React, { useState, useEffect } from "react";
import { Menu, X, Code, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isAboutPage = pathname === "/about";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = isAboutPage
    ? [
        { name: "Home", href: "/" },
        { name: "Projects", href: "/#projects" },
        { name: "Contact", href: "/#contact" },
      ]
    : [
        { name: "Home", href: "/#home" },
        { name: "About", href: "/about" },
        { name: "Skills", href: "/#skills" },
        { name: "Projects", href: "/#projects" },
        { name: "Experience", href: "/#experience" },
        { name: "Contact", href: "/#contact" },
      ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-primary/95 shadow-lg backdrop-blur-sm" : "bg-transparent"}`}
    >
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
              className="text-text hover:text-accent transition-colors font-medium tracking-wide"
            >
              {link.name}
            </a>
          ))}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary border-t border-slate-700 absolute w-full shadow-2xl">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-text hover:text-accent transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
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
