import React from 'react'
import '../css/NavBar.css'
import { NavLink, Link } from 'react-router-dom'
export default function NavBar() {
  return (
    <>
   <nav className='position-fixed z-2 bg-transparent w-100 text-primary d-flex py-3 gap-5'>
    <NavLink to='home'>Home</NavLink>
   <NavLink to='register' className={  (isActive)=> isActive? "nav-link active":"nav-link"}>Register</NavLink>
   <NavLink to='login' className={  (isActive)=> isActive? "nav-link active":"nav-link"}>login</NavLink>
   </nav>
    </>
  )
}
