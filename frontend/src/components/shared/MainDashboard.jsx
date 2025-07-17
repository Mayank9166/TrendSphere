import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardCard from "./DashboardCard";
import { convertToRead } from "@/lib/utils";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const MainDashboard = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);

  const [totalUser, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchComments();
      fetchPosts();
    }
  }, [currentUser.isAdmin]);

  return (
    <div className="p-3 md:mx-auto">
      {/* Dashboard Cards */}
      <div className="flex flex-wrap justify-center gap-4">
        <DashboardCard
          title={"All Users"}
          description={`${convertToRead(currentUser.createdAt)} - ${convertToRead(Date.now())}`}
          chartConfig={{ users: { label: "users" } }}
          totalValue={totalUser}
          lastMonthValue={lastMonthUsers}
          footerText={"Showing total users of all time"}
          chartData={[{ value: totalUser, fill: "blue" }]}
          endAngle={250}
        />
        <DashboardCard
          title={"All Comments"}
          description={`${convertToRead(currentUser.createdAt)} - ${convertToRead(Date.now())}`}
          chartConfig={{ users: { label: "comments" } }}
          totalValue={totalComments}
          lastMonthValue={lastMonthComments}
          footerText={"Showing total comments of all time"}
          chartData={[{ value: totalComments, fill: "orange" }]}
          endAngle={160}
        />
        <DashboardCard
          title={"All Posts"}
          description={`${convertToRead(currentUser.createdAt)} - ${convertToRead(Date.now())}`}
          chartConfig={{ users: { label: "posts" } }}
          totalValue={totalPosts}
          lastMonthValue={lastMonthPosts}
          footerText={"Showing total posts of all time"}
          chartData={[{ value: totalPosts, fill: "green" }]}
          endAngle={210}
        />
      </div>

      {/* Tables Section */}
      <div className="flex flex-wrap justify-around gap-2 py-3 mx-auto px-8">
        {/* Recent Users */}
        <div className="flex flex-col w-full md:w-[24%] shadow-md rounded-md overflow-x-auto">
          <div className="flex justify-between items-center font-semibold text-sm p-3">
            <h1 className="text-xl font-bold text-slate-700">Recent Users</h1>
            <Button>
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table>
            <TableCaption>A list of your recent users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>User Image</TableHead>
                <TableHead>Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <img
                      src={user.profilePhotoUrl}
                      alt={user.name}
                      className="w-10 h-10 object-cover bg-gray-200 rounded-full"
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recent Comments */}
        <div className="flex flex-col w-full md:w-[24%] shadow-md rounded-md overflow-x-auto">
          <div className="flex justify-between items-center font-semibold text-sm p-3">
            <h1 className="text-xl font-bold text-slate-700">Recent Comments</h1>
            <Button>
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table>
            <TableCaption>A list of your recent comments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell>
                    <p className="line-clamp-2">{comment.content}</p>
                  </TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recent Posts */}
        <div className="flex flex-col w-full md:w-[25%] shadow-md rounded-md overflow-x-auto">
          <div className="flex justify-between items-center font-semibold text-sm p-3">
            <h1 className="text-xl font-bold text-slate-700">Recent Posts</h1>
            <Button>
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table>
            <TableCaption>A list of your recent posts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    <img
                      src={post.image}
                      alt="post"
                      className="w-10 h-10 object-cover bg-gray-200 rounded-full"
                    />
                  </TableCell>
                  <TableCell className="line-clamp-1 max-w-[200px]">
                    {post.title}
                  </TableCell>
                  <TableCell className="whitespace-nowrap w-auto">
                    {post.category}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;