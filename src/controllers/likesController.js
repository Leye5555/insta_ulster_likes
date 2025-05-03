// controllers/likes.js

const Like = require("../models/likes.js"); // Your Mongoose Like model
const { default: axios } = require("axios");
const API_URL = process.env.API_URL_USER || "http://localhost:8000";

// Helper to fetch user data
const getUser = async ({ id, token }) => {
  if (!token) throw new Error("No token");
  const user = await axios.get(`${API_URL}/v1/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return user.data;
};

// Get all likes for a post
exports.getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ postId }).sort({ createdAt: -1 });
    const mappedLikes = await Promise.all(
      likes.map(async (like) => {
        const user = await getUser({ id: like.userId, token: req.token });
        return { ...like.toJSON(), user };
      })
    );
    res.status(200).json({ likes: mappedLikes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    // Prevent duplicate likes
    const existing = await Like.findOne({ postId, userId });
    if (existing) return res.status(400).json({ error: "Already liked" });

    const user = await getUser({ id: userId, token: req.token });

    const like = new Like({
      userId,
      postId,
      username: user.username,
      avatarUrl: user.avatarUrl,
      userProfile: user.profileUrl,
      createdAt: new Date().toISOString(),
    });

    await like.save();
    const likes = await Like.find({ postId }).sort({ createdAt: -1 });
    const mappedLikes = await Promise.all(
      likes.map(async (like) => {
        const user = await getUser({ id: like.userId, token: req.token });
        return { ...like.toJSON(), user };
      })
    );
    res.status(201).json({ likes: mappedLikes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const like = await Like.findOneAndDelete({ postId, userId });
    if (!like) return res.status(404).json({ error: "Like not found" });

    const likes = await Like.find({ postId }).sort({ createdAt: -1 });
    const mappedLikes = await Promise.all(
      likes.map(async (like) => {
        const user = await getUser({ id: like.userId, token: req.token });
        return { ...like.toJSON(), user };
      })
    );
    res.status(201).json({ likes: mappedLikes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
