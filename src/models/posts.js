const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    tags: { type: [String] },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
