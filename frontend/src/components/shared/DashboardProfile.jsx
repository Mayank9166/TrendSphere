import React from 'react'
import { useSelector } from 'react-redux'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const DashboardProfile = () => {
  const {currentUser} = useSelector((state) => state.user)
  const [imageFile, setImageFile] = React.useState(null);
  const [imageFileUrl, setImageFileUrl] = React.useState(currentUser.profilePhotoUrl);
  // console.log(imageUrl);
  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      
    }
  }
  const profilePicRef = React.useRef(null);
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Update Your Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" accept='image/*' hidden ref={profilePicRef} onChange={handleImageChange}/>
        <div className='w-32 h-32 self-center cursor-pointer  overflow-hidden rounded-full'>
          <img src={imageFileUrl?imageFileUrl:currentUser.profilePhotoUrl} alt="Profile" className='rounded-full w-full h-full border-5 border-gray-200'
          onClick={() => profilePicRef.current.click()}/>
        </div>
        
        <Input type="text" placeholder='username' defaultValue={currentUser.username} className='h-12 border-slate-400 outline:none focus-visible:ring-0'  id="username"/>
        <Input type="email" placeholder='email' defaultValue={currentUser.email} className='h-12 border-slate-400 outline:none focus-visible:ring-0'  id="email"/>
        <Input type="password"  placeholder="Password" className='h-12 border-slate-400 outline:none focus-visible:ring-0'  id="password"/>
        <Button type="submit" className="h-12 bg-green-600">Update Profile</Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5 cursor-pointer'>
        <span className=''>Delete Account</span>
        <span >Sign Out</span>
      </div>
    </div>
   
  )
}

export default DashboardProfile
