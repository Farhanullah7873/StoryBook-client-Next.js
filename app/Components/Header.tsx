import React from 'react'


const Header = () => {

   

    
    return (
        <div className='sticky top-0 text-white flex justify-between items-center py-4 px-8'>
            {/* Left Side */}
            <div className=' text-4xl font-extrabold'>
                <a href="http://localhost:5173/"> Little Dreamers</a>
            </div>
            {/* Right Side */}
            <div className='flex items-center gap-x-2'>
                <div className='relative'>

                    

                   
                </div>
                <div className='flex bg-[#00033A]  rounded gap-x-2'>
                    <div className='hover:bg-[#10BDE5] hover:cursor-pointer px-[14px] py-[10px] rounded'>
                        Home
                    </div>
                    <div className='hover:bg-[#10BDE5] hover:cursor-pointer px-[14px] py-[10px] rounded'>
                        MyBooks
                    </div>
                    <div className='hover:bg-[#10BDE5] hover:cursor-pointer px-[14px] py-[10px] rounded'>
                        Blogs
                    </div>
                    <div className='hover:bg-[#10BDE5] hover:cursor-pointer px-[14px] py-[10px] rounded'>
                        Features
                    </div >
                   
                   
                </div>
            </div>
        </div>
    )
}

export default Header