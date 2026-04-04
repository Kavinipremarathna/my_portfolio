const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Skill = require("../models/Skill");
const auth = require("../middleware/authMiddleware");
const fileStore = require("../lib/fileStore");

const useMongo = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  try {
    const skills = useMongo()
      ? await Skill.find().sort({ createdAt: 1 })
      : fileStore.listSkills();

    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const skill = useMongo()
      ? await new Skill({ name, category }).save()
      : fileStore.createSkill({ name, category });

    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { name, category } = req.body;
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (category !== undefined) updates.category = category;

  try {
    if (!useMongo()) {
      const skill = fileStore.updateSkill(req.params.id, updates);
      if (!skill) return res.status(404).json({ msg: "Skill not found" });
      return res.json(skill);
    }

    let skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ msg: "Skill not found" });

    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true },
    );

    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!useMongo()) {
      const deleted = fileStore.deleteSkill(req.params.id);
      if (!deleted) return res.status(404).json({ msg: "Skill not found" });
      return res.json({ msg: "Skill removed" });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ msg: "Skill not found" });

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ msg: "Skill removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
