import React from "react";
import { useLocation } from 'react-router-dom';

export default function HeadOfPages({ user }) {
  const isLoginPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgetPassword"
  return (
    <>
      {/* <div className="d-flex justify-content-center position-relative bg-transparent py-3 ">
        <span className="position-absolute end-14 top-7 responsive-font-size-p">
          <i className="fa-solid fa-cart-shopping text-muted"></i>
        </span>
        <div className="d-flex justify-content-center align-items-center w-100 ">
          <div className="w-50 d-flex justify-content-center align-items-center gap-1 classforResponsive">
            <input
              type="text"
              className="form-control w-75"
              placeholder="What Are You Looking For?"
            />
            <i className="fa-solid fa-magnifying-glass responsive-for-i-head-page text-info"></i>
          </div>
        </div>
      </div> */}
      {user?.role === "admin1" || user?.role === "admin2" ? (
        ""
      ) : isLoginPage? (
       ""
      ) : (
        <div className="d-flex justify-content-center position-relative bg-transparent py-3 ">
          <span className="position-absolute end-14 top-7 responsive-font-size-p">
            <i className="fa-solid fa-cart-shopping text-muted"></i>
          </span>
          <div className="d-flex justify-content-center align-items-center w-100 ">
            <div className="w-50 d-flex justify-content-center align-items-center gap-1 classforResponsive">
              <input
                type="text"
                className="form-control w-75"
                placeholder="What Are You Looking For?"
              />
              <i className="fa-solid fa-magnifying-glass responsive-for-i-head-page text-info cursorPOinter"></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
