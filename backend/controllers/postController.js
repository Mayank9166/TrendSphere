// import {Post} from "../models/postModel.js";
import Post from "../models/postModel.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res,next) => {
if(!req.user.isAdmin)
{
    return next(errorHandler(403,"You are not allowed to create a post"));  
}
if(!req.body.title || !req.body.content)
{
    return next(errorHandler(400,"All required fields must be filled"));
}

const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
const newPost = new Post({
   ...req.body,
   slug,
   userId: req.user.id,
})
try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);    
} catch (error) {
    next(error);
}
}
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const filter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } }
        ]
      })
    };

    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost =  async (req, res, next) => {
  if(!req.user.isAdmin) 
  {
      return next(errorHandler(403,"You are not allowed to delete a post"));  
  }
  const { postId, userId } = req.params;
  if (req.user.id !== userId) { 
    return next(errorHandler(403, "You are not allowed to delete this post"));
  } 
  try {
     await Post.findByIdAndDelete(postId);
     
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  } 
};

export const updatePost = async (req,res,next) =>
{
  // console.log(req.params);
  // console.log(req.body);
  // console.log(req.user.isAdmin);
   if(!req.user.isAdmin || req.user.id !==req.params.userId)
   {
    return next(errorHandler(403,"You are not authorized to update this post!"))
   }
   try {
      const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
      // console.log(req.body);
      const updatedPost = await Post.findByIdAndUpdate(req.params.postId,{
        $set:{
          title:req.body.title,
          content:req.body.content,
          category:req.body.category,
          image:req.body.image,
          slug
        }
      }
    ,{new:true})
    // console.log(updatedPost);
    res.status(200).json(updatedPost);
   } catch (error) {
    next(error);
   }
}