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
const DashboardUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = React.useState([]);
  const [showMore, setShowMore] = React.useState(true);
  const [userIdtoDelete, setUserIdToDelete] = React.useState("");
//   console.log("User Posts:", userPosts);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`https://trendsphere-5.onrender.com/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `https://trendsphere-5.onrender.com/api/user/getusers?startIndex=${startIndex}`
      );
      // console.log("Response:", res);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
  };
    const handleDelete = async ()=>{
           try {
            const res = await fetch(`https://trendsphere-5.onrender.com/api/user/delete/${userIdtoDelete}`,{method:"DELETE"})
              const data = await res.json();
              if(res.ok)
              {
                setUsers((prev)=>prev.filter((user)=>user._id!==userIdtoDelete));
              }
              else
                console.log(data.message);
           } catch (error) {
              console.log(error.message);
           }
    }
  return (
    <div className="flex flex-col items-center justify-center w-full p-3">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table >
            <TableCaption>A list of your recent subscribers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Joined On</TableHead>
                <TableHead>User Image</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
            {users.map((user) => (
                <TableRow key={user._id}  >
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                  
                      <img
                        src={user.profilePhotoUrl}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                      
                   
                  </TableCell>
                  <TableCell>
                  {user.username}
                  </TableCell>
                  <TableCell>
                    <Link>{user.email}</Link>
                  </TableCell>
                    <TableCell>
                            {user.isAdmin? (<FaCheck className="text-green-600"/>): (<RxCross2 className="text-red-600" />)}         
                       </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span  onClick = {()=>{
                          setUserIdToDelete(user._id);
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
                            delete your post and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600"
                            onClick={handleDelete}
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
        <p>You have no subscribers yet</p>
      )}
    </div>
  );
};

export default DashboardUsers;
