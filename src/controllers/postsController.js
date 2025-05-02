const Post = require("../models/posts.js");
const { v4: uuidv4 } = require("uuid");
const qs = require("qs");
const {
  containerClient,
  getAzureBlobSAS,
} = require("../services/azureBlob.js");
const fs = require("node:fs");

const { default: axios } = require("axios");
const API_URL = process.env.API_URL_USER || "http://localhost:8000";
const getUser = async ({ id, token }) => {
  if (!token) {
    throw new Error("No token");
  }

  const user = await axios.get(`${API_URL}/v1/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(user.data);
  return user.data;
};
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    const mappedPosts = await Promise.all(
      posts.map(async (post) => {
        const user = await getUser({ id: post.userId, token: req.token });
        return { ...post._doc, user };
      })
    );

    res
      .status(200)
      .json({
        posts: mappedPosts.reverse(),
        sas_token: getAzureBlobSAS()?.toString(),
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { post_image } = req.files;
    console.log(post_image);
    if (!post_image || post_image?.length === 0) {
      return res.status(400).json({ error: "Image is required" });
    }
    // use azure storage

    // Generate a unique filename for the uploaded file

    const uniqueFileName = `${uuidv4()}-${post_image[0].originalname}`;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);

    const buffer = await fs.promises.readFile(post_image[0].path);

    // Upload buffer to Azure Blob Storage
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: post_image[0].mimetype,
      },
    });

    const img_url = blockBlobClient.url;
    req.body.img_url = img_url;
    req.body.userId = req.user.userId;

    if (req.body.tags) {
      req.body.tags = req.body.tags.split(",");
    }

    if (!req.body.tags) {
      req.body.tags = [];
    }

    if (!req.body.content) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (!req.body.img_url) {
      return res.status(400).json({ error: "Image is required" });
    }

    const post = new Post({ ...req.body });
    await post.save();
    res.status(200).json({ ...post.toJSON() });

    // clean up temp upload directory
    if (req.files?.post_image) {
      try {
        fs.unlink(req?.files?.post_image[0]?.path, () =>
          console.log("'%s' was deleted", req?.files?.post_image[0]?.path)
        );
      } catch (error) {
        console.log(error);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const user = await getUser({
      id: post.userId,
      token: req.token,
    });
    res.status(200).json({
      post: {
        ...post.toJSON(),
        img_url: `${post.img_url}?${getAzureBlobSAS().toString()}`,
      },
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await Post.findOneAndUpdate(
      { _id: postId, userId: req.user.userId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOneAndDelete({
      _id: postId,
      userId: req.user.userId,
    });
    res.status(200).json({ post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAzureBlobSAS = async (req, res) => {
  try {
    const sas = getAzureBlobSAS();
    res.status(200).json({ sas });
    const str = qs.stringify(sas);
    console.log(str);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyAzureBlobSAS = async (req, res) => {
  try {
    const { sas_token } = req.body;
    const isValid = await verifySasToken(sas_token);
    res.status(200).json({ isValid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
