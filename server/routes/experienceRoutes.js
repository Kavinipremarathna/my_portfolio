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
      ? await Experience.find().sort({ section: 1, order: 1, createdAt: -1 })
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
    const normalizedSection =
      section === "education" ? "education" : "experience";
    let nextOrder = 1;

    if (useMongo()) {
      const maxOrderEntry = await Experience.findOne({
        section: normalizedSection,
      })
        .sort({ order: -1, createdAt: -1 })
        .lean();
      nextOrder = (maxOrderEntry?.order || 0) + 1;
    }

    const experience = useMongo()
      ? await new Experience({
          section: normalizedSection,
          year,
          order: nextOrder,
          title,
          organization,
          description,
        }).save()
      : fileStore.createExperience({
          section: normalizedSection,
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

    const normalizedSection =
      updates.section !== undefined
        ? updates.section === "education"
          ? "education"
          : "experience"
        : experience.section;
    if (updates.section !== undefined) {
      updates.section = normalizedSection;
    }

    if (normalizedSection !== experience.section) {
      const maxOrderEntry = await Experience.findOne({
        section: normalizedSection,
      })
        .sort({ order: -1, createdAt: -1 })
        .lean();
      updates.order = (maxOrderEntry?.order || 0) + 1;
    }

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

router.post("/reorder", auth, async (req, res) => {
  const id = String(req.body?.id || "").trim();
  const direction = req.body?.direction === "up" ? "up" : "down";

  if (!id) {
    return res.status(400).json({ msg: "Experience id is required" });
  }

  try {
    if (!useMongo()) {
      const experience = fileStore.reorderExperience(id, direction);
      if (!experience)
        return res.status(404).json({ msg: "Experience not found" });
      return res.json(experience);
    }

    const current = await Experience.findById(id);
    if (!current) {
      return res.status(404).json({ msg: "Experience not found" });
    }

    const sectionItems = await Experience.find({
      section: current.section,
    }).sort({
      order: 1,
      createdAt: 1,
    });
    const currentIndex = sectionItems.findIndex(
      (item) => String(item._id) === String(id),
    );
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < sectionItems.length) {
      const [moved] = sectionItems.splice(currentIndex, 1);
      sectionItems.splice(targetIndex, 0, moved);

      await Experience.bulkWrite(
        sectionItems.map((item, index) => ({
          updateOne: {
            filter: { _id: item._id },
            update: { $set: { order: index + 1 } },
          },
        })),
      );
    }

    const updated = await Experience.findById(id);
    return res.json(updated);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
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
