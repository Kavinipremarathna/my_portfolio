import React from "react";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

const services = [
  "Portfolio Websites",
  "Frontend Development",
  "Full-Stack Apps",
  "API Integration",
  "UI/UX Improvements",
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.1),transparent_35%),radial-gradient(circle_at_top_left,rgba(30,41,59,0.45),transparent_30%)]" />

      <div className="container mx-auto px-6 py-16 relative">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-black text-accent tracking-wide"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-sm font-bold">
                K
              </span>
              Kavini.dev
            </a>
            <p className="mt-5 text-slate-300 leading-7 max-w-sm">
              Building modern, polished web experiences with performance,
              clarity, and clean visual systems.
            </p>
            <div className="mt-6 flex items-center gap-3 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent/40 hover:text-accent hover:-translate-y-0.5"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent/40 hover:text-accent hover:-translate-y-0.5"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:kavinipremarathna@gmail.com"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent/40 hover:text-accent hover:-translate-y-0.5"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.35em] text-accent font-semibold">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-300 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.35em] text-accent font-semibold">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {services.map((item) => (
                <li key={item} className="text-slate-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.35em] text-accent font-semibold">
              Contact
            </h3>
            <div className="mt-5 space-y-4 text-slate-300">
              <a
                href="mailto:kavinipremarathna@gmail.com"
                className="flex items-center gap-3 transition-colors hover:text-accent"
              >
                <Mail size={16} className="text-accent" />
                kavinipremarathna@gmail.com
              </a>
              <a
                href="tel:+94771234567"
                className="flex items-center gap-3 transition-colors hover:text-accent"
              >
                <Phone size={16} className="text-accent" />
                +94719075060
              </a>
              <p className="flex items-center gap-3">
                <MapPin size={16} className="text-accent" />
                Panadura, Sri Lanka
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col items-center text-center gap-3 text-sm text-slate-400">
          <p>© {year} Kavini Premarathna. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
