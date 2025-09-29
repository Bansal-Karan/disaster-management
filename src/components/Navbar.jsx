import React from 'react'
import Logo from '../assets/logo.png'

const links = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'News',
    path: '/news',
  },
  {
    name: 'Safe Zones',
    path: '/safezones',
  },
  {
    name: 'SOS Requests',
    path: '/sosrequests',
  },
  {
    name: 'Resources',
    path: '/resources',
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    name: 'login',
    path: '/login',
  },
] 

const Navbar = () => {
  return (
    <div className='fixed top-0 left-0 w-full sm:px-20 px-6 bg-[#3C467B] shadow-md justify-between flex  py-4 z-50'>
      <div>
        <img src={Logo} alt="logo" className='w-10 h-10 object-contain rounded-md' />
      </div>
      <div className='flex gap-8 sm:gap-12 py-2'>
        {links.map(({ name, path }, index) => (
          <a key={index}
            href={path}>
            <span>{name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Navbar