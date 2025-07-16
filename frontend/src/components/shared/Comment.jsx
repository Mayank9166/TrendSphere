import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { AiFillLike } from "react-icons/ai";

const Comment = ({comment,onLike}) => {
    const [user,setUser] = useState({})
    const {currentUser} = useSelector((state)=>state.user)
    // console.log(user)
    useEffect(()=>{
        const getUser = async ()=>{
              try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok)
                {
                    setUser(data);
                }
              } catch (error) {
                console.log(error.message);
              }
        }
        getUser();
    },[comment])
  return (

    <div className='flex p-4 border-b border-slate-300 text-sm gap-2'>
        <div className='flex-shrink-0 mr-0'>
            <img src={user.profilePhotoUrl} alt={user.username} className='w-10 h-10 rounded-full bg-gray-200' />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-semibold mr-1 text-sm truncate'>{user?`@${user.username}`:"Unknown"}</span>
                    <span className='text-gray-500 text-sm'>{moment(comment.createdAt).fromNow()}</span>

                </div>
                <p className='text-slate-600 pb-2'>{comment.content}</p>
                <div className='flex items-center pt-2 text-sm border-t border-slate-300 max-w-fit gap-2'>
                  <button className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && "!text-blue-600"} `} type="button" onClick = {()=>onLike(comment._id)}>
                    <AiFillLike className='text-lg'/>
                  </button>
                <p className='text-gray-400'>
  {comment.numberOfLikes > 0 &&
    `${comment.numberOfLikes} ${comment.numberOfLikes === 1 ? "like" : "likes"}`}
</p>
                </div>
            </div>
        </div>
      

  )
}

export default Comment
