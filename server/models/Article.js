const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, default: "" },
  content: { type: String, default: "" },
  category: { type: String, default: "Engineering" },
  readTime: { type: String, default: "5 min read" },
  date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  source: { type: String, default: "original" },
  mediumUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", ArticleSchema);
