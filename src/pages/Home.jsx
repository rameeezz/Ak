import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import bg from '../assets/bg/imresizer-1724329258313.jpg'
import PHoto1 from '../assets/card photo/1.jpeg'
export default function Home({ user }) {
  // console.log(user);

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
    <img src={bg} alt="Ak Florist" className="classForBg"/>
      <div className="container d-flex justify-content-center gap-4 my-5">
      <div className="card widthOfHomeCard" >
        <img src={PHoto1} className="card-img-top" alt="" />
        <div className="card-body">
        <p className="text-muted mb-2">690 EGP</p>
          <h5 className="card-title">Red Roses Bouquet</h5>
          <p className="card-text mb-2">
          Red Love Bouquet | Black Wrap.
          </p>
          <button onClick={addToCart} className="btn text-white ColorButton  w-100">
            add to cart 
          </button>
        </div>
      </div>
      </div>
      {/* <div className="d-flex justify-content-center align-items-center">
        <button onClick={addToCart} className="btn btn-primary p-4 ">
          {" "}
          add{" "}
        </button>
      </div> */}
    </>
  );
}
