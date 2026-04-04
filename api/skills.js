import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const fallbackSkills = [
  {
    _id: "skill-1",
    name: "React",
    category: "Frontend",
    createdAt: "2026-04-04T00:00:00.000Z",
  },
  {
    _id: "skill-2",
    name: "Tailwind CSS",
    category: "Frontend",
    createdAt: "2026-04-04T00:00:01.000Z",
  },
  {
    _id: "skill-3",
    name: "UI Motion",
    category: "Frontend",
    createdAt: "2026-04-04T00:00:02.000Z",
  },
  {
    _id: "skill-4",
    name: "Node.js",
    category: "Backend",
    createdAt: "2026-04-04T00:00:03.000Z",
  },
  {
    _id: "skill-5",
    name: "Express.js",
    category: "Backend",
    createdAt: "2026-04-04T00:00:04.000Z",
  },
  {
    _id: "skill-6",
    name: "MongoDB",
    category: "Backend",
    createdAt: "2026-04-04T00:00:05.000Z",
  },
  {
    _id: "skill-7",
    name: "Git / GitHub",
    category: "Tools",
    createdAt: "2026-04-04T00:00:06.000Z",
  },
  {
    _id: "skill-8",
    name: "VS Code",
    category: "Tools",
    createdAt: "2026-04-04T00:00:07.000Z",
  },
  {
    _id: "skill-9",
    name: "Postman",
    category: "Tools",
    createdAt: "2026-04-04T00:00:08.000Z",
  },
];

const skillsFileCandidates = [
  path.join(process.cwd(), "server", "data", "skills.json"),
  path.join(process.cwd(), "data", "skills.json"),
];

const resolveSkillsFile = () => {
  for (const candidate of skillsFileCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return skillsFileCandidates[0];
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

const readSkills = () => {
  try {
    const skillsFile = resolveSkillsFile();
    if (!fs.existsSync(skillsFile)) {
      return fallbackSkills;
    }

    const raw = fs.readFileSync(skillsFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallbackSkills;
    }

    return parsed;
  } catch {
    return fallbackSkills;
  }
};

const writeSkills = (skills) => {
  const skillsFile = resolveSkillsFile();
  fs.writeFileSync(skillsFile, JSON.stringify(skills, null, 2));
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
    return res.status(200).json(readSkills());
  }

  if (req.method === "GET" && id) {
    const skill = readSkills().find((item) => String(item._id) === String(id));
    if (!skill) {
      return res.status(404).json({ msg: "Skill not found" });
    }

    return res.status(200).json(skill);
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;

    const { name, category } = req.body || {};
    if (!name || !category) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const newSkill = {
      _id: crypto.randomUUID(),
      name: String(name).trim(),
      category: String(category).trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const skills = readSkills();
      skills.push(newSkill);
      writeSkills(skills);
      return res.status(200).json(newSkill);
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save skill in this deployment environment" });
    }
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Skill id is required" });

    const updates = req.body || {};
    const skills = readSkills();
    const index = skills.findIndex((item) => String(item._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ msg: "Skill not found" });
    }

    const updated = {
      ...skills[index],
      ...updates,
      _id: skills[index]._id,
      createdAt: skills[index].createdAt,
    };

    try {
      skills[index] = updated;
      writeSkills(skills);
      return res.status(200).json(updated);
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save skill in this deployment environment" });
    }
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Skill id is required" });

    const skills = readSkills();
    const filtered = skills.filter((item) => String(item._id) !== String(id));
    if (filtered.length === skills.length) {
      return res.status(404).json({ msg: "Skill not found" });
    }

    try {
      writeSkills(filtered);
      return res.status(200).json({ msg: "Skill removed" });
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save skill in this deployment environment" });
    }
  }

  return res.status(405).json({ msg: "Method Not Allowed" });
}
