import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

const Advertise = () => {
  return (
    <div className='flex flex-col md:flex-row p-3 border border-teal-600 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
       <div className="flex-1 justify-center flex flex-col p-3 w-full md:w-3/5">
        <h2 className='text-2xl font-semibold text-wrap'>Want to know more about today's <span className='text-red-600'>TOP 10</span> news?</h2>
        <p className='text-gray-500 my-2'>
            Checkout these top news articles!
        </p>
        <Button className="bg-blue-500 text-md mt-5 h-min">
            <Link to={"https://google.com"} target="_blank" rel="noopener norefferer" className='text-wrap'>
            Stay Updated with Daily News: You Go-To Resources
            </Link>
        </Button>
       </div>
       <div className='p-7 w-full md:w-2/5'>
        <img src="https://www.bpmcdn.com/f/files/mapleridge/import/2018-10/13788074_web1_181003-MRN-nfewsprint.jpg;w=960" className='w-full' alt="" />
       </div>
    </div>
  )
}

export default Advertise
