import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./../component/NavBar";
export default function MasterLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
