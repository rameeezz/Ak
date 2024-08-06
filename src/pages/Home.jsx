import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/Home.css'
export default function Home({ user }) {
  console.log(user);

  let navigate = useNavigate();
  function addToCart() {
    if (user == null) {
      console.log("yarab");
      navigate("/login");
    } else {
      alert("نتمنى لكم حياة افضل ");
    }
  }
  return (
    <>
      {/* <h1 className="text-center text-primary  my-5">Ak florist</h1> */}
      <div className="TOGoUnderNav"></div>
      <div className="d-flex justify-content-center align-items-center my-5">
        <button>
          <i className="fa solid fa-spinner fa-spin textSize"></i>
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <button onClick={addToCart} className="btn btn-primary p-4 ">
          {" "}
          add{" "}
        </button>
      </div>
    </>
  );
}
