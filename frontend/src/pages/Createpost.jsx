import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getFilePreview, uploadFile } from '@/lib/appwrite/uploadImage';
import { toast } from 'sonner';

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useNavigate } from 'react-router-dom';
const Createpost = () => {
  const [file, setFile] = React.useState(null);
  const [formData, setFormData] = React.useState({});
  const navigate = useNavigate();
  // console.log("Form Data:", formData);
  const [uploadImageError, setUploadImageError] = React.useState(null);
  const [imageUploading,setImageUploading] = React.useState(false);
  const [createPostError, setCreatePostError] = React.useState(null);
  const handleUploadImage = async () => {
     try {
        if(!file) {
          setUploadImageError("Please select an image to upload.");
          toast.error("Please select an image to upload.");
          return;
        }
        setImageUploading(true);
        setUploadImageError(null);
        const uploadedFile = await uploadFile(file);
        const postImageUrl = getFilePreview(uploadedFile.$id);
        setFormData((prev) => ({
          ...prev,
          image: postImageUrl
        }));
        toast("Image uploaded successfully.");
        if(postImageUrl)
        setImageUploading(false);
     } catch (error) {
      setUploadImageError("Image upload failed. Please try again.");
      console.error("Image upload error:", error);
      toast("Image upload failed. Please try again.");
      setImageUploading(false);
     }
  }
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const res = await fetch ('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(formData)
      });
      const data = await res.json();  
      console.log("Create post response:", data);
      if (!res.ok) {
        toast.error("Post creation failed. Please try again.");
        setCreatePostError(data.message );
        return;
      }
      if(res.ok){
        toast.success("Post created successfully.");
        setCreatePostError(null);
        navigate(`/post/${data.slug}`);
      }

    } catch (error) {
        toast.error("Post creation failed. Please try again.");
        setCreatePostError("Post creation failed. Please try again.");
    }
  }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold my-7 text-slate-700">
        Create a Post
      </h1>
      <form className="flex flex-col gap-4" onSubmit = {handleSubmit}>
       <div className="flex flex-col gap-4 sm:flex-row justify-between">
  <Input
    type="text"
    placeholder="Title"
    required
    id="title"
    className="w-full sm:w-3/4 h-10 text-sm border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
    onChange = {(e) => setFormData({ ...formData, title: e.target.value })}
  />
  <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
    <SelectTrigger
      className="w-full sm:w-1/4 h-10  border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 "
    >
      <SelectValue placeholder="Select a Category" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Category</SelectLabel>
        <SelectItem value="worldnews">World News</SelectItem>
        <SelectItem value="sportsnews">Sports News</SelectItem>
        <SelectItem value="localnews">Local News</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>
<div className='flex gap-4 items-center justify between border-4 border-slate-600 border-dotted p-3'>
  <Input type="file" accept = "image/*"  onChange = {(e) => setFile(e.target.files[0])}/>
  <Button type = "button" onClick = {handleUploadImage} className="bg-slate-700">
    {imageUploading? "Uploading...":"Upload Image"}
   
    </Button>
</div>
{
  uploadImageError && (
    <p className="text-red-600 ">{uploadImageError}</p>
  )

}
{
  formData.image && (
    <img src= {formData.image} alt = "upload" className='w-full h-72 object-cover'/>
  )
}
<ReactQuill theme="snow" placeholder='Write something here...' className='h-72 mb-12' required onChange={(value) => setFormData({...formData,content:value})}/>
<Button type="submit" className="h-12 bg-green-600 font-semibold max-sm:mt-5 text-md">Publish Your Article</Button>
{ createPostError && (<p className='text-red-600 mt-5'> {createPostError}</p>)}
      </form>
    </div>
  );
};

export default Createpost;
