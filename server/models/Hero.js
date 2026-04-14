const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema({
  badgeText: { type: String, default: "Portfolio / Full-Stack Developer" },
  greeting: { type: String, default: "Hello, I am" },
  firstName: { type: String, default: "Kavini" },
  lastName: { type: String, default: "Premarathna" },
  roles: [{ type: String }],
  bio: { type: String, default: "" },
  primaryCtaText: { type: String, default: "View Projects" },
  primaryCtaHref: { type: String, default: "#projects" },
  secondaryCtaText: { type: String, default: "Contact Me" },
  secondaryCtaHref: { type: String, default: "#contact" },
  resumeButtonText: { type: String, default: "Download Resume" },
  resumeUrl: { type: String, default: "/resume.pdf" },
  availabilityText: { type: String, default: "Freelance / Internship" },
  stats: {
    focus: { type: String, default: "Full-Stack" },
    stack: { type: String, default: "React + Node" },
    style: { type: String, default: "Clean & Modern" },
  },
  social: {
    github: { type: String, default: "https://github.com" },
    linkedin: { type: String, default: "https://linkedin.com" },
    email: { type: String, default: "mailto:email@example.com" },
  },
  profileImageUrl: { type: String, default: "" },
});

module.exports = mongoose.model("Hero", HeroSchema);
