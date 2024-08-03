import React from "react";
import "../css/Register.css";
export default function Register() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log("yarab akrmna");
  }
  return (
    <>
      <div className="backgroundBg">
        <div className="login-form">
          <h2 className="mb-2">Register</h2>
          <form>
            <div className="d-flex justify-content-center gap-2">
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
            </div>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="button" onClick={handleSubmit}>
              create
            </button>
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
