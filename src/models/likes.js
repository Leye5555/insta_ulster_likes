const mongoose = require("mongoose");
const { Schema } = mongoose;

const LikeSchema = new Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true, index: true },
  username: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
  userProfile: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Like", LikeSchema);
