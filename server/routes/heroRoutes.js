const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Hero = require("../models/Hero");
const auth = require("../middleware/authMiddleware");
const fileStore = require("../lib/fileStore");

const useMongo = () => mongoose.connection.readyState === 1;

const HERO_SOCIAL_DEFAULTS = {
  github: "https://github.com/Kavinipremarathna",
  linkedin: "https://www.linkedin.com/in/kavini-premarathna",
  email: "mailto:kavinipremarathna@gmail.com",
};

const normalizeMongoHeroSocial = (heroRecord) => {
  const hero =
    heroRecord && typeof heroRecord.toObject === "function"
      ? heroRecord.toObject()
      : heroRecord || {};
  const social = hero.social || {};

  const normalizedSocial = {
    github:
      social.github && social.github !== "https://github.com"
        ? social.github
        : HERO_SOCIAL_DEFAULTS.github,
    linkedin:
      social.linkedin && social.linkedin !== "https://linkedin.com"
        ? social.linkedin
        : HERO_SOCIAL_DEFAULTS.linkedin,
    email:
      social.email && social.email !== "mailto:email@example.com"
        ? social.email
        : HERO_SOCIAL_DEFAULTS.email,
  };

  return {
    ...hero,
    social: normalizedSocial,
  };
};

router.get("/", async (req, res) => {
  try {
    if (!useMongo()) {
      return res.json(fileStore.getHeroConfig());
    }

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await new Hero({}).save();
    }

    const normalized = normalizeMongoHeroSocial(hero);
    const socialChanged =
      hero.social?.github !== normalized.social.github ||
      hero.social?.linkedin !== normalized.social.linkedin ||
      hero.social?.email !== normalized.social.email;

    if (socialChanged) {
      hero = await Hero.findByIdAndUpdate(
        hero._id,
        { $set: { social: normalized.social } },
        { new: true },
      );
      return res.json(hero);
    }

    res.json(normalized);
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

    const normalized = normalizeMongoHeroSocial(hero);
    const socialChanged =
      hero.social?.github !== normalized.social.github ||
      hero.social?.linkedin !== normalized.social.linkedin ||
      hero.social?.email !== normalized.social.email;

    if (socialChanged) {
      hero = await Hero.findByIdAndUpdate(
        hero._id,
        { $set: { social: normalized.social } },
        { new: true },
      );
      return res.json(hero);
    }

    res.json(normalized);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
