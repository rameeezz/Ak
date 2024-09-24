import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import HeadOfPages from "./HeadOfPages";
export default function Home({ user }) {
  // console.log(user);
  const navigate = useNavigate();
  let location = useLocation();
  const parsedCartID = localStorage.getItem("cartID");
  const cartID = parsedCartID ? JSON.parse(parsedCartID) : "";
  // console.log(cartID);
  const [itemsArray, setItemsArray] = useState(() => {
    // Retrieve saved items from localStorage (if any)
    const savedItems = localStorage.getItem("cartItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  // console.log(itemsArray);

  const [classForCart, setClassForCart] = useState(false);
  const [loadingButtonCart, setLoadingButtonCat] = useState(false);
  const [classoFitemIsAlreadyExist, setClassoFitemIsAlreadyExist] =
    useState(false);
  // console.log(itemsArray);
  const customerID = user?.userId || null;
  // console.log(customerID);

  // Save itemsArray to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(itemsArray));
    localStorage.setItem("cartTimestamp", new Date().getTime());
  }, [itemsArray]);
  useEffect(() => {
    checkCartExpiration();
  }, []);
  const checkCartExpiration = () => {
    const savedTimestamp = localStorage.getItem("cartTimestamp");
    // console.log(savedTimestamp);

    if (savedTimestamp) {
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - savedTimestamp;
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      // If more than 1 day has passed, reset cartItems to an empty array
      if (timeElapsed > twentyFourHours) {
        setItemsArray([]); // Clear the itemsArray state
        localStorage.setItem("cartItems", JSON.stringify([])); // Clear cartItems in localStorage
        localStorage.removeItem("cartTimestamp"); // Remove the timestamp
      }
    }
  };
  const [createCartInfo, setCreateCartInfo] = useState({
    items: itemsArray,
    customer: customerID,
  });
  useEffect(() => {
    setCreateCartInfo((prevInfo) => ({
      ...prevInfo,
      customer: user?.userId || null, // Ensure customer is always up-to-date
      items: itemsArray,
    }));
  }, [user, itemsArray]);
  // console.log(createCartInfo);

  function addToCart(itemID, quantity, itemType) {
    if (user == null) {
      navigate("/login");
    } else {
      const itemExists = itemsArray.some((item) => item.itemID === itemID);

      // Only add the item if it doesn't already exist
      if (!itemExists) {
        const newItem = { itemID, quantity, itemType };
        setItemsArray((prevItems) => [...prevItems, newItem]);

        setCreateCartInfo((prevInfo) => ({
          ...prevInfo,
          items: [...prevInfo.items, newItem],
        }));
        setClassForCart(true);
        setClassoFitemIsAlreadyExist(false);
      } else {
        setClassoFitemIsAlreadyExist(true);
        setClassForCart(true);
      }
    }
  }
  function closeSureBoxOFCart() {
    setClassForCart(false);
    setClassoFitemIsAlreadyExist(false);
  }
  async function handleSubmitCreateCart(e) {
    setLoadingButtonCat(true);
    // console.log(createCartInfo);

    e.preventDefault();
    if (createCartInfo.customer == null) {
      alert("please Login ");
    } else {
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/customer/createCart",
          createCartInfo
        );
        // console.log(data);
        goToBasket();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          if (cartID === null || cartID === "") {
            console.log("sas");
            alert("sa");
            const deleteCartId = {
              customerID: customerID,
            };
            deleteCartUser(e, deleteCartId);
            handleSubmitCreateCart(e);
            setLoadingButtonCat(false);
          } else {
            editeCart(e);
          }
        }
      }
    }
  }
  async function deleteCartUser(e, userID) {
    e.preventDefault();
    try {
      let { data } = await axios.delete(
        "https://akflorist-production.up.railway.app/customer/deleteCart",
        {
          data: userID, // Pass customerID in the body of the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      // handleSubmitCreateCart(e)
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  }

  async function editeCart(e) {
    setLoadingButtonCat(true);
    e.preventDefault();
    const cartInfo = {
      items: itemsArray,
      cart: cartID,
    };
    if (cartInfo.cart === null || cartInfo.cart === "") {
      alert("wait");
      setLoadingButtonCat(false);
    } else {
      try {
        let { data } = await axios.patch(
          "https://akflorist-production.up.railway.app/customer/editCart",
          cartInfo
        );
        // console.log(data);
        goToBasket();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          goToBasket();
        }
        if (error.response && error.response.status === 400) {
          goToBasket();
        }
      }
    }
  }
  function goToBasket() {
    navigate("/basket", {
      state: { userId: customerID },
    });
    setLoadingButtonCat(false);
  }

  // done cart work -----------------
  function ShowItemContent(itemDetails) {
    navigate("/item-content", {
      state: { items: itemDetails, cartID: cartID },
    });
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
        "https://akflorist-production.up.railway.app/admin1/getBestSeller"
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
        "https://akflorist-production.up.railway.app/admin1/getBestSellerOccasion"
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
    navigate("/best-sellers", { state: { cartID: cartID } });
  }
  function moveToAllCategory() {
    navigate("/all-category", { state: { cartID: cartID } });
  }
  function moveToAllOccasions() {
    navigate("/all-occasion", { state: { cartID: cartID } });
  }
  function moveToAllSpecialDeals() {
    navigate("/all-special-deals", { state: { cartID: cartID } });
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
        "https://akflorist-production.up.railway.app/customer/getCategory"
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
    navigate("/show-items", { state: { id: idOfCategory, cartID: cartID } });
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
        "https://akflorist-production.up.railway.app/customer/getOccasions"
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
    navigate("/show-items-in-occasion", {
      state: { id: idOfCategory, cartID: cartID },
    });
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
        "https://akflorist-production.up.railway.app/customer/getDiscounts"
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

  // work of text form
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [formInfo, setFormInfo] = useState({
    email: "",
    subject: "",
    text: "",
    mobileNumber: "",
    name: "",
  });
  // console.log(formInfo);

  function setFormDetails(e) {
    let myFormInfo = { ...formInfo };
    myFormInfo[e.target.name] = e.target.value;
    setFormInfo(myFormInfo);
  }
  async function sendFormInfo(e) {
    e.preventDefault();
    if (
      formInfo.email == "" ||
      formInfo.mobileNumber == "" ||
      formInfo.name == "" ||
      formInfo.subject == "" ||
      formInfo.text == ""
    ) {
      alert("Please Fill All Form");
    } else {
      setLoadingFormData(true);
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/customer/sendReport",
          formInfo
        );
        alert("Done.");
        setFormInfo({
          email: "",
          subject: "",
          text: "",
          mobileNumber: "",
          name: "",
        });
        setLoadingFormData(false);
      } catch (error) {}
    }
  }
  return (
    <>
      <HeadOfPages user={user} cartID={cartID} itemsArray={itemsArray} />
      <div
        className={`shadow classForSureBoxOFCart rounded bg-white p-5 translate-middle ${
          classForCart ? "active" : ""
        }`}
      >
        {classoFitemIsAlreadyExist ? (
          <p className="text-center my-3">This item is already exist.</p>
        ) : (
          <h3 className="text-center my-3 w-100">
            Item added to cart successfully
          </h3>
        )}
        <div className="d-flex justify-content-center align-items-center gap-3">
          {loadingButtonCart ? (
            <div className="w-100 justify-content-center d-flex">
              <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
            </div>
          ) : (
            <button
              onClick={(e) => {
                handleSubmitCreateCart(e);
              }}
              className="btn text-white ColorButton classForButtonForCard w-100 mt-2 me-3"
            >
              Go To Basket
            </button>
          )}

          <button
            onClick={closeSureBoxOFCart}
            className="btn text-white bg-[#9cdce6] classForButtonForCard w-100 mt-2 me-3  hover:bg-sky-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
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
                className="styleForContentDiv position-relative border-2 border-[#D4B11C] rounded"
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
                    src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.images[0]}`}
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
                  <div className="d-flex justify-content-center align-items-center position-absolute bottom-0 start-50 translate-middle-x w-[100%]">
                    <button
                      onClick={() => {
                        addToCart(element._id, 1, element?.type);
                      }}
                      className="btn text-white ColorButton classForButtonForCard w-100"
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
                  className="styleForContentDiv border-2 border-[#D4B11C] rounded position-relative"
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
                      src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.images[0]}`}
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
                    <div className="d-flex justify-content-center align-items-center position-absolute bottom-0 start-50 translate-middle-x w-[100%]">
                      <button
                        onClick={() => {
                          addToCart(element._id, 1, element?.type);
                        }}
                        className="btn text-white ColorButton classForButtonForCard w-100"
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
        <div
          id="category"
          className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4"
        >
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
                      src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.image}`}
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
        <div
          id="occasions"
          className="d-flex flex-column align-items-center justify-content-center mt-5 mb-4"
        >
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
                      src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.image}`}
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
                className="styleForContentDiv border-2 border-[#D4B11C] rounded position-relative"
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
                    src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.images[0]}`}
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
                  <div className="d-flex justify-content-center align-items-center position-absolute bottom-0 start-50 translate-middle-x w-[100%]">
                    <button
                      onClick={() => {
                        addToCart(element._id, 1, element?.type);
                      }}
                      className="btn text-white ColorButton classForButtonForCard w-100"
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
                  className="styleForContentDiv border-2 border-[#D4B11C] rounded position-relative"
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
                      src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.images[0]}`}
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
                    <div className="d-flex justify-content-center align-items-center position-absolute bottom-0 start-50 translate-middle-x w-[100%]">
                      <button
                        onClick={() => {
                          addToCart(element._id, 1, element?.type);
                        }}
                        className="btn text-white ColorButton classForButtonForCard w-100"
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
                <a href="https://api.whatsapp.com/send?phone=201022317881" className="text-primary">01022317881</a>

              </div>
              <div className="d-flex align-items-center gap-2">
                <img src={callSvg} alt="" />
                AKflorist2020@gmail.com
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fa-solid fa-map-location-dot fs-4"></i>
                <a
                  href="https://maps.app.goo.gl/7fzvCNfaM8uWJp6K9"
                  target="_blank"
                  className="text-primary"
                >
                  Ak Location
                </a>
              </div>
              <div className="mt-3 d-flex justify-content-start flex-wrap">
                <h3 className=" font-medium text-lg  mb-1 responsive-font-size-p w-100 text-start">
                  Follow Us
                </h3>
                <div className="d-flex justify-content-start">
                  <a
                    className="moveForIcons"
                    href="https://www.facebook.com/ByAseelKamal"
                    target="_blank"
                  >
                    <i className="fa-brands fa-facebook-f text-xl text-blue-900"></i>
                  </a>
                  <a
                    className="moveForIcons"
                    href="https://www.instagram.com/ak_byaseelkamal?igshid=YmMyMTA2M2Y%3D&fbclid=IwY2xjawER8KxleHRuA2FlbQIxMAABHamKXnEIEwbf3nVKRaTcPFzOGqPnhmc9Tem5Q4TUlQm4-Vqi6Hh0DWD5og_aem_KXlJIj7Z09I5LtkE7onq8Q"
                    target="_blank"
                  >
                    <i className="fa-brands fa-instagram text-xl mx-3 bgForInstaIcon"></i>
                  </a>
                  <a
                    href="https://www.tiktok.com/@akflorist2020?_t=8oNJ3QDHDAj&_r=1"
                    target="_blank"
                    className="moveForIcons"
                  >
                    <i className="fa-brands fa-tiktok text-black text-xl"></i>
                  </a>
                </div>
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
                  onChange={setFormDetails}
                  type="text"
                  className="form-control mb-4"
                  placeholder="Name *"
                  name="name"
                  value={formInfo.name}
                />
                <input
                  onChange={setFormDetails}
                  type="text"
                  className="form-control mb-4"
                  placeholder="Email *"
                  name="email"
                  value={formInfo.email}
                />
              </div>
              <div className=" d-flex justify-content-center gap-3">
                <input
                  onChange={setFormDetails}
                  type="text"
                  className="form-control"
                  placeholder="Phone *"
                  name="mobileNumber"
                  value={formInfo.mobileNumber}
                />
                <input
                  onChange={setFormDetails}
                  type="text"
                  className="form-control"
                  placeholder="Subject *"
                  name="subject"
                  value={formInfo.subject}
                />
              </div>
              <textarea
                onChange={setFormDetails}
                className="form-control mt-3"
                placeholder="Message *"
                id="exampleFormControlTextarea1"
                rows="3"
                name="text"
                value={formInfo.text}
              ></textarea>
              {loadingFormData ? (
                <div className="w-100 justify-content-left d-flex">
                  <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                </div>
              ) : (
                <button
                  onClick={sendFormInfo}
                  className="btn bg-[#843e78] rounded-3 text-white d-flex mt-3 gap-2 hover:bg-sky-700"
                >
                  Send Message <img src={sendMailSvg} alt="" />{" "}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <div className="bg-[#fff3fd] py-4">
        <div className="container d-flex justify-content-around align-items-center">
          <div className="d-flex flex-column align-items-center">
            <img src={deliveryPhoto} alt="" className="imgForFooter" />
            <p className="p-for-image-for-footer">Same Day Delivery</p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <img src={freshPhoto} alt="" className="imgForFooter" />
            <p className="p-for-image-for-footer">Freshness Guarantee</p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <img src={securePhoto} alt="" className="imgForFooter" />
            <p className="p-for-image-for-footer">Secure Payment</p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <img src={senderPhoto} alt="" className="imgForFooter" />
            <p className="p-for-image-for-footer">Sender Privacy</p>
          </div>
        </div>
      </div>
    </>
  );
}
