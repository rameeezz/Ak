import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import purpleCircle from "../assets/card photo/purple-flower.svg";
import grayCircle from "../assets/card photo/gray-flower.svg";
import Arrow from "../assets/card photo/guidance-arrow.svg";
import doneCircle from "../assets/card photo/completed-phase.svg";
import cardItemImg from "../assets/card photo/2.jpg";
import axios from "axios";
import NavBar from "./../component/NavBar";
import HeadOfPages from "./HeadOfPages";
export default function Basket({ user, logOut }) {
  let location = useLocation();
  let { userId } = location.state || null;

  // console.log(userId);
  const [itemsInCart, setItemsInCart] = useState([]);
  // console.log(itemsInCart);
  const [itemsSameHome, setItemsSameHome] = useState([]);
  // console.log(" **************************** ");

  // console.log(itemsSameHome);

  const [cartID, setCartId] = useState("");
  const [totalCost, setTotalCost] = useState("");
  // console.log(totalCost);

  useEffect(() => {
    getCart();
  }, []);
  // console.log(totalCost);
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(itemsSameHome));
  }, [itemsSameHome]);
  useEffect(() => {
    localStorage.setItem("cartID", JSON.stringify(cartID));
  }, [cartID]);
  const [loading, setLoading] = useState(false);
  async function getCart() {
    setLoading(true);
    if (userId === null) {
      alert("Go To Home Page.");
    } else {
      try {
        let { data } = await axios.get(
          `https://freelance1-production.up.railway.app/customer/getCart/${userId}`
        );
        setItemsInCart(data.getThisCart.items);
        setTotalCost(data.getThisCart.totalCost);
        setCartId(data.getThisCart._id);
        setItemsSameHome(data.items);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("No Items");
        }
      }
    }
  }
  async function deleteItem(itemID) {
    const filteredArray = itemsInCart.filter(
      (element) => element?.itemID._id !== itemID
    );
    setItemsInCart(filteredArray);

    const filteredArrayLikeHome = itemsSameHome.filter(
      (element) => element?.itemID !== itemID
    );
    setItemsSameHome(filteredArrayLikeHome);
    console.log(filteredArray);
  }
  // change quantity
  async function changeQuantity(itemID, operation, itemPrice) {
    const updatedItemsInCart = itemsInCart.map((element) => {
      if (element?.itemID._id === itemID) {
        let newQuantity =
          operation === "+" ? element.quantity + 1 : element.quantity - 1;
        // Ensure quantity does not go below 1
        newQuantity = newQuantity < 1 ? 1 : newQuantity;
        return { ...element, quantity: newQuantity };
      }
      return element;
    });
    setItemsInCart(updatedItemsInCart);

    // Update itemsSameHome
    const updatedItemsSameHome = itemsSameHome.map((element) => {
      if (element?.itemID === itemID) {
        let newQuantity =
          operation === "+" ? element.quantity + 1 : element.quantity - 1;
        // Ensure quantity does not go below 1
        newQuantity = newQuantity < 1 ? 1 : newQuantity;
        return { ...element, quantity: newQuantity };
      }
      return element;
    });
    setItemsSameHome(updatedItemsSameHome);
  }
  // take form details of card
  const [cardDetails, setCardDetails] = useState({
    to: "",
    from: "",
    text: "",
  });
  // console.log(cardDetails);
  const [loadingCardDetaisl, setLoadingCardDetails] = useState(false);
  const [LoadingButtonCat, setLoadingButtonCat] = useState(false);
  const [cardID, serCardID] = useState("");
  // console.log(cardID);

  function takeCardInfo(e) {
    let myCard = { ...cardDetails };
    myCard[e.target.name] = e.target.value;
    setCardDetails(myCard);
  }
  async function sendCardInfo(e) {
    setLoadingCardDetails(true);
    e.preventDefault();
    try {
      let { data } = await axios.post(
        "https://freelance1-production.up.railway.app/customer/makeCard",
        cardDetails
      );
      console.log(data);
      setCardDetails({
        to: "",
        from: "",
        text: "",
      });
      setLoadingCardDetails(false);
      serCardID(data?._id);
    } catch (error) {}
  }
  // done
  const [classForAddress, setClassForAddress] = useState("");
  async function clickSubmit(e) {
    setLoadingButtonCat(true);
    e.preventDefault();
    const cartInfo = {
      items: itemsSameHome,
      cart: cartID,
    };
    if (cartID === null || cartID == "") {
    } else {
      try {
        let { data } = await axios.patch(
          "https://freelance1-production.up.railway.app/customer/editCart",
          cartInfo
        );
        setLoadingButtonCat(false);
        getCart();
        setClassForAddress("d-none");
        setFlowerNumber(2);
      } catch (error) {}
    }
  }
  const [flowerNumber, setFlowerNumber] = useState(1);
  // cards type work
  // const [getAllItems, setGetAllItems] = useState([]);
  // const [cardItems, setCardItems] = useState([]);
  // console.log(cardItems);

  // const [loadingCardItems, setLoadingCardItems] = useState(false);
  // useEffect(() => {
  //   allItems();
  // }, []);

  // useEffect(() => {
  //   if (getAllItems.length > 0) {
  //     setLoadingCardItems(true);
  //     filterItems(); // Call filterItems when getAllItems has been updated
  //   }
  // }, [getAllItems]);
  // async function allItems() {
  //   try {
  //     let { data } = await axios.get(
  //       "http://freelance1-production.up.railway.app/customer/getItems"
  //     );
  //     setGetAllItems(data); // Update state with fetched data
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // function filterItems() {
  //   let newItems = getAllItems.filter((element) => {
  //     return element.category.includes("66eb01faabe2d8434b90b4f3");
  //   });

  //   setCardItems(newItems);
  //   setLoadingCardItems(false);
  // }

  // done

  // adress form
  const [takeState, setTakeState] = useState("");
  const [takeArea, setTakeArea] = useState("");
  const [addressID, setAddressId] = useState("");
  const[orderClass , setOrderClass] = useState("d-none")
  // console.log(addressID);

  const [addressInfo, setAddressInfo] = useState({
    customerID: userId,
    apartment: "",
    floor: "",
    building: "",
    state: "",
    street: "",
    area: "",
  });
  useEffect(() => {
    setAddressInfo((prevInfo) => ({
      ...prevInfo,
      state: takeState,
      area: takeArea,
    }));
  }, [takeState, takeArea]);
  function selectArea(value) {
    setTakeArea(value);
  }
  function selectState(value) {
    setTakeState(value);
  }
  function takeContentOFAddress(e) {
    let myAddress = { ...addressInfo };
    myAddress[e.target.name] = e.target.value;
    setAddressInfo(myAddress);
  }
  async function sendAddress(e) {
    setLoadingButtonCat(true);
    e.preventDefault();
    try {
      let { data } = await axios.post(
        "https://freelance1-production.up.railway.app/customer/addAddress",
        addressInfo
      );
      // console.log(data);
      setAddressId(data._id);
      setLoadingButtonCat(false);
      setOrderClass("")
    } catch (error) {}
  }
  const [orderInfo, setOrderInfo] = useState({
    cart: cartID,
    address: addressID,
    time: "",
    data: "",
    shippingCost: "",
    card: cardID,
  });
  // done
  return (
    <>
      <NavBar user={user} logOut={logOut} cartID={cartID} />
      <HeadOfPages user={user} cartID={cartID} itemsArray={itemsSameHome} />
      <div className="container-xxl">
        <div className="w-100 d-flex justify-content-center">
          <div className="w-[90%] d-flex justify-content-center my-5 gap-4 flex-wrap">
            <div className="">
              <div className="d-flex justify-content-center gap-2 align-items-center ">
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="position-relative">
                    {flowerNumber == 1 ? (
                      <img src={purpleCircle} alt="" />
                    ) : (
                      <img src={doneCircle} alt="" />
                    )}

                    <p className="position-absolute start-50 top-50 translate-middle">
                      1
                    </p>
                  </div>
                  <p className="textForPInCart">Card & QR</p>
                </div>
                <img src={Arrow} alt="" />
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="position-relative ">
                    {flowerNumber == 3 ? (
                      <img src={doneCircle} alt="" />
                    ) : flowerNumber == 2 ? (
                      <img src={purpleCircle} alt="" />
                    ) : (
                      <img src={grayCircle} alt="" />
                    )}

                    <p className="position-absolute start-50 top-50 translate-middle">
                      2
                    </p>
                  </div>
                  <p className="textForPInCart">Shipping details</p>
                </div>
                <img src={Arrow} alt="" />
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="position-relative ">
                    {flowerNumber == 3 ? (
                      <img src={purpleCircle} alt="" />
                    ) : (
                      <img src={grayCircle} alt="" />
                    )}

                    <p className="position-absolute start-50 top-50 translate-middle">
                      3
                    </p>
                  </div>
                  <p className="textForPInCart">Payment</p>
                </div>
              </div>
              <p className="mt-3">Type Your Feelings....</p>
              <div className={classForAddress}>
                <form>
                  <input
                    onChange={takeCardInfo}
                    type="text"
                    placeholder="To"
                    className="form-control my-3 "
                    name="to"
                    value={cardDetails.to}
                  />
                  <textarea
                    onChange={takeCardInfo}
                    placeholder="Card Message"
                    className="form-control mb-3"
                    rows="4" // Adjust the number of rows as needed
                    name="text"
                    value={cardDetails.text}
                  ></textarea>
                  <input
                    onChange={takeCardInfo}
                    type="text"
                    placeholder="From"
                    className="form-control"
                    name="from"
                    value={cardDetails.from}
                  />
                  {loadingCardDetaisl ? (
                    <div className="w-100 justify-content-center d-flex">
                      <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        onClick={sendCardInfo}
                        className="btn btn-primary w-100"
                      >
                        Add your card
                      </button>
                    </div>
                  )}
                </form>
              </div>
              {classForAddress == "d-none" ? (
                <div>
                  <form>
                    <div className="d-flex justify-content-center gap-2 my-3">
                      <select
                        className="form-control"
                        onChange={(e) => selectState(e.target.value)}
                      >
                        <option value="" disabled selected>
                          Select State
                        </option>
                        <option value="Cairo">Cairo </option>
                        <option value="Alexandria">Alexandria </option>
                        <option value="Elmonofia">Elmonofia</option>
                      </select>
                      <select
                        className="form-control"
                        onChange={(e) => selectArea(e.target.value)}
                      >
                        <option value="" disabled selected>
                          Select Area
                        </option>
                        {takeState === "Cairo" && (
                          <>
                            <option value="Cairo">Cairo</option>
                            <option value="Giza">Giza</option>
                            <option value="Helwan">Helwan</option>
                            <option value="October">October</option>
                          </>
                        )}
                        {takeState === "Elmonofia" && (
                          <>
                            <option value="منوف ">منوف </option>
                            <option value="الباجور">الباجور </option>
                            <option value="كوم الضبع">كوم الضبع</option>
                            <option value="سرس الليان">سرس الليان</option>
                            <option value="بئر العرب">بئر العرب</option>
                            <option value="قويسنا">قويسنا</option>
                            <option value="بركه السبع">بركه السبع</option>
                            <option value="مليج">مليج</option>
                            <option value="الراهب">الراهب</option>
                            <option value="الماي">الماي</option>
                            <option value="شنوان">شنوان</option>
                            <option value="شبراباص">شبراباص</option>
                            <option value="كفر طنبدي">كفر طنبدي</option>
                            <option value="الكوم الاخضر">الكوم الاخضر</option>
                            <option value="البتانون">البتانون</option>
                            <option value="ميت خلف">ميت خلف</option>
                            <option value="اصطباري">اصطباري</option>
                            <option value="كفر البتانون">كفر البتانون </option>
                            <option value="الدلاتون">الدلاتون</option>
                            <option value="الشهداء">الشهداء</option>
                            <option value="تلا">تلا </option>
                            <option value="منشاء عصام">منشاء عصام</option>
                            <option value="اشمون">اشمون</option>
                            <option value="السادات">السادات</option>
                            <option value="شبين الكوم">شبين الكوم</option>
                          </>
                        )}
                        {takeState === "Alexandria" && (
                          <>
                            <option value="Alexandria">Alexandria</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className="w-100">
                      <input
                        type="text"
                        className="w-100 form-control"
                        placeholder="Street *"
                        name="street"
                        onChange={takeContentOFAddress}
                        value={addressInfo.street}
                      />
                    </div>
                    <div className="d-flex justify-content-center gap-2 my-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Bulding *"
                        name="building"
                        onChange={takeContentOFAddress}
                        value={addressInfo.building}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Floor *"
                        name="floor"
                        onChange={takeContentOFAddress}
                        value={addressInfo.floor}
                      />
                    </div>
                    <div className="d-flex justify-content-start">
                      <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Apartment"
                        name="apartment"
                        onChange={takeContentOFAddress}
                        value={addressInfo.apartment}
                      />
                    </div>
                  </form>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="d-flex forSmallScreenDivBasket justify-content-start flex-column w-50 ">
              {loading ? (
                <div className="w-100 justify-content-center d-flex">
                  <i className="fa fa-spinner fa-spin responsive-font-size-h1 text-primary"></i>
                </div>
              ) : itemsInCart === null || itemsInCart.length === 0 ? (
                <p className="text-center">No Items In Cart</p>
              ) : (
                itemsInCart.map((element, i) => (
                  <div
                    key={i}
                    className="inSmallScreenBasket  d-flex justify-content-center gap-2 w-100 mb-3"
                  >
                    <div className="styleOfImageInCart rounded">
                      <img
                        src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.itemID?.images[0]}`}
                        alt=""
                        className="w-100 h-100 rounded"
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-center gap-3 w-75 p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="textForPInCartWithImage">
                          {element?.itemID?.name}
                        </p>
                        <i
                          onClick={() => {
                            deleteItem(element?.itemID._id);
                          }}
                          className="fa-solid fa-trash-can cursorPOinter"
                        ></i>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="textForPInCartWithImage">
                          EGP {element?.itemID?.lastPrice}
                        </p>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <button
                            onClick={() => {
                              changeQuantity(
                                element?.itemID?._id,
                                "-",
                                element?.itemID?.lastPrice
                              );
                            }}
                            className="btn border classForButtonBasket"
                          >
                            -
                          </button>
                          <p>{element?.quantity}</p>
                          <button
                            onClick={() => {
                              changeQuantity(
                                element?.itemID?._id,
                                "+",
                                element?.itemID?.lastPrice
                              );
                            }}
                            className="btn border classForButtonBasket"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {flowerNumber == 2 ? (
                itemsInCart === null || itemsInCart.length === 0 ? (
                  ""
                ) : (
                  <div>
                    <p className="ms-4 mb-3 mt-4"> Summary</p>
                    <div className="w-100 d-flex justify-content-between px-4 mb-5">
                      <p>Total</p>
                      <p>EGP {totalCost}</p>
                    </div>
                  </div>
                )
              ) : (
                ""
              )}

              {LoadingButtonCat ? (
                <div className="w-100 mt-3 justify-content-center d-flex">
                  <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                </div>
              ) : (
                <div className="mt-3 d-flex justify-content-center">
                  {flowerNumber == 2 ? (
                    <button
                      onClick={sendAddress}
                      className="w-[80%] btn btn-primary"
                    >
                      Continue Shopping
                    </button>
                  ) : (
                    <button
                      onClick={clickSubmit}
                      className="w-[80%] btn btn-primary"
                    >
                      Proceed to Shipping Details
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
