import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/appContext';

const Headers = () => {

  const { userData , isLoggedIn } = useContext(AppContent);

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt=""  className='w-36 h-36 rounded-full mb-6'/>
        <h1 className='flex gap-2 items-center text-xl sm:text-3xl font-medium mb-3'>Hey {isLoggedIn && userData ? userData.name : "Developer"}
            <img src={assets.hand_wave} alt="" className='w-8 aspect-square'/>
        </h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Our Service</h2>
        <p className='mb-8 max-w-md'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit ducimus, unde, iure obcaecati recusandae </p>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Headers