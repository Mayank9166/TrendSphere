import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { FaCheck } from "react-icons/fa";

import { RxCross2 } from "react-icons/rx";
const DashboardComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = React.useState([]);
  const [showMore, setShowMore] = React.useState(true);
  const [commentIdtoDelete, setCommentIdToDelete] = React.useState("");
//   console.log("User Posts:", userPosts);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comments/getcomments?startIndex=${startIndex}`
      );
      // console.log("Response:", res);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
  };
    const handleDeleteComment = async ()=>{
           try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdtoDelete}`,{method:"DELETE"})
              const data = await res.json();
              if(res.ok)
              {
                setComments((prev)=>prev.filter((comment)=>comment._id!==commentIdtoDelete));
              }
              else
                console.log(data.message);
           } catch (error) {
              console.log(error.message);
           }
    }
  return (
    <div className="flex flex-col items-center justify-center w-full p-3">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table >
            <TableCaption>A list of your recent comments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Date Updated</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Number of Likes</TableHead>
                <TableHead>Post Id</TableHead>
                <TableHead>User Id</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
            {comments.map((comment) => (
                <TableRow key={comment._id}  >
                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                   {comment.content}
                      
                   
                  </TableCell>
                  <TableCell>
                  {comment.numberOfLikes}
                  </TableCell>
                  <TableCell>
                    <Link>{comment.postId}</Link>
                  </TableCell>
                  <TableCell>
                    <Link>{comment.userId}</Link>
                  </TableCell>
                   
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span  onClick = {()=>{
                          setCommentIdToDelete(comment._id);
                        }}className="cursor-pointer font-medicum text-red-600 hover:underline">
                         Delete
                        </span>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your comment and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600"
                            onClick={handleDeleteComment}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                
                </TableRow>
            ))}
            </TableBody>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blue-700 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet</p>
      )}
    </div>
  );
};

export default DashboardComments;
