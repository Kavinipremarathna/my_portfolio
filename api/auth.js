import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const usersFileCandidates = [
  path.join(process.cwd(), "server", "data", "users.json"),
  path.join(process.cwd(), "data", "users.json"),
];

const bootstrapAdmin = {
  _id: "bootstrap-admin",
  username: process.env.ADMIN_USERNAME || "Kavini",
  password:
    process.env.ADMIN_PASSWORD_HASH ||
    "$2b$10$pG9uCs3wdjzqKIOL/dBGf.pLyP3YlOMb8cK4CUvo6iXoZUIwsdafC",
};

const resolveUsersFile = () => {
  for (const candidate of usersFileCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return usersFileCandidates[0];
};

const json = (res, status, payload) => {
  res.status(status).json(payload);
};

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-auth-token",
  );
};

const readUsers = () => {
  try {
    const usersFile = resolveUsersFile();
    if (!fs.existsSync(usersFile)) {
      return [];
    }

    const raw = fs.readFileSync(usersFile, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getEffectiveUsers = () => {
  const users = readUsers();
  if (users.length > 0) {
    return users;
  }

  return [bootstrapAdmin];
};

const writeUsers = (users) => {
  const usersFile = resolveUsersFile();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const normalizeRoute = (req) => {
  const route = req.query?.route;
  if (Array.isArray(route)) {
    return String(route[0] || "")
      .trim()
      .toLowerCase();
  }

  return String(route || "")
    .trim()
    .toLowerCase();
};

const createToken = (userId) =>
  jwt.sign(
    { user: { id: userId } },
    process.env.JWT_SECRET || "portfolio-dev-secret",
    { expiresIn: "7d" },
  );

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const route = normalizeRoute(req);

  if (route === "login" && req.method === "POST") {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    if (!username || !password) {
      return json(res, 400, { msg: "Please enter all fields" });
    }

    const users = getEffectiveUsers();
    const user = users.find(
      (item) =>
        String(item.username || "")
          .trim()
          .toLowerCase() === username.toLowerCase(),
    );

    if (!user) {
      return json(res, 400, { msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return json(res, 400, { msg: "Invalid Credentials" });
    }

    return json(res, 200, { token: createToken(user._id || user.id) });
  }

  if (route === "setup-status" && req.method === "GET") {
    const users = getEffectiveUsers();
    return json(res, 200, { setupRequired: users.length === 0 });
  }

  if (route === "setup" && req.method === "POST") {
    const users = getEffectiveUsers();
    if (users.length > 0) {
      return json(res, 400, { msg: "Admin user already exists" });
    }

    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");
    if (!username || !password) {
      return json(res, 400, { msg: "Please enter all fields" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const createdUser = {
      _id: `user-${Date.now()}`,
      username,
      password: hashed,
    };

    try {
      writeUsers([...users, createdUser]);
      return json(res, 200, { token: createToken(createdUser._id) });
    } catch {
      return json(res, 500, {
        msg: "Unable to save admin user in this deployment environment",
      });
    }
  }

  if (route === "user" && req.method === "GET") {
    const token =
      req.headers["x-auth-token"] ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return json(res, 401, { msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "portfolio-dev-secret",
      );
      const users = getEffectiveUsers();
      const user = users.find(
        (item) => String(item._id || item.id) === String(decoded.user?.id),
      );

      if (!user) {
        return json(res, 404, { msg: "User not found" });
      }

      return json(res, 200, {
        _id: user._id,
        username: user.username,
      });
    } catch {
      return json(res, 401, { msg: "Token is not valid" });
    }
  }

  return json(res, 405, { msg: "Method Not Allowed" });
}
