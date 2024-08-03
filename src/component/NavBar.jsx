import React from 'react'
import '../css/NavBar.css'
import { NavLink, Link } from 'react-router-dom'
export default function NavBar() {
  return (
    <>
   <nav className='position-fixed z-2 bg-black w-100'>
   <NavLink to='register' className={  (isActive)=> isActive? "nav-link active":"nav-link"}>Register</NavLink>
   <NavLink to='login' className={  (isActive)=> isActive? "nav-link active":"nav-link"}>login</NavLink>
   </nav>
    </>
  )
}
