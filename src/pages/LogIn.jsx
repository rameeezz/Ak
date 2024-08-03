import React, { useEffect, useState } from "react";
import BgForLogin from "../assets/bg/bgLogin.jpg";
import "../css/LogIn.css";
import { NavLink } from "react-router-dom";
export default function LogIn() {
  const [checked, setChecked] = useState(false);

  const handleCheckboxClick = () => {
    setChecked(!checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      {/* <img src={BgForLogin} alt="bg" className='bgForLogin'/> */}
      <div className="background">
        <div className="login-form ">
          <h2 className="mb-2">Login</h2>
          <form>
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <div className="checkbox-container" onClick={handleCheckboxClick}>
              <div className={`checkbox-box ${checked ? "checked" : ""}`}>
                {checked && <div className="checkmark">&#10003;</div>}
              </div>
              <label className="checkbox-label">Remember Me</label>
            </div>
            <button type="submit">Login</button>
            <div className="d-flex mt-3 ">
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
          </form>
        </div>
      </div>
    </>
  );
}
