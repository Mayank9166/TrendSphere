import React from 'react'

const About = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center'>
      <div className="w-full max-w-6xl px-6 py-12 md:py-16 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
          {/* left */}
          <div className=''>
            <h2 className='font-bold text-gray-800 mb-4 text-3xl'>
              Who we are
            </h2>
            <p className='tex-gray-800 leading-relaxed'>
              We are passionate team to committed to driving change through
              innovation and collaboration. Our platform is designed to empower 
              individuals and organizations to unlock their true potential.
            </p>
          </div>
          {/* right */}
          <div className='relative'>
            <img src="https://images.pexels.com/photos/4057663/pexels-photo-4057663.jpeg" className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" alt="" />
          </div>

        </div>
      </div>
      {/* team section */}
      <div className="w-full bg-gray-100 py-12">
        <h2 className='text-3xl font-bold text-gray-800 text-center mb-8'>Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" alt="Team member" className='w-32 h-32 rounded-full mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-700'>Mayank Saini</h3>
            <p className="text-gray-500 ">CEO</p>
          </div>
          <div className="text-center">
            <img src="https://cdn-icons-png.flaticon.com/128/4140/4140037.png" alt="Team member" className='w-32 h-32 rounded-full mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-700'>Anshu Saini</h3>
            <p className="text-gray-500 ">CTO</p>
          </div>
          <div className="text-center">
            <img src="https://cdn-icons-png.flaticon.com/128/6997/6997662.png" alt="lead Designer" className='w-32 h-32 rounded-full mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-700'>Aneet Padda</h3>
            <p className="text-gray-500 ">Lead Designer</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
