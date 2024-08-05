import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin1({logOut}) {
  let navigate = useNavigate()
 function GoTOLOgin() {
  navigate("/login")
  logOut()
 }
  return (
    <>
    <h1>admin</h1>
    <div className='d-flex justify-content-center align-items-center'>
      <button className='btn btn-primary p-4' onClick={GoTOLOgin}> logout </button>
    </div>
    </>
  )
}
