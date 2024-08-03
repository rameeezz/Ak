import React, { useEffect, useState } from "react";
import BgForLogin from "../assets/bg/bgLogin.jpg";
import "../css/LogIn.css";
import { NavLink, Link } from "react-router-dom";
export default function LogIn() {
  const [checked, setChecked] = useState(false);

  const handleCheckboxClick = () => {
    setChecked(!checked);
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log("yarab akrmna");
  }
  return (
    <>
      {/* <img src={BgForLogin} alt="bg" className='bgForLogin'/> */}
      <div className="background">
        <div className="login-form">
          <h2 className="mb-2">Login</h2>
          <form>
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <div
              className="checkbox-container mb-2"
              onClick={handleCheckboxClick}
            >
              <div className={`checkbox-box ${checked ? "checked" : ""}`}>
                {checked && <div className="checkmark">&#10003;</div>}
              </div>
              <label className="checkbox-label">Remember Me</label>
            </div>
            <div className="d-flex flex-column align-items-start">
              <button type="button" onClick={handleSubmit} className="">
                Login
              </button>
              <Link className="sizeOfFontNav" to="/forgetPassword">
                Forgot Password?
              </Link>
            </div>
            <div className="d-flex mt-2 ">
              <span className="text-black textSizeForSpan">
                Don't have an account?
              </span>
              <NavLink
                to="/register"
                className="ms-2 sizeOfFontNav text-primary"
              >
                Create Account
              </NavLink>
            </div>
            <div className="d-flex justify-content-center mt-3">
            <div className="styleLineBetweenItems"></div>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-3 ">
            <i className="fa-brands fa-google text-success sizeOfI CursorPointer"></i>
            <i className="fa-brands fa-facebook sizeOfI CursorPointer text-primary"></i>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
