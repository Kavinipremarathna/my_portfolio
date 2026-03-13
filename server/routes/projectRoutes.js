const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");
const fileStore = require("../lib/fileStore");

const useMongo = () => mongoose.connection.readyState === 1;

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get("/", async (req, res) => {
  try {
    const projects = useMongo()
      ? await Project.find().sort({ createdAt: -1 })
      : fileStore.listProjects();
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const project = useMongo()
      ? await Project.findById(req.params.id)
      : fileStore.getProjectById(req.params.id);

    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Project not found" });
    res.status(500).send("Server Error");
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private (Admin only)
router.post("/", auth, async (req, res) => {
  const { title, description, tags, imageUrl, liveLink, repoLink, featured } =
    req.body;

  try {
    const project = useMongo()
      ? await new Project({
          title,
          description,
          tags,
          imageUrl,
          liveLink,
          repoLink,
          featured,
        }).save()
      : fileStore.createProject({
          title,
          description,
          tags,
          imageUrl,
          liveLink,
          repoLink,
          featured,
        });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private (Admin only)
router.put("/:id", auth, async (req, res) => {
  const { title, description, tags, imageUrl, liveLink, repoLink, featured } =
    req.body;

  // Build project object
  const projectFields = {};
  if (title !== undefined) projectFields.title = title;
  if (description !== undefined) projectFields.description = description;
  if (tags !== undefined) projectFields.tags = tags;
  if (imageUrl !== undefined) projectFields.imageUrl = imageUrl;
  if (liveLink !== undefined) projectFields.liveLink = liveLink;
  if (repoLink !== undefined) projectFields.repoLink = repoLink;
  if (featured !== undefined) projectFields.featured = featured;

  try {
    if (!useMongo()) {
      const project = fileStore.updateProject(req.params.id, projectFields);
      if (!project) return res.status(404).json({ msg: "Project not found" });
      return res.json(project);
    }

    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: "Project not found" });

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true },
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!useMongo()) {
      const deleted = fileStore.deleteProject(req.params.id);
      if (!deleted) return res.status(404).json({ msg: "Project not found" });
      return res.json({ msg: "Project removed" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: "Project not found" });

    await Project.findByIdAndDelete(req.params.id);

    res.json({ msg: "Project removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
