import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import Comment from './Comment';

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      toast('Comment must be lower than or equal to 200 characters');
      return;
    }
    try {
      const res = await fetch('https://trendsphere-5.onrender.com/api/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: comment,
          postId: postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast('Comment Successfully');
        setComment('');
        setAllComments([data, ...allComments]);
      }
    } catch (error) {
      console.log(error);
      toast('Something went wrong. Please try again');
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setAllComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }

      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: 'PUT',
      });

      if (res.ok) {
        const data = await res.json();
        setAllComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setAllComments((prev) =>
      prev.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );

  };
  const handleDelete = async (commentId)=>{
    try {
      if(!currentUser)
       {
        navigate("/sign-in")
        return;
       }
       const res = await fetch(`/api/comment/deletecomment/${commentId}`,{
        method:"DELETE",
       })
       if(res.ok)
       {
        const data = await res.json();
        setAllComments(allComments.filter((comment)=>comment._id!==commentId)); 
       }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-3xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as: </p>
          <img
            src={currentUser.profilePhotoUrl}
            alt='profilePic'
            className='h-5 w-5 object-cover rounded-full'
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-sm text-blue-800 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-gray-700 my-5 flex gap-1'>
          You must be signed in to comment
          <Link to={'/sign-in'} className='text-blue-600 hover-underline'>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border-2 border-gray-400 rounded-md p-4'
        >
          <Textarea
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            className='border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <div className='flex justify-between items-center mt-5 '>
            <p className='text-gray-500 text-sm'>
              {200 - comment.length} characters remaining
            </p>
            <Button type='submit'>Submit</Button>
          </div>
        </form>
      )}

      {allComments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1 font-semibold'>
            <p>Comments</p>
            <div className='border border-gray-400 rounded-sm py-1 px-2'>
              <p>{allComments.length}</p>
            </div>
          </div>
          {allComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
