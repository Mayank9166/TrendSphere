import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getFilePreview, uploadFile } from '@/lib/appwrite/uploadImage';
import { updateStart, updateSuccess, updateFailure } from '@/redux/user/userSlice';
import { toast } from 'sonner'; // ✅ Import toast from sonner


const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = React.useState(null);
  const [imageFileUrl, setImageFileUrl] = React.useState(currentUser.profilePhotoUrl);
  const [formData, setFormData] = React.useState({});
  const dispatch = useDispatch();
  const profilePicRef = React.useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    console.log("Uploading image:", file);
    if (!file) return currentUser.profilePhotoUrl;
    try {
      const uploadedFile = await uploadFile(file);
    //  console.log("Uploaded file:", uploadedFile);
      return getFilePreview(uploadedFile.$id);
    } catch (error) {
      toast.error("Image upload failed.");
      console.error("Image upload error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      // console.log("hamara image",imageFile);
      const profilePicture = await uploadImage(imageFile);
      // console.log("Profile picture URL:", profilePicture);
      const updateProfile = {
        ...formData,
        profilePicture
      };
        console.log("Update profile data:", currentUser, updateProfile);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateProfile),
      });

      const data = await res.json();
      console.log("Update response:", data);
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        toast.error("Update failed. Please try again.");
      } else {
        dispatch(updateSuccess(data));
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error("Update failed. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Update Your Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={profilePicRef}
          onChange={handleImageChange}
        />
        <div
          className="w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full"
          onClick={() => profilePicRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.profilePhotoUrl}
            alt="Profile"
            className="rounded-full w-full h-full border-5 border-gray-200"
          />
        </div>

        <Input id="username" type="text" placeholder="Username" defaultValue={currentUser.username} onChange={handleChange} />
        <Input id="email" type="email" placeholder="Email" defaultValue={currentUser.email} onChange={handleChange} />
        <Input id="password" type="password" placeholder="Password" onChange={handleChange} />

        <Button type="submit" className="h-12 bg-green-600">Update Profile</Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5 cursor-pointer">
        <span>Delete Account</span>
        <span>Sign Out</span>
      </div>
    </div>
  );
};

export default DashboardProfile;
