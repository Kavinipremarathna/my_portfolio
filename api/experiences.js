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
  order:
    Number.isFinite(Number(experience.order)) && Number(experience.order) > 0
      ? Number(experience.order)
      : 0,
  year: String(experience.year || "").trim(),
  title: String(experience.title || "").trim(),
  organization: String(experience.organization || "").trim(),
  description: String(experience.description || "").trim(),
  imageUrl: String(experience.imageUrl || "").trim(),
  createdAt: experience.createdAt || new Date().toISOString(),
});

const normalizeAndOrderExperiences = (experiences) => {
  const normalized = experiences.map(normalizeExperience);
  const sections = ["experience", "education"];

  sections.forEach((section) => {
    const sectionItems = normalized
      .filter((item) => item.section === section)
      .sort((left, right) => {
        const orderDiff = left.order - right.order;
        if (orderDiff !== 0) {
          return orderDiff;
        }

        return new Date(left.createdAt) - new Date(right.createdAt);
      });

    sectionItems.forEach((item, index) => {
      item.order = index + 1;
    });
  });

  return normalized;
};

const sortExperiences = (experiences) => {
  const sectionRank = {
    experience: 0,
    education: 1,
  };

  return [...experiences].sort((left, right) => {
    const sectionDiff =
      (sectionRank[left.section] ?? 99) - (sectionRank[right.section] ?? 99);
    if (sectionDiff !== 0) {
      return sectionDiff;
    }

    const orderDiff = left.order - right.order;
    if (orderDiff !== 0) {
      return orderDiff;
    }

    return new Date(right.createdAt) - new Date(left.createdAt);
  });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "16mb",
    },
  },
};

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

    return sortExperiences(normalizeAndOrderExperiences(parsed));
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

  if (req.method === "POST" && route === "reorder") {
    if (!requireAuth(req, res)) return;

    const reorderId = String(req.body?.id || "").trim();
    const direction = req.body?.direction === "up" ? "up" : "down";

    if (!reorderId) {
      return res.status(400).json({ msg: "Experience id is required" });
    }

    const experiences = normalizeAndOrderExperiences(readExperiences());
    const current = experiences.find(
      (item) => String(item._id) === String(reorderId),
    );

    if (!current) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    const sectionItems = experiences
      .filter((item) => item.section === current.section)
      .sort((left, right) => left.order - right.order);
    const currentIndex = sectionItems.findIndex(
      (item) => String(item._id) === String(reorderId),
    );
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < sectionItems.length) {
      const [moved] = sectionItems.splice(currentIndex, 1);
      sectionItems.splice(targetIndex, 0, moved);
      sectionItems.forEach((item, index) => {
        item.order = index + 1;
      });
    }

    const sorted = sortExperiences(experiences);

    try {
      writeExperiences(sorted);
      return res
        .status(200)
        .json(sorted.find((item) => String(item._id) === String(reorderId)));
    } catch {
      return res.status(500).json({
        msg: "Unable to save experience in this deployment environment",
      });
    }
  }

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

    const { section, year, title, organization, description, imageUrl } =
      req.body || {};
    if (!year || !title || !organization) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const existing = normalizeAndOrderExperiences(readExperiences());
    const normalizedSection =
      section === "education" ? "education" : "experience";
    const nextOrder =
      existing
        .filter((item) => item.section === normalizedSection)
        .reduce((max, item) => Math.max(max, item.order), 0) + 1;

    const newExperience = normalizeExperience({
      section: normalizedSection,
      order: nextOrder,
      year,
      title,
      organization,
      description: description || "",
      imageUrl,
    });

    try {
      existing.push(newExperience);
      writeExperiences(sortExperiences(existing));
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
    const experiences = normalizeAndOrderExperiences(readExperiences());
    const index = experiences.findIndex(
      (item) => String(item._id) === String(id),
    );
    if (index === -1) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    const current = experiences[index];
    const normalizedSection =
      updates.section !== undefined
        ? updates.section === "education"
          ? "education"
          : "experience"
        : current.section;
    const nextOrder =
      normalizedSection === current.section
        ? current.order
        : experiences.filter((item) => item.section === normalizedSection)
            .length + 1;

    const updated = normalizeExperience({
      ...current,
      ...updates,
      section: normalizedSection,
      order: nextOrder,
      _id: current._id,
      createdAt: current.createdAt,
    });

    try {
      experiences[index] = updated;
      writeExperiences(
        sortExperiences(normalizeAndOrderExperiences(experiences)),
      );
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

    const experiences = normalizeAndOrderExperiences(readExperiences());
    const filtered = experiences.filter(
      (item) => String(item._id) !== String(id),
    );
    if (filtered.length === experiences.length) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    try {
      writeExperiences(sortExperiences(normalizeAndOrderExperiences(filtered)));
      return res.status(200).json({ msg: "Experience removed" });
    } catch {
      return res.status(500).json({
        msg: "Unable to save experience in this deployment environment",
      });
    }
  }

  return res.status(405).json({ msg: "Method Not Allowed" });
}
