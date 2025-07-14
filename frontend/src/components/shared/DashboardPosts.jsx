import React, { use, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Link } from 'react-router-dom';
import { set } from 'zod';


const DashboardPosts = () => {
  const {currentUser} = useSelector((state)=>state.user);
  const [userPosts, setUserPosts] = React.useState([]);
  const [showMore, setShowMore] = React.useState(true);
  console.log("User Posts:", userPosts);
   useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json();
        if(res.ok)
        {
          setUserPosts(data.posts);
           if(data.posts.length < 9)
          {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    if(currentUser.isAdmin)
    {
      fetchPosts();
    }
   },[currentUser._id])
   const handleShowMore =  async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      // console.log("Response:", res);
      const data = await res.json();
      if(res.ok){
        setUserPosts((prev)=>[...prev,...data.posts]);
        if(data.posts.length < 2)
        {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    }
   }
  return (
    <div className='flex flex-col items-center justify-center w-full p-3'>
     {currentUser.isAdmin && userPosts.length > 0 ? (
       <>
       <Table>
        <TableCaption>
           A list of your published articles.
        </TableCaption>
        <TableHeader>
          <TableRow>
                <TableHead className="w-[200px]">Date Updated</TableHead>
                <TableHead>Post Image</TableHead>
                <TableHead>Post Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Delete</TableHead>
                <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
         {userPosts.map((post) => (
              <TableBody className="divide-y">
                 <TableRow key ={post._id}>
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                      <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-20 object-cover bg-gray-500" />
                      </Link>
                  </TableCell>
                  <TableCell>
                      <Link to={`/post/${post.slug}`}>
                       {post.title}
                      </Link>
                  </TableCell>
                  <TableCell>
                      <Link>
                       {post.category}
                      </Link>
                  </TableCell>
                  <TableCell>
                      <span className='font-medium text-red-500 hover:underline cursor-pointer'>
                        Delete
                      </span>
                      
                  </TableCell>
                  <TableCell>
                        <Link to={`/update-post/${post._id}`} className='font-medium text-green-600 hover:underline cursor-pointer'>
                        <span>Edit</span></Link>
                  </TableCell>
                 </TableRow>

              </TableBody>
         ))}
       </Table>
       {showMore && (
        <button onClick={handleShowMore} className="w-full text-blue-700 self-center text-sm py-7">Show more</button>)}
       </>
  )  :(<p>You have no posts yet</p>)
        }
    </div>
  )
}

export default DashboardPosts;