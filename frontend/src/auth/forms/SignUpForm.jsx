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
import GoogleAuth from '@/components/shared/GoogleAuth';
const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});
const SignUpForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email:"",
      password:"",
    },
  })
   const [loading, setloading] = useState(false)
   const [errorMessage, seterrorMessage] = useState(null)
   const navigate = useNavigate();

  async function onSubmit(values) {
    try {
      setloading(true)
      seterrorMessage(null)
      const res = await fetch("/api/auth/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(values)
      })
      const data = await res.json();
      if(data.success === false)
      {
        setloading(false)
        toast("This username or email is already taken. Try another")
       return  seterrorMessage(data.message)
      }
      if(res.ok)
      {
        setloading(false)
        toast("Sigup Successfully")
        navigate("/sign-in")
      }
    } catch (error) {
      seterrorMessage(error.message);
      setloading(false);
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
            Create a new account
          </h1>
          <h1 className="text-gray-600  mt-1 text-[17px] font-serif">
            Welcome to our amazing community
          </h1>
        </div>

        {/* Right Section */}
        <div className="mt-6 md:mt-0 w-full max-w-md px-4 sm:px-6 md:w-1/4">
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input type="text" className="w-full" placeholder="Username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
        {loading?(<span className='animate-pulse'>Loading...</span>):(<span>Signup</span>)}
      </Button>
      <GoogleAuth/>
    </form>
  </Form>
  <div className='mt-3'>
    <span className=''>Have a account?</span>
    <span className='text-blue-400 ml-2'><Link to={"/sign-in"}>Sign In</Link></span>
  </div>
      
</div>
      
      </div>
    </div>
  );
};
export default SignUpForm