'use client'

import Image from 'next/image'
import React from 'react'
import { BtnSession } from './BtnSession'

const Navbar = () => {
  return (
        <div
            className='w-full flex items-center content-center justify-between px-20 z-10 fixed h-16 backdrop-blur-sm'
        >
            <Image 
                src={'/logo.png'}
                alt='Logo'
                width={50}
                height={50}
            />

            <BtnSession href='/dashboard'>Iniciar Sesión</BtnSession>
        </div>
    )
}

export default Navbar