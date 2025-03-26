import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Button } from '../ui/button';
import logo from '../../assets/TrendSphere.png';
import { useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='flex items-center justify-between px-4 py-3 shadow-xl sticky top-0 bg-white z-50'>
      
      {/* Logo Section */}
      <div className='flex items-center gap-2'>
        <img src={logo} alt="Logo" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover' />
        <Link to="/" className="text-lg md:text-xl font-bold">TrendSphere</Link>
      </div>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex gap-6 text-lg'>
        <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
        <li><Link to="/about" className="hover:text-blue-500">About</Link></li>
        <li><Link to="/news" className="hover:text-blue-500">News Articles</Link></li>
      </ul>

      {/* Search Box */}
      <form className='hidden md:flex bg-gray-300 px-3 py-1 rounded-lg items-center'>
        <input type="text" placeholder='Search...' className='focus:outline-none w-[200px] bg-transparent text-sm' />
        <FaSearch className='text-lg text-gray-600 ml-2' />
      </form>

      {/* Profile / Sign In */}
      {currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img src={currentUser.profilePhotoUrl} className='w-9 h-9 rounded-full ml-2 cursor-pointer' alt="User" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuLabel>My Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-semibold text-sm cursor-pointer">
              {currentUser.username}
            </DropdownMenuItem>
            <DropdownMenuItem className="font-semibold text-sm cursor-pointer">
              <Link to={"/dashboard?tab=profile"}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="font-semibold text-sm text-red-500 cursor-pointer">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className="hidden md:flex">
          <Link to={'/sign-in'}>Sign In</Link>
        </Button>
      )}
          
      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          <Link to="/" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/news" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>News Articles</Link>
          
          {/* Sign-In Button */}
          {!currentUser && (
            <Button onClick={() => setIsOpen(false)} className="w-3/4">
              <Link to={'/sign-in'}>Sign In</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;  