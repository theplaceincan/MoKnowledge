'use client'

import DarkModeToggle from "./DarkModeToggle"
import Image from "next/image"

export default function Navbar() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex justify-between w-full max-w-300 p-5 m-5 shadow-sm rounded-4xl border border-zinc-200">
        <div className="flex items-center justify-center">
          <a href={'/'}>
            <div className="flex items-center justify-center space-x-3">
              <Image src={'/logo.avif'} width={28} height={28} alt="logo" />
              <Image src={'/text.avif'} width={90} height={90} alt="logo" />
            </div>
          </a>
        </div>
        <div>
          <div className="ml-13">
            <a className="text-zinc-500" href={'/knowledge/view'}>View Base</a>
          </div>
          {/* <DarkModeToggle /> */}
        </div>
      </div>
    </div>
  )
}