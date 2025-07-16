import React from 'react'
import { Link } from 'react-router-dom'
import { FaComments, FaSignOutAlt, FaUserAlt, FaUsers } from "react-icons/fa";
import { IoIosCreate, IoIosDocument } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '@/redux/user/userSlice';

const DashboardSidebar = () => {
   const dispatch = useDispatch();
    const {currentUser} = useSelector((state)=>state.user)
    const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      console.log("Signout response:", data);
      if (!res.ok) {
        console.error("Signout failed:", data.message);
      }
      else{
        dispatch(signoutSuccess());
      }
    }
      catch (error) {
        console.error("Error signing out:", error);
      }
    }
  return (
  <aside className='h-screen w-64 bg-slate-200 flex flex-col '>
      {/* Header */}
      <div className='p-4 flex items-center justify-center bg-slate-200'>
        <h1 className='text-2xl font-bold '> Dashboard</h1>
      </div>
      {/* Navigation */}
      <nav>
        <ul className='flex-1 p-4'>
          <li>
            <Link to={"/dashboard?tab=profile"} className='flex items-center p-2 hover:bg-slate-300 rounded cursor-pointer'>
            <FaUserAlt className='mr-3' />
            <span>Profile</span>
             </Link>
          </li>
          { currentUser && currentUser.isAdmin && (
          <li>
            <Link to={"/create-post"} className='flex items-center p-2 hover:bg-slate-300 rounded cursor-pointer'>
             <IoIosCreate className='mr-3' />
              <span className='mr-3'>Create Post</span>
            </Link> 
          </li>
          )}
          { currentUser && currentUser.isAdmin && (
          <li>
            <Link to={"/dashboard?tab=posts"} className='flex items-center p-2 hover:bg-slate-300 rounded cursor-pointer'>
             <IoIosDocument className='mr-3' />
              <span className='mr-3'>Your articles</span>
            </Link> 
          </li>
          )}
          { currentUser && currentUser.isAdmin && (
          <li>
            <Link to={"/dashboard?tab=users"} className='flex items-center p-2 hover:bg-slate-300 rounded cursor-pointer'>
             <FaUsers className='mr-3' />
              <span className='mr-3'>All Users</span>
            </Link> 
          </li>
          )}
          { currentUser && currentUser.isAdmin && (
          <li>
            <Link to={"/dashboard?tab=comments"} className='flex items-center p-2 hover:bg-slate-300 rounded cursor-pointer'>
             <FaComments className='mr-3' />
              <span className='mr-3'>All Comments</span>
            </Link> 
          </li>
          )}

        </ul>
        <div className='p-4 border-t border-gray-700 '>
          <button className='flex items-center w-full p-2 hover:bg-slate-300 rounded cursor-pointer' onClick={handleSignout}>
            <FaSignOutAlt  className='mr-3' />
            <span >Logout</span>
          </button>
        </div>
      </nav>
  </aside>
  )
}

export default DashboardSidebar
