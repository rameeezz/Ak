import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllSpecialDeals({ user }) {
  let navigate = useNavigate();
  function addToCart() {
    if (user == null) {
      console.log("yarab");
      navigate("/login");
    } else {
      alert("نتمنى لكم حياة افضل ");
    }
  }
  function goHome() {
    navigate("/home");
  }
  function ShowItemContent(itemDetails) {
    navigate("/item-content", { state: { items: itemDetails } });
  }
  useEffect(() => {
    getSpecialDeals();
  }, []);
  const [SpecialDealsOccasion, setSpecialDealsOccasion] = useState([]);
  const [SpecialDealsCategory, setSpecialDealsCategory] = useState([]);
  console.log();

  const [loadingSpecialDeals, setLoadingSpecialDeals] = useState(false);
  const [errorMessageForSpecialDeals, setErrorMessageForSpecialDeals] =
    useState("");
  async function getSpecialDeals() {
    setLoadingSpecialDeals(true);
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/customer/getDiscounts"
      );
      setSpecialDealsOccasion(data.itemsOfOccasions);
      setSpecialDealsCategory(data.items);
      //   console.log(data);
      setLoadingSpecialDeals(false);
      setErrorMessageForSpecialDeals("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoadingSpecialDeals(false);
        setErrorMessageForSpecialDeals("No Items In Best Seller");
      }
    }
  }
  return (
    <>
      <div className="container-xxl ">
        <div className="d-flex flex-column align-items-start justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">
            The Best Gifts To Pair With Your Bouquet
          </h2>
          <div className="d-flex justify-content-center gap-1 mt-1 align-items-center">
            <i className="fa-solid fa-house-chimney text-muted"></i>
            <p className="cursorPOinter" onClick={goHome}>
              Home
            </p>
            <i className="fa-solid fa-angle-right text-muted"></i>
            <p>Items</p>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <div className="d-flex justify-content-center  gap-4 flex-wrap">
          {SpecialDealsCategory === null ||
          SpecialDealsCategory.length === 0 ? (
            loadingSpecialDeals ? (
              <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
            ) : (
              <p>{errorMessageForSpecialDeals}</p>
            )
          ) : (
            SpecialDealsCategory.map((element, i) => (
              <div
                
                key={i}
                className="card widthOfHomeCard forBestSellerPageResponsive position-relative"
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
                onClick={() => {
                  ShowItemContent(element);
                }}
                  src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.images[0]}`}
                  className="card-img-top ScaleForPhoto forBestSellerPageResponsiveImage"
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
                    {element?.name.slice(0, 37)}
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

          {SpecialDealsOccasion === null || SpecialDealsOccasion.length === 0
            ? ""
            : SpecialDealsOccasion.map((element, i) => (
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
                  onClick={() => {
                    ShowItemContent(element);
                  }}
                    src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.images[0]}`}
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
                      {element?.name.slice(0, 37)}
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
      </div>
    </>
  );
}
