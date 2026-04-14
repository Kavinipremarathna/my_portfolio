import fs from "node:fs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { resolveJsonFilePath } from "./storage.js";

const fallbackProjects = [
  {
    _id: "a7e832cc-db3c-4eea-ae44-d2a427219597",
    title: "Planova ",
    description:
      "Planova, a modern web-based event management platform created to transform the way people organize weddings, birthdays, and engagements. The system combines event creation, theme customization, budget tracking, vendor package browsing, and secure online payments into a seamless experience. With a responsive and user-friendly interface, Planova is designed to make event planning stress-free and efficient, while showcasing the power of full-stack web technologies in solving real-world challenges.",
    tags: [
      "React.js | Node.js | Express.js | MongoDB | Stripe API | Tailwind CSS | Figma | Postman | Git/GitHub",
    ],
    imageUrl:
      "https://mir-s3-cdn-cf.behance.net/projects/404/ef4fb2200784279.66686f8b5be30.jpg",
    liveLink:
      "https://www.linkedin.com/posts/kavini-premarathna_webdevelopment-reactjs-nodejs-activity-7369738007467233280-Ht-K?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEUuUucBgAieWhM6s-XjrZwS_dXN60YHdAc",
    repoLink: "",
    featured: true,
    createdAt: "2026-03-13T16:41:08.098Z",
  },
];

const resolveProjectFile = () => {
  return resolveJsonFilePath("projects.json");
};

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

const readProjects = () => {
  try {
    const projectFile = resolveProjectFile();
    if (!fs.existsSync(projectFile)) {
      return fallbackProjects;
    }

    const raw = fs.readFileSync(projectFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallbackProjects;
    }

    return parsed;
  } catch {
    return fallbackProjects;
  }
};

const writeProjects = (projects) => {
  const projectFile = resolveProjectFile();
  fs.writeFileSync(projectFile, JSON.stringify(projects, null, 2));
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
    return res.status(200).json(readProjects());
  }

  if (req.method === "GET" && id) {
    const project = readProjects().find(
      (item) => String(item._id) === String(id),
    );
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    return res.status(200).json(project);
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;

    const { title, description, tags, imageUrl, liveLink, repoLink, featured } =
      req.body || {};
    const newProject = {
      _id: crypto.randomUUID(),
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      imageUrl,
      liveLink: liveLink || "",
      repoLink: repoLink || "",
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    try {
      const projects = readProjects();
      projects.unshift(newProject);
      writeProjects(projects);
      return res.status(200).json(newProject);
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save project in this deployment environment" });
    }
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Project id is required" });

    const updates = req.body || {};
    const projects = readProjects();
    const index = projects.findIndex((item) => String(item._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const updated = {
      ...projects[index],
      ...updates,
      _id: projects[index]._id,
      createdAt: projects[index].createdAt,
    };

    try {
      projects[index] = updated;
      writeProjects(projects);
      return res.status(200).json(updated);
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save project in this deployment environment" });
    }
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Project id is required" });

    const projects = readProjects();
    const filtered = projects.filter((item) => String(item._id) !== String(id));
    if (filtered.length === projects.length) {
      return res.status(404).json({ msg: "Project not found" });
    }

    try {
      writeProjects(filtered);
      return res.status(200).json({ msg: "Project removed" });
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save project in this deployment environment" });
    }
  }

  return res.status(405).json({ msg: "Method Not Allowed" });
}
