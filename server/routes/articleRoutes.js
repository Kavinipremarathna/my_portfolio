const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Article = require("../models/Article");
const auth = require("../middleware/authMiddleware");
const fileStore = require("../lib/fileStore");

const useMongo = () => mongoose.connection.readyState === 1;

const normalizeSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

router.get("/", async (req, res) => {
  try {
    const articles = useMongo()
      ? await Article.find().sort({ createdAt: -1 })
      : fileStore.listArticles();

    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug);
    const article = useMongo()
      ? await Article.findOne({ slug })
      : fileStore.getArticleBySlug(slug);

    if (!article) return res.status(404).json({ msg: "Article not found" });
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = useMongo()
      ? await Article.findById(req.params.id)
      : fileStore.getArticleById(req.params.id);

    if (!article) return res.status(404).json({ msg: "Article not found" });
    res.json(article);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Article not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const {
    slug,
    title,
    excerpt,
    content,
    category,
    readTime,
    date,
    tags,
    featured,
    source,
    mediumUrl,
  } = req.body || {};

  if (!title) {
    return res.status(400).json({ msg: "Title is required" });
  }

  const normalizedSlug = normalizeSlug(slug || title);
  if (!normalizedSlug) {
    return res.status(400).json({ msg: "A valid slug is required" });
  }

  const articlePayload = {
    slug: normalizedSlug,
    title,
    excerpt,
    content,
    category,
    readTime,
    date,
    tags: Array.isArray(tags) ? tags : [],
    featured: Boolean(featured),
    source: source || "original",
    mediumUrl: mediumUrl || "",
  };

  try {
    if (useMongo()) {
      const exists = await Article.findOne({ slug: normalizedSlug });
      if (exists) {
        return res.status(400).json({ msg: "Slug already exists" });
      }

      const article = await new Article(articlePayload).save();
      return res.json(article);
    }

    const existing = fileStore.getArticleBySlug(normalizedSlug);
    if (existing) {
      return res.status(400).json({ msg: "Slug already exists" });
    }

    const article = fileStore.createArticle(articlePayload);
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  const updates = { ...req.body };

  if (updates.slug || updates.title) {
    updates.slug = normalizeSlug(updates.slug || updates.title);
  }

  if (updates.tags !== undefined && !Array.isArray(updates.tags)) {
    updates.tags = [];
  }

  if (updates.featured !== undefined) {
    updates.featured = Boolean(updates.featured);
  }

  try {
    if (!useMongo()) {
      const current = fileStore.getArticleById(req.params.id);
      if (!current) return res.status(404).json({ msg: "Article not found" });

      const slugToCheck = updates.slug || current.slug;
      const duplicate = fileStore.getArticleBySlug(slugToCheck);
      if (duplicate && duplicate._id !== current._id) {
        return res.status(400).json({ msg: "Slug already exists" });
      }

      const article = fileStore.updateArticle(req.params.id, updates);
      return res.json(article);
    }

    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: "Article not found" });

    const slugToCheck = updates.slug || article.slug;
    const duplicate = await Article.findOne({ slug: slugToCheck });
    if (duplicate && String(duplicate._id) !== String(article._id)) {
      return res.status(400).json({ msg: "Slug already exists" });
    }

    article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true },
    );

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!useMongo()) {
      const deleted = fileStore.deleteArticle(req.params.id);
      if (!deleted) return res.status(404).json({ msg: "Article not found" });
      return res.json({ msg: "Article removed" });
    }

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: "Article not found" });

    await Article.findByIdAndDelete(req.params.id);
    res.json({ msg: "Article removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
