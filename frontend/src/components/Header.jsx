import React, { useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6"
import { BsCart4 } from "react-icons/bs";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu'

const Header = () => {
  //const location = useLocation()
  const user = useSelector((state) => state?.user)
  const navigate = useNavigate()
  const [openUserMenu, setOpenUserMenu] = useState(false)

  const redirectToLoginPage = ()=>{
        navigate("/login")
    }

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false)
  }

  return (
    <header className='h-20 shadow-md sticky top-0 bg-[#D3D3FF]'>
      <div className='container mx-auto flex items-center h-full px-4 justify-between'>
        <div className='h-full'>
          <Link tp ={"/"} className='h-full flex justify-center items-center'>
            <img
              src={logo}
              width = {100}
              height = "auto"
              alt = 'logo'
              className="hidden lg:block mt-4"
            />
            <img
              src={logo}
              width = {100}
              height = "auto"
              alt = 'logo'
              className="lg:hidden mt-4"
            />
          </Link>
        </div>

        <div className='lg:block'>
          <Search/>
        </div>

            <div className=''>
                                    <button className='text-neutral-600 lg:hidden' >
                                        <FaRegCircleUser size={26}/>
                                    </button>

                                    <div className='hidden lg:flex  items-center gap-10'>
                                        {
                                          user?._id? (
                                            <div className='relative'>
                                                <div onClick={() => setOpenUserMenu(prev => !prev)} className='flex select-none items-center gap-2 cursor-pointer'>
                                                  <p>Account</p>
                                                  {
                                                    openUserMenu ? (
                                                      <GoTriangleUp size={25}/>
                                                    ) : (
                                                      <GoTriangleDown size={25}/>
                                                    )
                                                  }
                                                  
                                                </div>
                                                {
                                                  openUserMenu && (
                                                    <div className='absolute right-0 top-10'>
                                                    <div className='bg-white rounded p-4 w-52 lg:shadow-lg'>
                                                        <UserMenu close = {handleCloseUserMenu}/>
                                                    </div>
                                                </div>
                                                  )
                                                }
                                                
                                            </div>
                                          ) : (
                                            <button onClick = {redirectToLoginPage} className='text-lg px-2'>Login</button>
                                          )
                                        }
                                        
                                        <button className='flex items-center gap-2 bg-primary-100 hover:bg-primary-200 px-3 py-2 rounded text-white'>
                                            <div className='animate-bounce'>
                                                <BsCart4 size={26}/>
                                            </div>
                                            <div className='font-semibold text-sm'>
                                               My Cart
                                            </div>    
                                        </button>
                                    </div>
                                </div>
        </div>
    
    </header>
  )
}

export default Header