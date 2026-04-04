const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const fileStore = require("../lib/fileStore");

const useMongo = () => mongoose.connection.readyState === 1;

const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const rawUsername = req.body?.username;
  const password = req.body?.password;
  const normalizedUsername = String(rawUsername || "").trim();

  if (!normalizedUsername || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = useMongo()
      ? await User.findOne({
          username: {
            $regex: `^${escapeRegExp(normalizedUsername)}$`,
            $options: "i",
          },
        })
      : fileStore.findUserByUsername(normalizedUsername);

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id || user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    if (useMongo()) {
      const user = await User.findById(req.user.user.id).select("-password");
      return res.json(user);
    }

    const user = fileStore.findUserById(req.user.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/setup-status", async (req, res) => {
  try {
    const userCount = useMongo()
      ? await User.countDocuments()
      : fileStore.countUsers();

    res.json({ setupRequired: userCount === 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth/setup
// @desc    Create initial admin user (only if no users exist)
// @access  Public
router.post("/setup", async (req, res) => {
  try {
    const userCount = useMongo()
      ? await User.countDocuments()
      : fileStore.countUsers();

    if (userCount > 0) {
      return res.status(400).json({ msg: "Admin user already exists" });
    }

    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = useMongo()
      ? await new User({ username, password: hashedPassword }).save()
      : fileStore.createUser({ username, password: hashedPassword });

    const payload = {
      user: {
        id: user.id || user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
