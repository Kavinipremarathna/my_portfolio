const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Hero = require("../models/Hero");
const auth = require("../middleware/authMiddleware");
const fileStore = require("../lib/fileStore");

const useMongo = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  try {
    if (!useMongo()) {
      return res.json(fileStore.getHeroConfig());
    }

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await new Hero({}).save();
    }

    res.json(hero);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/", auth, async (req, res) => {
  const updates = req.body || {};

  try {
    if (!useMongo()) {
      const hero = fileStore.updateHeroConfig(updates);
      return res.json(hero);
    }

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await new Hero({}).save();
    }

    hero = await Hero.findByIdAndUpdate(
      hero._id,
      { $set: updates },
      { new: true },
    );

    res.json(hero);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
