import mongoose from "mongoose";
import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    // User check
    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to add comment"));
    }

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create and save comment
    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req,res,next)=>{
    try {
        const comments = await Comment.find({postId:req.params.postId}).sort({
            createdAt:-1,
        })
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

export const likeComment  = async(req,res,next)=>{
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment)
    {
      return next(errorHandler(404,"Comment not found!"))
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if(userIndex===-1)
    {
      comment.numberOfLikes+=1;
      comment.likes.push(req.user.id);
    }
    else{
      comment.numberOfLikes-=1;
      comment.likes.splice(userIndex,1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}
 
export const editComment = async (req,res,next)=>{
  try {
      const comment = await Comment.findById(req.params.commentId);
    if(!comment)
    {
      return next(errorHandler(404,"Comment not found!"))
    }
    if(comment.userId!== req.user.id && req.user.isAdmin )
    {
      return next(errorHandler(403,"You are not authorized to edit this comment"))
    }
    const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,{
      content:req.body.content,
       
    },{new:true})
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
}