import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./../component/NavBar";
import TransitionWrapper from "../routes/TransitionWrapper.jsx";
import { Footer } from "./../component/Footer";
export default function MasterLayout({ user, logOut }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === "admin1") {
      navigate("/admin1");
    }

    if (user?.role === "admin2") {
      navigate("/admin1");
    }

    if (user?.role === "customer") {
      navigate("/admin1");
    }
    if (user?.role === null) {
      navigate("/home");
    }
  }, [user, navigate]);
  return (
    <>
      <NavBar user={user} logOut={logOut} />
      <TransitionWrapper>
        <Outlet />
      </TransitionWrapper>
      <Footer user={user} />
    </>
  );
}
