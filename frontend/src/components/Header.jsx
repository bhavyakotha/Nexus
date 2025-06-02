import React from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6"

const Header = () => {
  //const location = useLocation()
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

        <div className='hidden lg:block'>
          <Search/>
        </div>

        <div className=''>
            <button className='text-primary-100 lg:hidden'>
                <FaRegCircleUser size = {35}/>
            </button>
            <div className="hidden lg:block">
              Login and my cart
            </div>
        </div>
      </div>
    </header>
  )
}

export default Header