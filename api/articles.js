import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const defaultArticles = [
  {
    _id: "article-1",
    slug: "building-realtime-apps-nextjs-websockets",
    title: "Building Real-Time Apps with Next.js 14 and WebSockets",
    excerpt:
      "A practical implementation guide for collaboration-ready realtime features using event design, optimistic UI, and resilient socket infrastructure.",
    content:
      "Real-time experiences feel magical when updates arrive instantly and predictably. But the engineering behind that magic is a set of careful trade-offs between consistency, throughput, and user expectations.\n\nThe first step is to define a clear event contract. Every message should carry a stable type, timestamp, actor, and payload schema. That consistency makes frontend state updates deterministic and helps avoid fragile event handlers spread across components.\n\nFor collaboration features, optimistic UI is essential. Instead of waiting for round trips, apply local state updates immediately, mark them as pending, and reconcile once the server confirms. This keeps the interface responsive under poor network conditions while still preserving correctness.\n\nOn the server, isolate socket concerns from core business logic. Route incoming events through a service layer, validate payloads strictly, and publish domain updates through a centralized dispatcher. This architecture keeps your websocket layer thin and easier to scale.\n\nWhen traffic grows, horizontal scaling requires a pub/sub backbone so events can fan out across instances. Redis pub/sub is a common first move: socket servers subscribe to channels and broadcast only to relevant rooms. With this setup, your system can scale without losing realtime guarantees.\n\nFinally, production quality is about observability. Track dropped connections, reconnect frequency, message latency percentiles, and room fanout size. These metrics quickly reveal bottlenecks and make performance tuning objective rather than guesswork.",
    category: "Backend",
    readTime: "8 min read",
    date: "2026-04-05",
    tags: ["Next.js", "WebSockets", "Realtime", "Architecture"],
    featured: true,
    source: "medium",
    mediumUrl:
      "https://my-portfolio-five-blush-52.vercel.app/blog/building-realtime-apps-nextjs-websockets",
    createdAt: "2026-04-05T12:00:00.000Z",
  },
  {
    _id: "article-2",
    slug: "secure-auth-flow-react-node",
    title: "Designing Secure Auth Flows in React and Node.js",
    excerpt:
      "How to design modern authentication with refresh token rotation, role-aware APIs, and practical safeguards for real deployments.",
    content:
      "Authentication is easy to start and difficult to finish well. Many teams implement login quickly, then spend months patching edge cases around expired sessions, token theft, and inconsistent role checks.\n\nA robust setup separates short-lived access tokens from longer-lived refresh tokens. Access tokens should remain compact and expire quickly. Refresh tokens should rotate on every refresh request so replay attacks become detectable and containable.\n\nOn the frontend, centralize token refresh behavior in a single HTTP layer. Avoid scattering retry logic in components. When a request fails with 401, trigger one refresh operation, queue pending requests, then resolve them together. This prevents token race conditions and request storms.\n\nOn the backend, authorization should happen close to route boundaries. Verify identity first, then enforce role and permission checks in explicit middleware. Keep policy names human-readable so audits and debugging are straightforward.\n\nSecurity also means reducing attack surface. Enforce strict input validation, apply rate limits on auth endpoints, and track suspicious login patterns. Combine this with secure cookie flags or safe token storage decisions based on your deployment model.\n\nThe result is an auth flow that users barely notice and engineers can trust. That reliability is what makes higher-level product features easier to ship.",
    category: "Security",
    readTime: "7 min read",
    date: "2026-03-24",
    tags: ["JWT", "Auth", "Node.js", "React"],
    featured: false,
    source: "original",
    mediumUrl: "",
    createdAt: "2026-03-24T12:00:00.000Z",
  },
  {
    _id: "article-3",
    slug: "portfolio-performance-playbook",
    title: "Portfolio Performance Playbook: Fast, Smooth, and SEO-Ready",
    excerpt:
      "A repeatable process to improve Core Web Vitals without compromising visual polish or motion quality.",
    content:
      "Performance is not a one-time sprint. It is a workflow. For portfolio sites, the best strategy is to optimize the highest-impact layers first: media payloads, route bundles, rendering paths, and long main-thread tasks.\n\nStart by auditing real pages with Lighthouse and Web Vitals in production. Identify which sections cause Largest Contentful Paint delays and whether animations or large images block first render. Data should guide every decision.\n\nNext, optimize media aggressively. Use modern formats, preload only what matters above the fold, and lazy-load the rest with stable dimensions. This eliminates layout shifts and improves perceived quality immediately.\n\nBundle strategy matters equally. Split route-level chunks and defer non-critical features. If a component is below the fold, it should not inflate initial JavaScript unless absolutely required.\n\nMotion should support clarity, not cost. Prefer transform and opacity animations, avoid expensive paint-heavy effects in large lists, and reduce concurrent animations on lower-end devices.\n\nFinally, lock performance into your workflow with CI budgets. A site that scores high once but regresses next week is not optimized. A site that protects performance continuously is.",
    category: "Performance",
    readTime: "6 min read",
    date: "2026-03-10",
    tags: ["Lighthouse", "Web Vitals", "Frontend"],
    featured: false,
    source: "original",
    mediumUrl: "",
    createdAt: "2026-03-10T12:00:00.000Z",
  },
];

