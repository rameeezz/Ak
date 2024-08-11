import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Admin2({logOut}) {
    let navigate = useNavigate();
  function GoTOLOgin() {
    navigate("/login");
    logOut();
  }
  return (
    <>
    <div className=" position-fixed end-2 rounded-circle bg-danger top-5">
          <button className=" p-3  text-white" onClick={GoTOLOgin}>
          <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
    <div className="TOGoUnderNav"></div>
    <div className="d-flex justify-content-center align-items-center my-5">
        <button>
          <i className="fa solid fa-spinner fa-spin textSize"></i>
        </button>
      </div>
      
    </>
  )
}
