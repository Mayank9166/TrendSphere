import express from "express"
import { verifyToken } from "../utils/verifyUser.js";
import { createComment, getPostComments, likeComment } from "../controllers/commentController.js";
const router = express.Router();

router.post("/create",verifyToken,createComment);
router.get("/getPostComments/:postId",getPostComments);
router.put("/likecomment/:commentId",verifyToken,likeComment);

export default router;