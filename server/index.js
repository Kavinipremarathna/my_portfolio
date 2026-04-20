const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "16mb" }));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) =>
    console.error(
      "MongoDB Connection Error. Falling back to local file storage:",
      err.message,
    ),
  );

// Routes (Placeholder)
app.get("/", (req, res) => {
  res.send("Portfolio API is running...");
});

// Import Routes
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const articleRoutes = require("./routes/articleRoutes");
const heroRoutes = require("./routes/heroRoutes");
const experienceRoutes = require("./routes/experienceRoutes");

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/experiences", experienceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
