import Advertise from '@/components/shared/Advertise'
import PostCard from '@/components/shared/PostCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, Book } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [posts,setPosts]=useState([]);
  // console.log(post);
  useEffect(()=>{
    const fetchPosts = async ()=>{
        try {
          const res = await fetch("/api/post/getposts?limit=6")
          const data =await res.json();
          if(res.ok)
          setPosts(data.posts);
        } catch (error) {
          console.log(error.message);
        }
    }
    fetchPosts();
  },[])
  return (
    <div>
      <div className='flex gap-6 p-28 flex-col max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold text-blue-800'>
          Welcome to <span className='text-red-600'>TrendSphere</span>
        </h1>
        <p className='text-gray-600 mt-3 text-lg'>
          Your trusted source for the latest headlines, in-depth analysis, and breaking news every morning
        </p>
        <p className='text-gray-500 italic mt-1'>Stay informed, stay ahead.</p>
        <Link to={"/search"}>
          <Button className="bg-yellow-400 hover:bg-yellow-600 text-black py-3 px-6 rounded-full font-semibold shadow-lg flex items-center gap-2 w-fit">
            View All Posts <ArrowRight className='w-5 h-5' />
          </Button>
        </Link>
      </div>

      <section className='pb-16 bg-white'>
        <div className='max-w-7xl mx-auto text-center'>
          <h2 className='text-4xl font-bold mb-8 text-gray-800'>Why You'll Love TrendSphere</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <FeatureCard
              title="Diverse Content"
              description="Explore news on a variety of topics, from technology to lifestyle"
              icon={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            />
            <FeatureCard
              title="Community Driven"
              description="Connect with writers and readers who share your interests."
              icon={"https://cdn-icons-png.flaticon.com/512/1006/1006771.png"}
            />
            <FeatureCard
              title="Easy to Use"
              description="A seamless platform for sharing and discovering great content."
              icon={"https://cdn-icons-png.flaticon.com/512/3215/3215536.png"}
            />
          </div>
        </div>
      </section>
      <div className='p-3 bg-amber-100 '>
        <Advertise/>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {
          posts && posts.length>0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-slate-700 ">Recent Posts</h2>
              <div className='flex flex-wrap gap-4'>
               {
                posts.map((post)=>(
                  <PostCard key={post._id} post={post}/>
                ))
               }
                </div>
            </div>
          )
        }
          <Link to={"/search"} className='text-lg hover:underline text-center font-semibold'> View all news</Link>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className='p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center'>
      <div className='text-5xl mb-4 '>
        {  <img
                    src={icon}
                    alt={title}
                    className="w-16 h-16 mx-auto"
                  />}
      </div>
      <h3 className='text-2xl font-semibold text-gray-800 mb-2'>{title}</h3>
      <p className='text-gray-600 '>{description}</p>
    </div>
  )
}

export default Home
