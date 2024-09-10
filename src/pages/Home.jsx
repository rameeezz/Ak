import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import bg from "../assets/bg/imresizer-1724329258313.jpg";
import PHoto1 from "../assets/card photo/photoCategory.jpg";
import callSvg from "../assets/card photo/outline-email (1) - Copy.svg";
import whatsSvg from "../assets/card photo/contact-whatsapp.svg";
import customerSurviceSvg from "../assets/card photo/customer-service.svg";
import sendMailSvg from "../assets/card photo/send-email-message.svg";
import deliveryPhoto from "../assets/card photo/same-day-delivery.svg";
import freshPhoto from "../assets/card photo/freshness.svg";
import securePhoto from "../assets/card photo/secure-payment.svg";
import senderPhoto from "../assets/card photo/sender-privacy.svg";
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
  function ShowItemContent(itemDetails) {
    navigate("/item-content", { state: { items: itemDetails } });
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
    getSpecialDeals();
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
  function moveToAllSpecialDeals() {
    navigate("/all-special-deals");
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
  // console.log(allOccasion);

  const [loadingForOccasion, setLoadingForOcassion] = useState(false);
  const [errorMessageForOccasion, setErrorMessageForOccasion] = useState("");
  async function getAllOccasion() {
    setLoadingForOcassion(true);
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/customer/getOccasions"
      );
      // console.log(data);

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
  // special Deals
  const [specialDeals, setSpecialDeals] = useState([]);
  // console.log(specialDeals);

  const [specialDealsOccasion, setSpecialDealsOccasion] = useState([]);
  // console.log(specialDealsOccasion);

  const [loadingSpecialDeals, setLoadingSpecialDeals] = useState(false);
  const [errorMessageForSpecialDeals, setErrorMessageForSpecialDeals] =
    useState("");
  async function getSpecialDeals() {
    setLoadingSpecialDeals(true);
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/customer/getDiscounts"
      );
      setSpecialDeals(data.itemsOfOccasions);
      setSpecialDealsOccasion(data.items);
      // console.log(data);
      setLoadingSpecialDeals(false);
      setErrorMessageForSpecialDeals("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoadingSpecialDeals(false);
        setErrorMessageForSpecialDeals("No Items In Special Deals");
      }
    }
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
                  onClick={() => {
                    ShowItemContent(element);
                  }}
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
                      {element?.name.slice(0, 37)}
                    </h2>
                    {/* <h2 className="w-100 mt-1 responsive-For-Card-p">
                      {element?.description.slice(0, 32)}
                    </h2> */}
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
                     onClick={() => {
                      ShowItemContent(element);
                    }}
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
                        {element?.name.slice(0, 37)}
                      </h2>
                      {/* <h2 className="w-100 mt-1 responsive-For-Card-p">
                        {element?.description.slice(0, 25)}
                      </h2> */}
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
            {allOccasion.length === 0 ? (
              loadingForOccasion ? (
                <div className="w-100 justify-content-center d-flex">
                  <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                </div>
              ) : (
                <div>{errorMessageForOccasion}</div> // Ensure that this is a string or valid JSX
              )
            ) : (
              allOccasion.slice(0, 6).map((element, i) => (
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
        {/* special deals */}
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">
            Special Deals
          </h2>
          <div className="w-100 d-flex justify-content-center position-relative">
            <p>| Indulge in Nature's Blooming Beauties |</p>
            <div
              onClick={moveToAllSpecialDeals}
              className=" d-flex justify-content-center cursorPOinter position-absolute end-[120px] forDivViewMore"
            >
              <span className="ForViewMore">View More</span>
            </div>
          </div>
        </div>
        <div className="StyleForBestSeller gap-3">
          {specialDeals === null || specialDeals.length === 0 ? (
            loadingSpecialDeals ? (
              <div className="w-100 justify-content-center d-flex">
                <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
              </div>
            ) : (
              <p>{errorMessageForSpecialDeals}</p>
            )
          ) : (
            specialDeals.slice(0, 4).map((element, i) => (
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
                  onClick={() => {
                    ShowItemContent(element);
                  }}
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
                      {element?.name.slice(0, 37)}
                    </h2>
                    {/* <h2 className="w-100 mt-1 responsive-For-Card-p">
                      {element?.description.slice(0, 32)}
                    </h2> */}
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
          {specialDealsOccasion === null || specialDealsOccasion.length === 0
            ? ""
            : specialDealsOccasion.slice(0, 4).map((element, i) => (
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
                     onClick={() => {
                      ShowItemContent(element);
                    }}
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
                        {element?.name.slice(0, 37)}
                      </h2>
                      {/* <h2 className="w-100 mt-1 responsive-For-Card-p">
                        {element?.description.slice(0, 32)}
                      </h2> */}
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
              ))}
        </div>
      </div>
      <div className="bg-[#ededed] w-100 py-4">
        <div className="container-xxl d-flex justify-content-center inSmallscreenForForm">
          <div className="w-50 forWidthSectionOfForm">
            <p className="text-[#323232] responsive-font-size-p">
              Feel free to explore and connect with us. We're ready to answer
              your questions and provide assistance. Don't hesitate –{" "}
              <span className="text-black fw-bold "> let's connect!</span>
            </p>
            <div className="d-flex flex-column gap-2 mt-3">
              <div className="d-flex align-items-center gap-2">
                <img src={customerSurviceSvg} alt="" />
                01022317881
              </div>
              <div className="d-flex align-items-center gap-2">
                <img src={whatsSvg} alt="" />
                01022317881
              </div>
              <div className="d-flex align-items-center gap-2">
                <img src={callSvg} alt="" />
                salah@gmail.com
              </div>
            </div>
          </div>
          <div className="shadow-lg bg-white p-3 w-50 rounded-3 forWidthSectionOfForm">
            <p className="text-[#843e78] responsive-font-size-p-form">
              Send Us A Message
            </p>
            <h3 className="fw-bold responsive-font-size-h1-form mb-4">
              Fill The Form Below
            </h3>
            <form>
              <div className=" d-flex justify-content-center gap-3">
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Name *"
                />
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Email *"
                />
              </div>
              <div className=" d-flex justify-content-center gap-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Phone *"
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email *"
                />
              </div>
              <textarea className="form-control mt-3" placeholder="Message *" id="exampleFormControlTextarea1" rows="3"></textarea>
              <button className="btn bg-[#843e78] rounded-3 text-white d-flex mt-3 gap-2 hover:bg-sky-700">Send Message <img src={sendMailSvg} alt="" /> </button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-[#fff3fd] py-4">
        <div className="container d-flex justify-content-around align-items-center">
          <div className="d-flex flex-column align-items-center">
            <img src={deliveryPhoto} alt="" className="imgForFooter"/>
            <p className="p-for-image-for-footer">Same Day Delivery</p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <img src={freshPhoto} alt="" className="imgForFooter"/>
            <p className="p-for-image-for-footer">Freshness Guarantee</p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <img src={securePhoto} alt="" className="imgForFooter"/>
            <p className="p-for-image-for-footer">Secure Payment</p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <img src={senderPhoto} alt="" className="imgForFooter"/>
            <p className="p-for-image-for-footer">Sender Privacy</p>
          </div>
        </div>
      </div>
    </>
  );
}
