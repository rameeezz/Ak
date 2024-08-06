import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./../component/NavBar";
import TransitionWrapper from "../routes/TransitionWrapper.jsx"; 
export default function MasterLayout({user , logOut}) {
  return (
    <>
      <NavBar user={user} logOut ={ logOut} />
      <TransitionWrapper>
        <Outlet /> 
      </TransitionWrapper>
    </>
  );
}
