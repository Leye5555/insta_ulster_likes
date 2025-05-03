const express = require("express");
const router = express.Router();
const {
  getLikes,
  likePost,
  unlikePost,
} = require("../controllers/likesController");
const auth = require("../middlewares/auth");

/**
 * @openapi
 * /v1/likes/{postId}:
 *   get:
 *     tags: [Likes]
 *     summary: Get all likes for a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       postId:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatarUrl:
 *                         type: string
 *                       userProfile:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatarUrl:
 *                             type: string
 *                           userProfile:
 *                             type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/likes/:postId", auth, getLikes);

/**
 * @openapi
 * /v1/likes/{postId}:
 *   post:
 *     tags: [Likes]
 *     summary: Like a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 postId:
 *                   type: string
 *                 username:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 userProfile:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       400:
 *         description: Already liked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/likes/:postId", auth, likePost);

/**
 * @openapi
 * /v1/likes/{postId}:
 *   delete:
 *     tags: [Likes]
 *     summary: Unlike a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 postId:
 *                   type: string
 *                 username:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 userProfile:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Like not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/likes/:postId", auth, unlikePost);

module.exports = router;
