import React, { useState } from 'react';
import logo from '../../assets/TrendSphere.png';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInstart, signInSuccess } from '@/redux/user/userSlice';
import GoogleAuth from '@/components/shared/GoogleAuth';
const formSchema = z.object({
 
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});
const SignInForm = () => {
  
  const form = useForm({
     resolver: zodResolver(formSchema),
     defaultValues: {
      
       email:"",
       password:"",
     },
   })
 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading,error:errorMessage }= useSelector((state)=>state.user)
 async function onSubmit(values) {
  try {
    dispatch(signInstart());

    const res = await fetch("https://trendsphere-5.onrender.com/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });


    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok || data.success === false) {
      toast("SignIn Failed");
      return dispatch(signInFailure(data?.message || "SignIn failed"));
    }

    dispatch(signInSuccess(data.user)); // assuming your backend sends { success: true, user: {...} }
    toast("SignIn Successfully");
    navigate("/");
  } catch (error) {
    dispatch(signInFailure(error.message));
    toast("Something went wrong");
  }

  form.reset();
}

   return (
     <div className="min-h-screen mt-15 flex flex-col items-center ">
       <div className="w-full md:px-0 flex flex-col md:flex-row justify-evenly items-center">
         {/* Left Section (Hide Logo on Small Screens) */}
         <div className="flex  flex-col  items-center text-center ">
           <img src={logo} alt="TrendSphere Logo" className="hidden md:block w-[350px] h-[300px] object-contain outline-none " />
           <h1 className="mt-2 text-3xl sm:text-3xl font-serif  font-semibold">
             Sign In to your account
           </h1>
           <h1 className="text-gray-600  mt-1 text-[17px] font-serif">
             Welcome back to our community...
           </h1>
         </div>
 
         {/* Right Section */}
         <div className="mt-6 md:mt-0 w-full max-w-md px-4 sm:px-6 md:w-1/4">
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
       
       <FormField
         control={form.control}
         name="email"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Email</FormLabel>
             <FormControl>
               <Input type='email' className="w-full" placeholder="xyz@gmail.com" {...field} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />
       <FormField
         control={form.control}
         name="password"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Password</FormLabel>
             <FormControl>
               <Input className="w-full" type="password" placeholder="password" {...field} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />
       <Button className="w-full  hover:bg-blue-900 cursor-pointer" type="submit" disabled={loading}>
         {loading?(<span className='animate-pulse'>Loading...</span>):(<span>Signin</span>)}
       </Button>
       <GoogleAuth/>
     </form>
   </Form>
   <div className='mt-3'>
     <span className=''>Don't have a account?</span>
     <span className='text-blue-400 ml-2'><Link to={"/sign-up"}>Sign up</Link></span>
   </div>
       {errorMessage && (<p className='text-red-400'>
        {errorMessage}
       </p>)}
 </div>
       
       </div>
     </div>
   );
}

export default SignInForm
