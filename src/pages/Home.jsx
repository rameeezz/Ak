import React from 'react'
import akPhoto from '../../public/akIcon.jpg'
import { useNavigate } from 'react-router-dom';
export default function Home({user}) {
  console.log(user);
  
  let navigate = useNavigate()
  function addToCart(){
    if (user == null) {
      console.log("yarab");
      navigate("/login")
    }else{
      alert("نتمنى لكم حياة افضل ")
      
    }
  }
  return (
    <>
    <div className='w-100 h-vh  d-flex justify-content-center align-items-center'>
    <img src={akPhoto} alt="sss" className='w-50 hiegt' />
    </div>
    <div className='d-flex justify-content-center align-items-center'>
    <button onClick={addToCart} className='btn btn-primary p-5 '> add </button>
    </div>
    </>
  )
}
