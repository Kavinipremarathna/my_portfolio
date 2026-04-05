import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const fallbackPhotos = [];

const galleryFileCandidates = [
  path.join(process.cwd(), "server", "data", "gallery.json"),
  path.join(process.cwd(), "data", "gallery.json"),
];

const resolveGalleryFile = () => {
  for (const candidate of galleryFileCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return galleryFileCandidates[0];
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

const normalizePhoto = (photo) => ({
  _id: photo._id || crypto.randomUUID(),
  title: photo.title,
  caption: photo.caption || "",
  category: photo.category || "general",
  imageUrl: photo.imageUrl,
  createdAt: photo.createdAt || new Date().toISOString(),
});

const readGallery = () => {
  try {
    const galleryFile = resolveGalleryFile();
    if (!fs.existsSync(galleryFile)) {
      return fallbackPhotos;
    }

    const raw = fs.readFileSync(galleryFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) {
      return fallbackPhotos;
    }

    return parsed
      .map(normalizePhoto)
      .sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
      );
  } catch {
    return fallbackPhotos;
  }
};

const writeGallery = (photos) => {
  const galleryFile = resolveGalleryFile();
  fs.writeFileSync(galleryFile, JSON.stringify(photos, null, 2));
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
    return res.status(200).json(readGallery());
  }

  if (req.method === "GET" && id) {
    const photo = readGallery().find((item) => String(item._id) === String(id));
    if (!photo) {
      return res.status(404).json({ msg: "Photo not found" });
    }

    return res.status(200).json(photo);
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;

    const { title, caption, category, imageUrl } = req.body || {};
    if (!title || !imageUrl) {
      return res.status(400).json({ msg: "Title and image URL are required" });
    }

    const newPhoto = normalizePhoto({
      title: String(title).trim(),
      caption: String(caption || "").trim(),
      category: String(category || "general")
        .trim()
        .toLowerCase(),
      imageUrl: String(imageUrl).trim(),
    });

    try {
      const photos = readGallery();
      photos.unshift(newPhoto);
      writeGallery(photos);
      return res.status(200).json(newPhoto);
    } catch {
      return res.status(500).json({
        msg: "Unable to save photo in this deployment environment",
      });
    }
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Photo id is required" });

    const updates = req.body || {};
    const photos = readGallery();
    const index = photos.findIndex((item) => String(item._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ msg: "Photo not found" });
    }

    const updated = normalizePhoto({
      ...photos[index],
      ...updates,
      _id: photos[index]._id,
      createdAt: photos[index].createdAt,
    });

    try {
      photos[index] = updated;
      writeGallery(photos);
      return res.status(200).json(updated);
    } catch {
      return res.status(500).json({
        msg: "Unable to save photo in this deployment environment",
      });
    }
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Photo id is required" });

    const photos = readGallery();
    const filtered = photos.filter((item) => String(item._id) !== String(id));
    if (filtered.length === photos.length) {
      return res.status(404).json({ msg: "Photo not found" });
    }

    try {
      writeGallery(filtered);
      return res.status(200).json({ msg: "Photo removed" });
    } catch {
      return res.status(500).json({
        msg: "Unable to save photo in this deployment environment",
      });
    }
  }

  return res.status(405).json({ msg: "Method Not Allowed" });
}