const articleFileCandidates = [
  path.join(process.cwd(), "server", "data", "articles.json"),
  path.join(process.cwd(), "data", "articles.json"),
];

const resolveArticleFile = () => {
  for (const candidate of articleFileCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return articleFileCandidates[0];
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

const normalizeSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeArticle = (article) => ({
  _id: article._id || crypto.randomUUID(),
  slug: normalizeSlug(article.slug || article.title),
  title: article.title,
  excerpt: article.excerpt || "",
  content: article.content || "",
  category: article.category || "Engineering",
  readTime: article.readTime || "5 min read",
  date: article.date || new Date().toISOString().slice(0, 10),
  tags: Array.isArray(article.tags) ? article.tags : [],
  featured: Boolean(article.featured),
  source: article.source || "original",
  mediumUrl: article.mediumUrl || "",
  createdAt: article.createdAt || new Date().toISOString(),
});

const readArticles = () => {
  try {
    const filePath = resolveArticleFile();
    if (!fs.existsSync(filePath)) {
      return defaultArticles;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultArticles;
    }

    return parsed
      .map(normalizeArticle)
      .sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
      );
  } catch {
    return defaultArticles;
  }
};

const writeArticles = (articles) => {
  const filePath = resolveArticleFile();
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
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
  const routeParts = route.split("/").filter(Boolean);
  const id = routeParts[0] || "";

  if (req.method === "GET" && routeParts[0] === "slug" && routeParts[1]) {
    const slug = normalizeSlug(routeParts[1]);
    const article = readArticles().find((item) => item.slug === slug);
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }
    return res.status(200).json(article);
  }

  if (req.method === "GET" && !id) {
    return res.status(200).json(readArticles());
  }

  if (req.method === "GET" && id) {
    const article = readArticles().find(
      (item) => String(item._id) === String(id),
    );
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }
    return res.status(200).json(article);
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;

    const payload = normalizeArticle(req.body || {});
    if (!payload.title || !payload.slug) {
      return res.status(400).json({ msg: "Title and slug are required" });
    }

    const articles = readArticles();
    if (articles.some((item) => item.slug === payload.slug)) {
      return res.status(400).json({ msg: "Slug already exists" });
    }

    try {
      articles.unshift(payload);
      writeArticles(articles);
      return res.status(200).json(payload);
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save article in this deployment environment" });
    }
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Article id is required" });

    const articles = readArticles();
    const index = articles.findIndex((item) => String(item._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ msg: "Article not found" });
    }

    const updated = normalizeArticle({
      ...articles[index],
      ...(req.body || {}),
      _id: articles[index]._id,
      createdAt: articles[index].createdAt,
    });

    const duplicate = articles.find(
      (item) => item.slug === updated.slug && String(item._id) !== String(id),
    );
    if (duplicate) {
      return res.status(400).json({ msg: "Slug already exists" });
    }

    try {
      articles[index] = updated;
      writeArticles(articles);
      return res.status(200).json(updated);
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save article in this deployment environment" });
    }
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ msg: "Article id is required" });

    const articles = readArticles();
    const filtered = articles.filter((item) => String(item._id) !== String(id));
    if (filtered.length === articles.length) {
      return res.status(404).json({ msg: "Article not found" });
    }

    try {
      writeArticles(filtered);
      return res.status(200).json({ msg: "Article removed" });
    } catch {
      return res
        .status(500)
        .json({ msg: "Unable to save article in this deployment environment" });
    }
  }

  return res.status(405).json({ msg: "Method Not Allowed" });
}
