const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Gallery = require("../models/Gallery");
const auth = require("../middleware/authMiddleware");
const fileStore = require("../lib/fileStore");

const useMongo = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  try {
    const photos = useMongo()
      ? await Gallery.find().sort({ createdAt: -1 })
      : fileStore.listGalleryPhotos();

    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const photo = useMongo()
      ? await Gallery.findById(req.params.id)
      : fileStore.getGalleryPhotoById(req.params.id);

    if (!photo) return res.status(404).json({ msg: "Photo not found" });
    res.json(photo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Photo not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const { title, caption, category, imageUrl } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({ msg: "Title and image URL are required" });
  }

  try {
    const photo = useMongo()
      ? await new Gallery({ title, caption, category, imageUrl }).save()
      : fileStore.createGalleryPhoto({ title, caption, category, imageUrl });

    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { title, caption, category, imageUrl } = req.body;
  const updates = {};

  if (title !== undefined) updates.title = title;
  if (caption !== undefined) updates.caption = caption;
  if (category !== undefined) updates.category = category;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;

  try {
    if (!useMongo()) {
      const photo = fileStore.updateGalleryPhoto(req.params.id, updates);
      if (!photo) return res.status(404).json({ msg: "Photo not found" });
      return res.json(photo);
    }

    let photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ msg: "Photo not found" });

    photo = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true },
    );

    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!useMongo()) {
      const deleted = fileStore.deleteGalleryPhoto(req.params.id);
      if (!deleted) return res.status(404).json({ msg: "Photo not found" });
      return res.json({ msg: "Photo removed" });
    }

    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ msg: "Photo not found" });

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ msg: "Photo removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
