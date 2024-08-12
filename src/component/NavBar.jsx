import React, { useEffect, useState } from "react";
import "../css/NavBar.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
export default function NavBar({ user, logOut }) {
  let navigate = useNavigate()
  function goOutt() {
    navigate("/admin1")
  }
  const[activeNav , setActiveNav] = useState(false)
  function openNav() {
    setActiveNav(true)
  }
  function CloseNav() {
    setActiveNav(false)
  }
  return (
    <>
    <div onClick={openNav} className="position-fixed z-3 bg-transparent start-5 top-5  d-flex flex-column gap-1 justify-content-center p-3 cursorPOinter">
      <div className="styleFOrNav shadow"></div>
      <div className="styleFOrNav shadow"></div>
      <div className="styleFOrNav shadow"></div>
    </div>
      {user?.role == "admin1" || user?.role == "admin2" ? "" :  <div  className= {`position-fixed styleOfNavToGetOut bgForNav ${activeNav == false ? "" : "active"}`}>
      <div onClick={CloseNav} className="btn btn-close position-absolute  end-5 top-5"></div>
      <div className="text-white d-flex justify-content-center mt-5">
      <Link  to="home">Home</Link>
      </div>
      <p className="my-3 text-center text-white">category</p>  
      <p className="my-3 text-center text-white">category</p>  
      <p className="my-3 text-center text-white">category</p>  
      <p className="my-3 text-center text-white">category</p>  
      <p className="my-3 text-center text-white">category</p>  
      <p className="my-3 text-center text-white">category</p>  
      <p className="my-3 text-center text-white">category</p>  
      <p className="my-3 text-center text-white">category</p>  
      {user != null ? (
          <div className="d-flex justify-content-center text-white">
            <button onClick={logOut}>log out</button>
          </div>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <NavLink
              to="register"
              className={(isActive) =>
                isActive ? "nav-link active text-white" : "nav-link text-white"
              }
            >
              Register
            </NavLink>
            <NavLink
              to="login"
              className={(isActive) =>
                isActive ? "nav-link active text-white" : "nav-link text-white"
              }
            >
              login
            </NavLink>
          </div>
        )}
    </div>
}
      
    </>
  );
}
