import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import bg from "../assets/bg/imresizer-1724329258313.jpg";
import PHoto1 from "../assets/card photo/1.jpeg";
import axios from "axios";
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
  // get Best Seller for Category
  const [bestSellerCategory, setBestSellerCategory] = useState([]);
  const [loadingBestSellerCategory, setLoadingBestSellerCategroy] =
    useState(false);
  const [errorMessageForGetCategory, setErrorMessageForGetCategory] =
    useState("");
  async function getCategoryBestSeller() {
    setLoadingBestSellerCategroy(true);
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/admin1/getBestSeller"
      );
      setBestSellerCategory(data);
      // console.log(data);
      setLoadingBestSellerCategroy(false);
      setErrorMessageForGetCategory("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoadingBestSellerCategroy(false);
        setErrorMessageForGetCategory("No Items In Best Seller");
      }
    }
  }
  // best seller for Ocassion
  const [bestSellerOccasion, setBestSellerOccasion] = useState([]);
  async function getOccasionBestSeller() {
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/admin1/getBestSellerOccasion"
      );
      setBestSellerOccasion(data);
      setErrorMessageForGetCategory("");
      // console.log(data);
    } catch (error) {}
  }
  useEffect(() => {
    getCategoryBestSeller();
    getOccasionBestSeller();
  }, [bestSellerCategory, bestSellerOccasion]);
  // done
  return (
    <>
      <img src={bg} alt="Ak Florist" className="classForBg" />
      <div className="container mb-5">
        {/* Best seller  */}
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">Best Sellers</h2>
          <div className="w-100 d-flex justify-content-center position-relative">
            <p>| Bloom with our exquisite best sellers |</p>
            <div className=" d-flex justify-content-center cursorPOinter position-absolute end-5">
              <span className="ForViewMore">View More</span>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {bestSellerCategory === null || bestSellerCategory.length === 0 ? (
            loadingBestSellerCategory ? (
              <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
            ) : (
              <p>{errorMessageForGetCategory}</p>
            )
          ) : (
            bestSellerCategory.slice(0, 4).map((element, i) => (
              <div key={i} className="card widthOfHomeCard position-relative">
                {element?.status === "in stock" ? (
                  ""
                ) : (
                  <div className="position-absolute start-2 top-4 z-3">
                    <span className="bg-[#D4B11C] text-white px-2 py-2 rounded-2">
                      Out Of Stock
                    </span>
                  </div>
                )}

                {element?.discount === 0 ? (
                  ""
                ) : (
                  <div className="position-absolute end-3 top-4 z-3">
                    <span className="bg-danger text-white px-3 py-2 rounded-2">
                      Sale
                    </span>
                  </div>
                )}

                <img
                  src={`https://freelance1-production.up.railway.app/${element?.images[0]}`}
                  className="card-img-top ScaleForPhoto"
                  alt=""
                />

                <div className="card-body">
                  {element?.discount === 0 ? (
                    <p className="text-muted">{element?.lastPrice} EGP</p>
                  ) : (
                    <div className="d-flex justify-content-start w-100">
                      <div className="d-flex justify-content-center gap-2">
                        <span className="strikethrough">{element?.price}</span>
                        <span>||</span>
                        <p className="text-muted">{element?.lastPrice} EGP</p>
                      </div>
                    </div>
                  )}
                  <h5 className="card-title">{element?.name}</h5>
                  <p className="card-text">{element?.description}</p>
                  <button
                    onClick={addToCart}
                    className="btn text-white ColorButton w-100"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}

          {bestSellerOccasion === null || bestSellerOccasion.length === 0
            ? ""
            : bestSellerOccasion.slice(0, 4).map((element, i) => (
                <div key={i} className="card widthOfHomeCard position-relative">
                  {element?.status == "in stock" ? (
                    ""
                  ) : (
                    <div className="position-absolute start-2 top-4 z-3">
                      <span className="bg-[#D4B11C] text-white px-2 py-2 rounded-2">
                        {" "}
                        Out Of Stock
                      </span>
                    </div>
                  )}

                  {element?.discount === 0 ? (
                    ""
                  ) : (
                    <div className="position-absolute end-3 top-4 z-3 ">
                      <span className="bg-danger text-white px-3 py-2 rounded-2">
                        {" "}
                        Sale
                      </span>
                    </div>
                  )}
                  <img
                    src={`https://freelance1-production.up.railway.app/${element?.images[0]}`}
                    className="card-img-top ScaleForPhoto "
                    alt=""
                  />
                  <div className="card-body">
                    {element?.discount === 0 ? (
                      <p className="text-muted">{element?.lastPrice} EGP</p>
                    ) : (
                      <div className="d-flex justify-content-start w-100">
                        <div className="d-flex justify-content-center gap-2">
                          <span className="strikethrough">
                            {element?.price}
                          </span>
                          <span>||</span>
                          <p className="text-muted">{element?.lastPrice} EGP</p>
                        </div>
                      </div>
                    )}
                    <h5 className="card-title">{element?.name}</h5>
                    <p className="card-text">{element?.description}</p>
                    <button
                      onClick={addToCart}
                      className="btn text-white ColorButton  w-100"
                    >
                      add to cart
                    </button>
                  </div>
                </div>
              ))}
        </div>
        {/* DOne Best Sellet  */}
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
