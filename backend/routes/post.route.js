import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletePost, getPosts, updatePost } from '../controllers/postController.js';

const router = express.Router();
router.post("/create",verifyToken,create);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postId/:userId",verifyToken, deletePost);
router.put("/updatepost/:postId/:userId",verifyToken,updatePost);

export default router;