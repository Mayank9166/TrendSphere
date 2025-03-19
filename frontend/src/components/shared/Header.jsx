import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Button } from '../ui/button';
import logo from '../../assets/TrendSphere.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='flex items-center justify-between p-4 shadow-xl sticky top-0 bg-white'>
      {/* Logo Section */}
      <div className='flex items-center gap-2'>
        <img src={logo} alt="Logo" className='w-[50px] h-[50px] object-cover' />
        <Link to="/" className="text-xl font-bold">TrendSphere</Link>
      </div>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex gap-6 text-lg'>
        <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
        <li><Link to="/about" className="hover:text-blue-500">About</Link></li>
        <li><Link to="/news" className="hover:text-blue-500">News Articles</Link></li>
      </ul>

      {/* Search Box */}
     
        <form action="" className='hidden md:flex bg-gray-300 p-2 rounded-lg items-center'>
        <input type="text" placeholder='Search...' className='focus:outline-none w-[220px] bg-transparent' />
         <FaSearch className='text-xl text-gray-600' />
        </form>
      

      {/* Sign-In Button */}
      <Button className="hidden md:flex">
        <Link to={'/sign-in'}>Sign In</Link>
      </Button>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes className='focus:outline-none' /> : <FaBars className='focus:outline-none'/>}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center gap-4 py-4">
          <Link to="/" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/news" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>News Articles</Link>

          {/* Search Box
          <div className='bg-gray-300 p-2 rounded-lg flex items-center w-3/4'>
            <input type="text" placeholder='Search...' className='focus:outline-none w-full bg-transparent' />
            <FaSearch className='text-xl text-gray-600' />
          </div> */}

          {/* Sign-In Button */}
          <Button onClick={() => setIsOpen(false)} className="w-3/4">
            <Link to={'/sign-in'} >Sign In</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}

export default Header;
