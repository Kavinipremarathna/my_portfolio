const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["experience", "education"],
      default: "experience",
    },
    year: { type: String, default: "" },
    order: { type: Number, default: 0 },
    title: { type: String, default: "" },
    organization: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Experience", ExperienceSchema);
