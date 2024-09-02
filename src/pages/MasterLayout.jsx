import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./../component/NavBar";
import TransitionWrapper from "../routes/TransitionWrapper.jsx";
import { Footer } from "./../component/Footer";
import HeadOfPages from './HeadOfPages';
export default function MasterLayout({ user, logOut }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === "admin1") {
      navigate("/admin1");
    }

    if (user?.role === "admin2") {
      navigate("/admin2");
    }
    if (user?.role === null) {
      navigate("/home");
    }
  }, [user, navigate]);
  function arrowUp() {
    window.scrollTo(0, 0);
  }
  return (
    <>
      <NavBar user={user} logOut={logOut} />
      <HeadOfPages user={user}/>
      <TransitionWrapper>
        <Outlet />
      </TransitionWrapper>
      <i
        onClick={arrowUp}
        className="fa-solid fa-circle-arrow-up text-danger responsive-For-I fs-2 z-3 "
      ></i>
      <Footer user={user} />
    </>
  );
}
