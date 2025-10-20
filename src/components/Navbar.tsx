'use client'

import Image from 'next/image'
import React from 'react'
import { BtnSession } from './BtnSession'

const Navbar = () => {
  return (
    <div className='w-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 z-10 fixed h-14 sm:h-16 backdrop-blur-sm bg-white/10'>
      <div className="flex items-center">
        <Image 
          src={'/logo.png'}
          alt='Logo Deli Chicharrones'
          width={40}
          height={40}
          className="sm:w-[50px] sm:h-[50px]"
        />
        <span className="ml-2 font-bold text-amber-800 text-sm sm:text-base hidden sm:block">
          Deli Chicharrones
        </span>
      </div>

      <BtnSession href='/login'>
        <span className="hidden sm:inline">Iniciar Sesión</span>
        <span className="sm:hidden">Entrar</span>
      </BtnSession>
    </div>
  )
}

export default Navbar