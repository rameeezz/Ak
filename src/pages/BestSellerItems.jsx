import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeadOfPages from "./HeadOfPages";

export default function BestSellerItems({ user }) {
  let naviagte = useNavigate();
  function addToCart() {
    if (user == null) {
      console.log("yarab");
      navigate("/login");
    } else {
      alert("نتمنى لكم حياة افضل ");
    }
  }
  useEffect(() => {
    getCategoryBestSeller();
    getOccasionBestSeller();
  }, []);
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
      //   console.log(data);
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
  function goHome() {
    naviagte("/home");
  }
  //   done -----------
  return (
    <>
      <HeadOfPages />
      <div className="container mb-5">
        {/* Best seller  */}
        <div className="container-xxl ">
          <div className="d-flex flex-column align-items-start justify-content-center mt-5 mb-4">
            <h2 className="responsive-font-size-h2-Home fw-bold">
              Best Sellers
            </h2>
            <p>| Bloom with our exquisite best sellers |</p>
            <div className="d-flex justify-content-center gap-1 mt-1 align-items-center">
              <i className="fa-solid fa-house-chimney text-muted"></i>
              <p className="cursorPOinter" onClick={goHome}>
                Home
              </p>
              <i class="fa-solid fa-angle-right text-muted"></i>
              <p>Best Sellers</p>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center  gap-4 flex-wrap">
          {bestSellerCategory === null || bestSellerCategory.length === 0 ? (
            loadingBestSellerCategory ? (
              <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
            ) : (
              <p>{errorMessageForGetCategory}</p>
            )
          ) : (
            bestSellerCategory.map((element, i) => (
              <div
                key={i}
                className="card widthOfHomeCard forBestSellerPageResponsive position-relative"
              >
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
                  className="card-img-top ScaleForPhoto forBestSellerPageResponsiveImage"
                  alt=""
                />

                <div className="card-body responsiveForBestSellerPage">
                  {element?.discount === 0 ? (
                    <p className="text-muted responsive-For-Card-h2-Best-Seller">
                      {element?.lastPrice} EGP
                    </p>
                  ) : (
                    <div className="d-flex justify-content-start w-100">
                      <div className="d-flex justify-content-center gap-2">
                        <span className="strikethrough responsive-For-Card-h2-Best-Seller">
                          {element?.price}
                        </span>
                        <span>||</span>
                        <p className="text-muted responsive-For-Card-h2-Best-Seller">
                          {element?.lastPrice} EGP
                        </p>
                      </div>
                    </div>
                  )}
                  <h5 className="card-title responsive-For-Card-h2-Best-Seller">
                    {element?.name}
                  </h5>
                  <p className="card-text responsive-For-Card-p">
                    {element?.description.slice(0, 37)}
                  </p>
                  <button
                    onClick={addToCart}
                    className="btn text-white ColorButton classForButtonForCardForBestSeller w-100"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}

          {bestSellerOccasion === null || bestSellerOccasion.length === 0
            ? ""
            : bestSellerOccasion.map((element, i) => (
                <div
                  key={i}
                  className="card forBestSellerPageResponsive widthOfHomeCard position-relative"
                >
                  {element?.status === "in stock" ? (
                    ""
                  ) : (
                    <div className="position-absolute start-2 top-4 styleForStock z-3">
                      <span className="bg-[#D4B11C] text-white px-2 py-2 rounded-2">
                        Out Of Stock
                      </span>
                    </div>
                  )}

                  {element?.discount === 0 ? (
                    ""
                  ) : (
                    <div className="position-absolute styleForSale end-3 top-4 z-3">
                      <span className="bg-danger text-white px-3 py-2 rounded-2">
                        Sale
                      </span>
                    </div>
                  )}
                  <img
                    src={`https://freelance1-production.up.railway.app/${element?.images[0]}`}
                    className="card-img-top forBestSellerPageResponsiveImage ScaleForPhoto "
                    alt=""
                  />
                  <div className="card-body responsiveForBestSellerPage">
                    {element?.discount === 0 ? (
                      <h2 className="w-100 text-muted responsive-For-Card-h2">
                        {element?.lastPrice} EGP
                      </h2>
                    ) : (
                      <div className="d-flex justify-content-center gap-1">
                        <span className="strikethrough responsive-For-Card-h2">
                          {element?.price}
                        </span>
                        <span className="text-muted responsive-For-Card-h2">
                          ||
                        </span>
                        <p className="text-muted responsive-For-Card-h2">
                          {element?.lastPrice} EGP
                        </p>
                      </div>
                    )}
                    <h5 className="card-title responsive-For-Card-h2-Best-Seller">
                      {element?.name}
                    </h5>
                    <p className="card-text responsive-For-Card-p">
                      {element?.description.slice(0, 36)}
                    </p>
                    <button
                      onClick={addToCart}
                      className="btn text-white ColorButton classForButtonForCardForBestSeller  w-100"
                    >
                      add to cart
                    </button>
                  </div>
                </div>
              ))}
        </div>
        {/* DOne Best Sellet  */}
      </div>
    </>
  );
}
