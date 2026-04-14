const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Experience = require("../models/Experience");
const auth = require("../middleware/authMiddleware");
const fileStore = require("../lib/fileStore");

const useMongo = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  try {
    const experiences = useMongo()
      ? await Experience.find().sort({ createdAt: -1 })
      : fileStore.listExperiences();

    res.json(experiences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const experience = useMongo()
      ? await Experience.findById(req.params.id)
      : fileStore.getExperienceById(req.params.id);

    if (!experience)
      return res.status(404).json({ msg: "Experience not found" });
    res.json(experience);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Experience not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const { section, year, title, organization, description } = req.body;

  if (!year || !title || !organization || !description) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const experience = useMongo()
      ? await new Experience({
          section,
          year,
          title,
          organization,
          description,
        }).save()
      : fileStore.createExperience({
          section,
          year,
          title,
          organization,
          description,
        });

    res.json(experience);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { section, year, title, organization, description } = req.body;
  const updates = {};

  if (section !== undefined) updates.section = section;
  if (year !== undefined) updates.year = year;
  if (title !== undefined) updates.title = title;
  if (organization !== undefined) updates.organization = organization;
  if (description !== undefined) updates.description = description;

  try {
    if (!useMongo()) {
      const experience = fileStore.updateExperience(req.params.id, updates);
      if (!experience)
        return res.status(404).json({ msg: "Experience not found" });
      return res.json(experience);
    }

    let experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ msg: "Experience not found" });

    experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true },
    );

    res.json(experience);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!useMongo()) {
      const deleted = fileStore.deleteExperience(req.params.id);
      if (!deleted)
        return res.status(404).json({ msg: "Experience not found" });
      return res.json({ msg: "Experience removed" });
    }

    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ msg: "Experience not found" });

    await Experience.findByIdAndDelete(req.params.id);
    res.json({ msg: "Experience removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
