import fs from "node:fs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { resolveJsonFilePath } from "./storage.js";

const fallbackExperiences = [
  {
    _id: "experience-1",
    section: "education",
    year: "2022 - Present",
    title: "BSc (Hons) in Software Engineering",
    organization: "University Name (e.g., SLIIT, IIT)",
    description:
      "Currently pursuing undergraduate degree. Focusing on Full Stack Development, Data Structures, and Algorithms.",
    createdAt: "2026-04-10T00:00:00.000Z",
  },
  {
    _id: "experience-2",
    section: "education",
    year: "2020 - 2022",
    title: "G.C.E Advanced Level",
    organization: "School Name",
    description: "Physical Science Stream. Achieved high distinction.",
    createdAt: "2026-04-10T00:00:01.000Z",
  },
  {
    _id: "experience-3",
    section: "experience",
    year: "2024",
    title: "Full Stack Developer Intern",
    organization: "Tech Company Name",
    description:
      "Assisted in building RESTful APIs using Node.js and Express. Developed responsive frontend UI with React.",
    createdAt: "2026-04-10T00:00:02.000Z",
  },
  {
    _id: "experience-4",
    section: "experience",
    year: "2023",
    title: "Freelance Web Developer",
    organization: "Self-Employed",
    description:
      "Developed custom websites for small businesses using HTML, CSS, and JavaScript. Delivered high-quality, responsive designs.",
    createdAt: "2026-04-10T00:00:03.000Z",
  },
];

const resolveExperienceFile = () => resolveJsonFilePath("experiences.json");

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,PUT,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-auth-token",
  );
};

const normalizeRoute = (req) => {
  const route = req.query?.route;
  if (Array.isArray(route)) {
    return String(route[0] || "").trim();
  }

  return String(route || "").trim();
};

const normalizeExperience = (experience) => ({
  _id: experience._id || crypto.randomUUID(),
  section: experience.section === "education" ? "education" : "experience",
  year: String(experience.year || "").trim(),
  title: String(experience.title || "").trim(),
  organization: String(experience.organization || "").trim(),
  description: String(experience.description || "").trim(),
  createdAt: experience.createdAt || new Date().toISOString(),
});

const readExperiences = () => {
  try {
    const filePath = resolveExperienceFile();
    if (!fs.existsSync(filePath)) {
      return fallbackExperiences;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallbackExperiences;
    }

    return parsed.map(normalizeExperience).sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
    );
  } catch {
    return fallbackExperiences;
  }
};

const writeExperiences = (experiences) => {
  const filePath = resolveExperienceFile();
  fs.writeFileSync(filePath, JSON.stringify(experiences, null, 2));
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

  const route = normalizeRoute(req);
  const id = route || req.query?.id || "";

  if (req.method === "GET" && !id) {
    return res.status(200).json(readExperiences());
  }

  if (req.method === "GET" && id) {
    const experience = readExperiences().find(
      (item) => String(item._id) === String(id),
    );
    if (!experience) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    return res.status(200).json(experience);
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;

    const { section, year, title, organization, description } = req.body || {};
    if (!year || !title || !organization || !description) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const newExperience = normalizeExperience({
      section,
      year,
      title,
      organization,
      description,
    });

    try {
      const experiences = readExperiences();
      experiences.unshift(newExperience);
      writeExperiences(experiences);
      return res.status(200).json(newExperience);
    } catch {
      return res.status(500).json({
        msg: "Unable to save experience in this deployment environment",
      });
    }
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Experience id is required" });

    const updates = req.body || {};
    const experiences = readExperiences();
    const index = experiences.findIndex((item) => String(item._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    const updated = normalizeExperience({
      ...experiences[index],
      ...updates,
      _id: experiences[index]._id,
      createdAt: experiences[index].createdAt,
    });

    try {
      experiences[index] = updated;
      writeExperiences(experiences);
      return res.status(200).json(updated);
    } catch {
      return res.status(500).json({
        msg: "Unable to save experience in this deployment environment",
      });
    }
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Experience id is required" });

    const experiences = readExperiences();
    const filtered = experiences.filter((item) => String(item._id) !== String(id));
    if (filtered.length === experiences.length) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    try {
      writeExperiences(filtered);
      return res.status(200).json({ msg: "Experience removed" });
    } catch {
      return res.status(500).json({
        msg: "Unable to save experience in this deployment environment",
      });
    }
  }

  return res.status(405).json({ msg: "Method Not Allowed" });
}