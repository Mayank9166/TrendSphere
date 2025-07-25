import { Input } from '@/components/ui/input';

import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import PostCard from '@/components/shared/PostCard';
import { IoMdReturnLeft } from 'react-icons/io';

const NewsArticle = () => {
    const [sidebarData,setSidebarData]=useState({
        searchTerm :"",
        sort:"",
        category:""
    });
    const location = useLocation();
    const [posts,setPosts]=useState([]);
    // console.log(sidebarData);
    // console.log(post);
    const navigate = useNavigate();
    const [loading,setLoading]=useState(false);
    const [showMore,setShowMore]=useState(false);
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl  = urlParams.get("sort");
        const categoryFromUrl = urlParams.get("category");
        console.log(searchTermFromUrl);
        if(searchTermFromUrl||sortFromUrl||categoryFromUrl)
        {
            setSidebarData({...sidebarData,
                searchTerm:searchTermFromUrl||"",
                sort:sortFromUrl||"",
                category:categoryFromUrl||""
            })
        }
        const fetchPosts = async ()=>{
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`https://trendsphere-5.onrender.com/api/post/getposts?${searchQuery}`);
            if(!res.ok)
            {
                setLoading(false);
                return;
            }
            if(res.ok)
            {
                
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if(data.posts.length===9)
                {
                  setShowMore(true);
                }else
                    setShowMore(false);
            }
        }
        fetchPosts();
    },[location.search])
    const handleChange = async(e)=>{
        if(e.target.id ==="searchTerm" )
        {
            setSidebarData({...sidebarData,searchTerm:e.target.value})
            return;
        }

    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm",sidebarData.searchTerm);
        urlParams.set("sort",sidebarData.sort);
        urlParams.set("category",sidebarData.category);
        const searchQuery = urlParams.toString();
        sidebarData.searchTerm="";
        sidebarData.sort="";
        sidebarData.category="";
        navigate(`/search?${searchQuery}`);
    }
    const handleShowMore = async ()=>{
        const numberofPost = posts.length;
        const startIndex =numberofPost;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex",startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if(!res.ok)
        {
            return;
        }
        if(res.ok)
        {
            const data= await res.json();
            setPosts([...posts,...data.posts]);
            if(data.posts.length>9)
            {
              setShowMore(true)
            }
            else
                setShowMore(false);
        }
    }
  return (
    <div className='flex flex-col md:flex-row '>
      {/* sidebar */}
      <aside className='p-6 md:w-1/4 bg-white shadow-md border-r border-gray-300 '>
      <form className='flex flex-col gap-6 ' onSubmit ={handleSubmit}>
    <h2 className='text-2xl font-semibold text-gray-600 '>Filters</h2>
    {/* searchInput */}
    <div className="flex flex-col gap-2">
        <label className='font-medium text-gray-600'>Search Term:</label>
        <Input placeholder="Search..." id = "searchTerm" type="text" className="border-gray-300 rounded-md" value={sidebarData.searchTerm} onChange={handleChange}/>
         
    </div>
       <div className="flex flex-col gap-2">
        <label className='font-medium text-gray-600'>Sort By:</label>
        <Select onValueChange = {(value)=>{
            setSidebarData({...sidebarData,sort:value});
        }} value={sidebarData.sort}>
  <SelectTrigger className="w-full border border-slate-400  ">
    <SelectValue placeholder="Select Order" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
        <SelectLabel>Order by:</SelectLabel>
    <SelectItem value="desc">Latest</SelectItem>
    <SelectItem value="asc">Oldest</SelectItem>
 
    </SelectGroup>
  </SelectContent>
</Select>
        </div>
       <div className="flex flex-col gap-2">
        <label className='font-medium text-gray-600'>Category:</label>
        <Select onValueChange = {(value)=>{
            setSidebarData({...sidebarData,category:value});
        }} value={sidebarData.category}>
  <SelectTrigger className="w-full border border-slate-400  ">
    <SelectValue placeholder="Select a Category" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
        <SelectLabel>Category: </SelectLabel>
    <SelectItem value="worldnews">World News</SelectItem>
    <SelectItem value="sportsnews">Sports News</SelectItem>
    <SelectItem value="localnews">Local News</SelectItem>
 
    </SelectGroup>
  </SelectContent>
</Select>
        </div>

        <Button type="submit" className="bg-red-500 text-white py-2 px-4 rounded-md shadow-lg " >Apply Filters</Button>
      </form>
      </aside>
      <div className="w-full">
        <h1 className='text-2xl font-semibold text-slate-700 p-4 mt-5'> News Articles:</h1>
        <Separator className={"bg-slate-300"}/>
        <div className="p-7 flex flex-wrap gap-4">
            {!loading && posts.length==0 && (<p className='text-xl text-gray-500 '>No posts found.</p>)}
            {loading && (
                 <p className='text-xl text-gray-500 animate-pulse'>Loading...</p>
            )}
            {
                !loading && posts && posts.map((post=>(
                    <PostCard id={post._id} post={post}/>
                )))
            }
            {showMore && (
                <button onclick={handleShowMore} className="text-slate-800 text-lg hover:underline p-7 w-full ">Show More</button>
            )}
        </div>

      </div>
    </div>
  )
}

export default NewsArticle
