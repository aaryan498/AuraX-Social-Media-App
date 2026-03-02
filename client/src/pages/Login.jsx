import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import {SignIn} from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
        {/* Background Image */}
        <img className='absolute top-0 left-0 -z-1 w-full h-full object-cover' src={assets.background_img} alt="" />
    

        {/* Left side : Branding */}
        <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
            <img src={assets.logo} className='h-12 object-contain' alt="" />
            <div>
                <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
                    <img src={assets.group_users} className='h-8 md:h-10' alt="" />
                    <div >
                        <div className='flex'>
                            {Array(4).fill(0).map((_, i)=>(<Star className='size-4 md:size-4.5 text-transparent fill-orange-500' key={i}/>))}                            
                            {Array(1).fill(0).map((_, i)=>(<Star className='size-4 md:size-4.5 text-transparent fill-gray-400' key={i}/>))}                            
                        </div>
                        <p className='text-gray-400'>Used by 1K+ developers</p>
                    </div>
                </div>
                <h1 className='text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-green-500 to-indigo-800 bg-clip-text text-transparent'>More than just friends truly connect.</h1>
                <p className='text-xl md:text-3xl bg-gradient-to-r from-purple-700 to-yellow-400 bg-clip-text text-transparent max-w-72 md:max-w-md'>Connect with global community on Vanilla.</p>
            </div>
            <span className='md:h-10'></span>
        </div>

        {/* Right Side : Login Form */}
        <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
            <SignIn/>
        </div>

    </div>
  )
}

export default Login