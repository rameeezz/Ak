import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import bg from "../assets/bg/imresizer-1724329258313.jpg";
import PHoto1 from "../assets/card photo/photoCategory.jpg";
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
    getAllCategory();
    getAllOccasion();
  }, []);
  // view more best seller
  function moveToBestSellerPage() {
    navigate("/best-sellers");
  }
  function moveToAllCategory() {
    navigate("/all-category");
  }
  function moveToAllOccasions() {
    navigate("/all-occasion");
  }

  // done
  // get Category
  const [allCategory, setAllCategory] = useState([]);
  // console.log(allCategory);

  const [loadingForCategory, setLoadingForCategory] = useState(false);
  const [errorMessageForCategory, setErrorMessageForCategory] = useState("");
  async function getAllCategory() {
    setLoadingForCategory(true);
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/customer/getCategory"
      );
      setAllCategory(data.getCategory);
      setLoadingForCategory(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessageForCategory("no items");
        setLoadingForCategory(false);
        setAllCategory([]);
      }
    }
  }
  function goToItems(idOfCategory) {
    navigate("/show-items", { state: { id: idOfCategory } });
  }
  // done-----------------
  // get Ocassions
  const [allOccasion, setAllOccasion] = useState([]);
  console.log(allOccasion);

  const [loadingForOccasion, setLoadingForOcassion] = useState(false);
  const [errorMessageForOccasion, setErrorMessageForOccasion] = useState("");
  async function getAllOccasion() {
    setLoadingForOcassion(true);
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/customer/getOccasions"
      );
      console.log(data);
      
      setAllOccasion(data);
      setLoadingForOcassion(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessageForOccasion("no items");
        setLoadingForOcassion(false);
        setAllOccasion([]);
      }
    }
  }
  function goToOccasionItems(idOfCategory) {
    navigate("/show-items-in-occasion", { state: { id: idOfCategory } });
  }
  // done
  return (
    <>
      <img src={bg} alt="Ak Florist" className="classForBg" />
      <div className="container-xxl mb-5">
        {/* Best seller  */}
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">Best Sellers</h2>
          <div className="w-100 d-flex justify-content-center position-relative">
            <p>| Bloom with our exquisite best sellers |</p>
            <div
              onClick={moveToBestSellerPage}
              className=" d-flex justify-content-center cursorPOinter position-absolute end-[120px] forDivViewMore"
            >
              <span className="ForViewMore">View More</span>
            </div>
          </div>
        </div>
        <div className="StyleForBestSeller gap-3">
          {bestSellerCategory === null || bestSellerCategory.length === 0 ? (
            loadingBestSellerCategory ? (
              <div className="w-100 justify-content-center d-flex">
                <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
              </div>
            ) : (
              <p>{errorMessageForGetCategory}</p>
            )
          ) : (
            bestSellerCategory.slice(0, 4).map((element, i) => (
              <div
                key={i}
                className="styleForContentDiv border-2 border-[#D4B11C] rounded"
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

                <div className="upperCard">
                  <img
                    src={`https://freelance1-production.up.railway.app/${element?.images[0]}`}
                    alt=""
                    className="w-100 h-100 ScaleForPhoto rounded "
                  />
                </div>
                <div className="lowerCard">
                  <div className="d-flex justify-content-start flex-wrap">
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
                    <h2 className="w-100 mt-1 responsive-For-Card-h2">
                      {element?.name}
                    </h2>
                    <h2 className="w-100 mt-1 responsive-For-Card-p">
                      {element?.description.slice(0, 32)}
                    </h2>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      onClick={addToCart}
                      className="btn text-white ColorButton classForButtonForCard w-100 mt-2 me-3"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {bestSellerOccasion === null || bestSellerOccasion.length === 0
            ? ""
            : bestSellerOccasion.slice(0, 4).map((element, i) => (
                <div
                  key={i}
                  className="styleForContentDiv border-2 border-[#D4B11C] rounded"
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

                  <div className="upperCard">
                    <img
                      src={`https://freelance1-production.up.railway.app/${element?.images[0]}`}
                      alt=""
                      className="w-100 h-100 rounded ScaleForPhoto"
                    />
                  </div>
                  <div className="lowerCard">
                    <div className="d-flex justify-content-start flex-wrap">
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
                      <h2 className="w-100 mt-1 responsive-For-Card-h2">
                        {element?.name}
                      </h2>
                      <h2 className="w-100 mt-1 responsive-For-Card-p">
                        {element?.description.slice(0, 25)}
                      </h2>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        onClick={addToCart}
                        className="btn classForButtonForCard text-white ColorButton w-100 mt-2 me-3"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {/* DOne Best Sellet  */}
      </div>
      <div className="container-xxl mb-5">
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">Categories</h2>
          <div className="w-100 d-flex justify-content-center position-relative">
            <p>| Discover Blooms Beyond Compare |</p>
            <div
              onClick={moveToAllCategory}
              className=" d-flex justify-content-center cursorPOinter position-absolute end-[120px] forDivViewMore"
            >
              <span className="ForViewMore">View More</span>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center flex-row gap-2">
          <div className="w-25 rounded shadow forSmallScreenCategoryImage">
            <img src={PHoto1} alt="" className="rounded w-100 h-100" />
          </div>
          <div className="d-flex flex-row justify-content-left align-items-center gap-3 overflow-x-scroll removeScrollBardFromCAtegroy w-100 cursorPOinter">
            {allCategory.length === 0 ? (
              loadingForCategory ? (
                <div className="w-100 justify-content-center d-flex">
                  <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                </div>
              ) : (
                <div>{errorMessageForCategory}</div> // Ensure that this is a string or valid JSX
              )
            ) : (
              allCategory.slice(0, 6).map((element, i) => (
                <div
                  onClick={() => {
                    goToItems(element._id);
                  }}
                  key={i}
                  className=" styleForCategoriesCard rounded"
                  // style={{ minWidth: "250px" }}
                >
                  <div className="h-100 w-100 position-relative">
                    <img
                      src={`https://freelance1-production.up.railway.app/${element?.image}`}
                      alt="Category Photo"
                      className="w-100 h-100 rounded"
                    />
                    <div className="position-absolute w-100 h-100 top-0 bottom-0 d-flex justify-content-center align-items-center rounded">
                      <h2 className="text-white text-center responsiveTextForCategory">
                        {element?.name}
                      </h2>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* occasions */}
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">Occasions</h2>
          <div className="w-100 d-flex justify-content-center position-relative">
            <p>| Unveil the Beauty of Gifted Blooms |</p>
            <div
              onClick={moveToAllOccasions}
              className=" d-flex justify-content-center cursorPOinter position-absolute end-[120px] forDivViewMore"
            >
              <span className="ForViewMore">View More</span>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-2 flex-row">
        <div className="w-25 rounded shadow forSmallScreenCategoryImage">
            <img src={PHoto1} alt="" className="rounded w-100 h-100" />
          </div>
          <div className="d-flex flex-row justify-content-left align-items-center gap-3 overflow-x-scroll removeScrollBardFromCAtegroy w-100 cursorPOinter">
            <div className="d-flex flex-column py-3 justify-content-center align-items-center gap-2">
            <div className="d-flex justify-content-center gap-3">
            {allOccasion.length === 0 ? (
              loadingForOccasion ? (
                <div className="w-100 justify-content-center d-flex">
                  <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                </div>
              ) : (
                <div>{errorMessageForOccasion}</div> // Ensure that this is a string or valid JSX
              )
            ) : (
              allOccasion.slice(0,4).map((element, i) => (
                <div
                  onClick={() => {
                    goToOccasionItems(element._id);
                  }}
                  key={i}
                  className=" styleForCategoriesCard rounded"
                  // style={{ minWidth: "250px" }}
                >
                  <div className="h-100 w-100 position-relative">
                    <img
                      src={`https://freelance1-production.up.railway.app/${element?.image}`}
                      alt="Occasion Photo"
                      className="w-100 h-100 rounded"
                    />
                    <div className="position-absolute w-100 h-100 top-0 bottom-0 d-flex justify-content-center align-items-center rounded">
                      <h2 className="text-white text-center responsiveTextForCategory">
                        {element?.name}
                      </h2>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
            <div className="d-flex justify-content-center gap-3">
            {allOccasion.length === 0 ? (
              loadingForOccasion ? (
                <div className="w-100 justify-content-center d-flex">
                  <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                </div>
              ) : (
                <div>{errorMessageForOccasion}</div> // Ensure that this is a string or valid JSX
              )
            ) : (
              allOccasion.slice(0,4).map((element, i) => (
                <div
                  onClick={() => {
                    goToOccasionItems(element._id);
                  }}
                  key={i}
                  className=" styleForCategoriesCard rounded"
                  // style={{ minWidth: "250px" }}
                >
                  <div className="h-100 w-100 position-relative">
                    <img
                      src={`https://freelance1-production.up.railway.app/${element?.image}`}
                      alt="Occasion Photo"
                      className="w-100 h-100 rounded"
                    />
                    <div className="position-absolute w-100 h-100 top-0 bottom-0 d-flex justify-content-center align-items-center rounded">
                      <h2 className="text-white text-center responsiveTextForCategory">
                        {element?.name}
                      </h2>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
            </div>
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
