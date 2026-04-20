import fs from "node:fs";
import jwt from "jsonwebtoken";
import { resolveJsonFilePath } from "./storage.js";

const defaultHeroConfig = {
  badgeText: "Portfolio / Full-Stack Developer",
  greeting: "Hello, I am",
  firstName: "Kavini",
  lastName: "Premarathna",
  roles: [
    "Software Engineer",
    "Cybersecurity Enthusiast",
    "Full-Stack Developer",
  ],
  bio: "Building secure and scalable digital experiences with elegant UI, smooth motion, and production-ready engineering.",
  primaryCtaText: "View Projects",
  primaryCtaHref: "#projects",
  secondaryCtaText: "Contact Me",
  secondaryCtaHref: "#contact",
  resumeButtonText: "Download Resume",
  resumeUrl: "/resume.pdf",
  availabilityText: "Freelance / Internship",
  stats: {
    focus: "Full-Stack",
    stack: "React + Node",
    style: "Clean & Modern",
  },
  social: {
    github: "https://github.com/Kavinipremarathna",
    linkedin: "https://www.linkedin.com/in/kavini-premarathna",
    email: "mailto:kavinipremarathna@gmail.com",
  },
  profileImageUrl: "",
};

const resolveHeroFile = () => {
  return resolveJsonFilePath("hero.json");
};

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-auth-token",
  );
};

const normalizeHero = (hero) => {
  const next = hero && typeof hero === "object" ? hero : {};
  return {
    ...defaultHeroConfig,
    ...next,
    roles: Array.isArray(next.roles)
      ? next.roles.filter(Boolean)
      : defaultHeroConfig.roles,
    stats: {
      ...defaultHeroConfig.stats,
      ...(next.stats && typeof next.stats === "object" ? next.stats : {}),
    },
    social: {
      ...defaultHeroConfig.social,
      ...(next.social && typeof next.social === "object" ? next.social : {}),
    },
  };
};

const readHero = () => {
  try {
    const heroFile = resolveHeroFile();
    if (!fs.existsSync(heroFile)) {
      return defaultHeroConfig;
    }

    const raw = fs.readFileSync(heroFile, "utf8");
    const parsed = JSON.parse(raw || "{}");
    return normalizeHero(parsed);
  } catch {
    return defaultHeroConfig;
  }
};

const writeHero = (heroConfig) => {
  const heroFile = resolveHeroFile();
  fs.writeFileSync(heroFile, JSON.stringify(heroConfig, null, 2));
};

const requireAuth = (req, res) => {
  const token =
    req.headers["x-auth-token"] ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "portfolio-dev-secret");
    return true;
  } catch {
    res.status(401).json({ msg: "Token is not valid" });
    return false;
  }
};

export default function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json(readHero());
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;

    const updates = req.body || {};
    const merged = normalizeHero({ ...readHero(), ...updates });

    try {
      writeHero(merged);
      return res.status(200).json(merged);
    } catch {
      return res.status(500).json({
        msg: "Unable to save hero settings in this deployment environment",
      });
    }
  }

  return res.status(405).json({ msg: "Method Not Allowed" });
}
