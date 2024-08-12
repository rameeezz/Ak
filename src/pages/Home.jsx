import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import PHoto1 from '../assets/card photo/1.jpeg'
import PHoto2 from '../assets/card photo/2.jpeg'
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
      <div className="container d-flex justify-content-center gap-4 my-5">
      <div className="card sa" >
        <img src={PHoto2} className="card-img-top" alt="" />
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <a className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
      <div className="card sa" >
        <img src={PHoto1} className="card-img-top" alt="" />
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <a className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
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
