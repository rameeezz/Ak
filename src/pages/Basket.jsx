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
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Basket({ user, logOut }) {
  // console.log(user);
  const notify = (text) => toast(text);
  let location = useLocation();
  let navigate = useNavigate();
  let token = localStorage.getItem("token");
  let decodeToken = jwtDecode(token);
  let userId =
    decodeToken?.role == "customer"
      ? decodeToken?.userId || null
      : decodeToken?.id || null;
  const customerRolee = decodeToken?.role || null;

  // console.log(userId);
  const [itemsInCart, setItemsInCart] = useState([]);
  // console.log(itemsInCart);
  const [itemsSameHome, setItemsSameHome] = useState([]);
  // console.log(" **************************** ");

  // console.log(itemsSameHome);

  const [cartID, setCartId] = useState("");
  const [totalCost, setTotalCost] = useState("");
  // console.log(totalCost);
  const [numberOfPay, setNumberOfPay] = useState(0);
  useEffect(() => {
    if (userId) {
      getCart();
    }
  }, [userId]);
  // console.log(totalCost);
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(itemsSameHome));
  }, [itemsSameHome]);
  useEffect(() => {
    localStorage.setItem("cartID", JSON.stringify(cartID));
  }, [cartID]);
  // console.log(cartID);

  const [loading, setLoading] = useState(false);
  async function getCart() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://akflorist-production.up.railway.app/customer/getCart/${userId}`
      );
      setItemsInCart(data.getThisCart.items);
      setTotalCost(data.getThisCart.totalCost);
      setCartId(data.getThisCart._id);
      setOrderInfo({ ...orderInfo, cart: data?.getThisCart?._id });
      setUserPromoCode({ ...userPromoCode, cartId: data?.getThisCart?._id });
      setItemsSameHome(data.items);
      // console.log(data.items);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // alert("No Items");
      } else {
        console.error("Error fetching cart:", error.message);
      }
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of outcome
    }
  }

  // async function getCart() {
  //   setLoading(true);
  //   if (userId == null) {
  //     setLoading(false);
  //     // navigate("/basket")
  //     console.log("sa");
  //   } else if (userId != null) {
  //     try {
  //       let { data } = await axios.get(
  //         `https://akflorist-production.up.railway.app/customer/getCart/${userId}`
  //       );
  //       setItemsInCart(data.getThisCart.items);
  //       setTotalCost(data.getThisCart.totalCost);
  //       setCartId(data.getThisCart._id);
  //       setOrderInfo({ ...orderInfo, cart: data.getThisCart._id });
  //       setItemsSameHome(data.items);
  //       setLoading(false);
  //     } catch (error) {
  //       if (error.response && error.response.status === 404) {
  //         alert("No Items");
  //       }
  //     }
  //   }
  // }
  async function deleteItem(itemID) {
    const filteredArray = itemsInCart.filter(
      (element) => element?.itemID._id !== itemID
    );
    setItemsInCart(filteredArray);

    const filteredArrayLikeHome = itemsSameHome.filter(
      (element) => element?.itemID !== itemID
    );
    setItemsSameHome(filteredArrayLikeHome);
    // console.log(filteredArray);
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
        "https://akflorist-production.up.railway.app/customer/makeCard",
        cardDetails
      );
      // console.log(data);
      setCardDetails({
        to: "",
        from: "",
        text: "",
      });
      setLoadingCardDetails(false);
      serCardID(data?._id);
      setOrderInfo({ ...orderInfo, card: data?._id });
      notify("card added successfully");
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
          "https://akflorist-production.up.railway.app/customer/editCart",
          cartInfo
        );
        setLoadingButtonCat(false);
        getCart();
        setClassForAddress("d-none");
        setFlowerNumber(2);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // alert("please add items to the cart ");
          notify("please add items to the cart ");
          setLoadingButtonCat(false);
        }
      }
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
  const [orderClass, setOrderClass] = useState("d-none");
  // console.log(addressID);

  const [addressInfo, setAddressInfo] = useState({
    customer: [
      {
        customerID: userId,
        customerRole: customerRolee,
      },
    ],
    apartment: "",
    floor: "",
    building: "",
    state: "",
    street: "",
    area: "",
  });
  // console.log(addressInfo);

  useEffect(() => {
    setAddressInfo((prevInfo) => ({
      ...prevInfo,
      state: takeState,
      area: takeArea,
    }));
  }, [takeState, takeArea]);
  function selectArea(value) {
    setAlertAddressWrongArea(false);
    setTakeArea(value);
    // console.log(value);

    let shippingCost = 0;

    if (value === "") {
      // Reset or do nothing when the default option is selected
      shippingCost = 0;
    } else if (value == "منوف") {
      shippingCost = 120;
    } else if (value === "الباجور") {
      shippingCost = 120;
    } else if (value === "كوم الضبع") {
      shippingCost = 80;
    } else if (value === "سرس الليان" || value === "بئر العرب") {
      shippingCost = 140;
    } else if (value === "قويسنا") {
      shippingCost = 120;
    } else if (value === "بركه السبع") {
      shippingCost = 110;
    } else if (value === "شبراباص") {
      shippingCost = 70;
    } else if (value === "كفر طنبدي") {
      shippingCost = 30;
    } else if (value === "اصطباري") {
      shippingCost = 100;
    } else if (value === "تلا") {
      shippingCost = 130;
    } else if (value === "اشمون" || value === "السادات") {
      shippingCost = 250;
    } else if (value === "الشهداء") {
      shippingCost = 90;
    } else if (value === "شبين الكوم") {
      shippingCost = 25;
    } else if (
      value === "مليج" ||
      value === "الراهب" ||
      value === "الماي" ||
      value === "شنوان" ||
      value === "الكوم الاخضر" ||
      value === "البتانون" ||
      value === "ميت خلف" ||
      value === "كفر البتانون" ||
      value === "الدلاتون" ||
      value === "منشاء عصام"
    ) {
      shippingCost = 60;
    } else if (value === "Cairo") {
      shippingCost = 250;
    } else if (value === "Giza") {
      shippingCost = 275;
    } else if (value === "October") {
      shippingCost = 275;
    } else if (value === "Helwan") {
      shippingCost = 275;
    } else if (value === "Alexandria") {
      shippingCost = 275;
    }

    setOrderInfo({ ...orderInfo, shippingCost });
  }

  function selectState(value) {
    setAlertAddressWrongState(false);
    setTakeState(value);
    setTakeArea("");
  }
  const [NumberDetails, setNumberDetails] = useState({
    userID: user?.role == "customer" ? user?.userId || null : user?.id || null,
    mobileNumber: "",
  });
  function dateOfOrder(e) {
    setOrderInfo({ ...orderInfo, date: e.target.value });
  }
  function takeNumber(e) {
    setNumberDetails({ ...NumberDetails, mobileNumber: e.target.value });
  }
  async function putNumber(e) {
    e.preventDefault();
    try {
      let { data } = await axios.patch(
        "https://akflorist-production.up.railway.app/customer/addNumber",
        NumberDetails
      );
    } catch (error) {}
  }
  function timeOfOrder(value) {
    // console.log(value);
    setOrderInfo({ ...orderInfo, time: value });
  }
  function takeContentOFAddress(e) {
    setAlertAddressWrongStreet(false);
    let myAddress = { ...addressInfo };
    myAddress[e.target.name] = e.target.value;
    setAddressInfo(myAddress);
  }
  const [alertAddressWrongArea, setAlertAddressWrongArea] = useState(false);
  const [alertAddressWrongState, setAlertAddressWrongState] = useState(false);
  const [alertAddressWrongStreet, setAlertAddressWrongStreet] = useState(false);
  async function sendAddress(e) {
    setLoadingButtonCat(true);
    e.preventDefault();
    if (addressInfo.state == "") {
      setAlertAddressWrongState(true);
    } else if (addressInfo.area == "") {
      setAlertAddressWrongArea(true);
    } else if (addressInfo.street == "") {
      setAlertAddressWrongStreet(true);
    }
    if (orderInfo.time == "" || orderInfo.date == "") {
      notify("please put date and time");
      setLoadingButtonCat(false);
    } else {
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/customer/addAddress",
          addressInfo
        );
        // console.log(data);
        setAddressId(data._id);
        setOrderInfo({ ...orderInfo, address: data._id });
        setLoadingButtonCat(false);
        setOrderClass("");
        setFlowerNumber(3);
        setOrderClass("");
        setAlertAddressWrongArea(false);
        setAlertAddressWrongState(false);
        setAlertAddressWrongStreet(false);
        putNumber(e);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          notify(
            "Please ensure all required fields are filled out correctly before proceeding."
          );
          // alert(
          //   "Please ensure all required fields are filled out correctly before proceeding"
          // );
          setLoadingButtonCat(false);
        }
      }
    }
  }
  const [orderInfo, setOrderInfo] = useState({
    cart: "",
    address: addressID,
    time: "",
    date: "",
    shippingCost: 0,
    card: cardID,
    // mobileNumber:""
  });
  // console.log(orderInfo);
  const [responseOfOrder, setResponseOfOrder] = useState({});
  const [classOfReset, setClassOfReset] = useState("d-none");
  function CloseReset() {
    setClassOfReset("d-none");
    handleShowPopup();
    setNavigateToHome(true);
  }
  // console.log(responseOfOrder);

  const [showPopup, setShowPopup] = useState(false);
  const [navigateToHome, setNavigateToHome] = useState(false);
  async function sendOrder(e) {
    setLoadingButtonCat(true);
    e.preventDefault();

    if (numberOfPay === 1) {
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/payment/offlinePayment",
          orderInfo
        );
        // console.log(data.order);
        setResponseOfOrder(data.order);
        setLoadingButtonCat(false);
        localStorage.setItem("cartItems", []); // Clear cart items
        setItemsInCart([]); // Reset cart state
        setClassOfReset(
          "w-50 position-fixed bg-white shadow top-50 start-50 translate-middle p-3 rounded inSmallScreenOfCart"
        );
      } catch (error) {
        setLoadingButtonCat(false); // Reset loading on error
      }
    } else if (numberOfPay === 2) {
      // First, update orderInfo state
      setOrderInfo((prevOrderInfo) => ({
        ...prevOrderInfo,
        shippingCost: 0,
      }));

      // Now, send the API request after state update
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/payment/offlinePayment",
          {
            ...orderInfo,
            shippingCost: 0, // Ensure the correct state is sent
          }
        );
        setResponseOfOrder(data.order);
        setLoadingButtonCat(false);
        localStorage.setItem("cartItems", []); // Clear cart
        setItemsInCart([]); // Reset cart state
        setClassOfReset(
          "w-50 position-fixed bg-white shadow top-50 start-50 translate-middle p-3 rounded inSmallScreenOfCart"
        );
      } catch (error) {
        setLoadingButtonCat(false); // Reset loading on error
        // console.error(error);
      }
    } else {
      // alert("Please select a payment method.");
      notify("Please select a payment method.");
      setLoadingButtonCat(false);
    }
  }

  // done
  function setHowPayOnDeliver() {
    setNumberOfPay(1);
  }
  function setHowPayOnLine() {
    setNumberOfPay(2);
  }
  // pop up

  const handleShowPopup = () => {
    setShowPopup(true);
  };
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
        // Only navigate after the popup has been hidden
        if (navigateToHome) {
          navigate("/home");
          setNavigateToHome(false); // Reset the navigation flag
        }
      }, 2000); // Show popup for 2 seconds

      // Clear the timer when component unmounts or popup closes
      return () => clearTimeout(timer);
    }
  }, [showPopup, navigateToHome]);
  // promo code
  const [userPromoCode, setUserPromoCode] = useState({
    cartId: "",
    code: "",
  });
  const [errorMessageForPromo, setErrorMessageForPromo] = useState("");
  // console.log(userPromoCode);

  function getPromoCode(e) {
    setErrorMessageForPromo("");
    let myPromo = { ...userPromoCode };
    myPromo[e.target.name] = e.target.value;
    setUserPromoCode(myPromo);
  }
  async function sendUserPromoCode(e) {
    setLoadingButtonCat(true);
    e.preventDefault();
    if (userPromoCode.code == "" || userPromoCode.code == null) {
      sendOrder(e);
    } else if (numberOfPay === 1) {
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/customer/addPromoCode",
          userPromoCode
        );
        // console.log(data);

        setErrorMessageForPromo("");
        sendOrder(e);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessageForPromo("This Promo Code Doesnt Work.");
          setLoadingButtonCat(false);
        }
        if (error.response && error.response.status === 422) {
          setErrorMessageForPromo("This Promo Used Before.");
          setLoadingButtonCat(false);
        }
      }
    } else if (numberOfPay === 2) {
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/customer/addPromoCode",
          userPromoCode
        );
        // console.log(data);

        setErrorMessageForPromo("");
        sendOrder(e);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessageForPromo("This Promo Code Doesnt Work.");
          setLoadingButtonCat(false);
        }
        if (error.response && error.response.status === 422) {
          setErrorMessageForPromo("This Promo Used Before.");
          setLoadingButtonCat(false);
        }
      }
    } else {
      // alert("Please select a payment method.");
      notify("Please select a payment method.");
      setLoadingButtonCat(false);
    }
  }
  function goToItems(idOfCategory) {
    navigate("/show-items", { state: { id: idOfCategory, cartID: cartID } });
  }
  return (
    <>
      <NavBar user={user} logOut={logOut} cartID={cartID} />
      <HeadOfPages user={user} cartID={cartID} itemsArray={itemsSameHome} />
      <div className={classOfReset}>
        <p className="w-100 text-start">
          total cost :{" "}
          <span className="text-muted">
            {" "}
            {responseOfOrder.totalCost || "N/A"}
          </span>
        </p>
        <p className="w-100 text-start mt-3">
          time :{" "}
          <span className="text-muted">{responseOfOrder.time || "N/A"}</span>
        </p>
        <p className="w-100 text-start mt-3">
          {" "}
          date :{" "}
          <span className="text-muted">
            {" "}
            {responseOfOrder.submitDate
              ? responseOfOrder.submitDate.slice(0, 10)
              : "N/A"}
          </span>
        </p>
        <div className="w-100 d-flex justify-content-center mt-4">
          <button onClick={CloseReset} className="btn btn-primary">
            Ok
          </button>
        </div>
      </div>
      <div className="container-xxl">
        <div className="w-100 d-flex justify-content-center">
          <div className="w-[90%] d-flex justify-content-center my-5 gap-4 flex-wrap">
            <div className="">
              {showPopup && (
                <div
                  className="popup-overlay position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center "
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div className="popup-box bg-white p-4 rounded shadow-lg d-flex flex-column justify-content-center align-items-center inSmallscreenWidthOFCArds">
                    {/* Checkmark icon with 360-degree rotation */}
                    <i
                      className="fa fa-check-circle rotate-checkmark"
                      style={{ fontSize: "80px", color: "green" }}
                    ></i>
                    <p className=" mt-4 responsive-font-size-h3">Success!</p>
                  </div>
                </div>
              )}
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

              {orderClass === "d-none" ? (
                classForAddress == "d-none" ? (
                  <div>
                    <form>
                      <div className="d-flex justify-content-center gap-2 my-3">
                        {alertAddressWrongState ? (
                          <select
                            required
                            className="form-control border border-2 border-danger"
                            onChange={(e) => selectState(e.target.value)}
                          >
                            <option value="" disabled selected>
                              Select State
                            </option>
                            <option value="Cairo">Cairo </option>
                            <option value="Alexandria">Alexandria </option>
                            <option value="Elmonofia">Elmonofia</option>
                          </select>
                        ) : (
                          <select
                            required
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
                        )}
                        {alertAddressWrongArea ? (
                          <select
                            required
                            className="form-control border border-2 border-danger"
                            key={takeState} // Key resets the dropdown when takeState changes
                            value={takeArea || ""} // Ensure the default value is selected when no area is picked
                            onChange={(e) => selectArea(e.target.value)}
                          >
                            <option value="" disabled>
                              Select area
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
                                <option value="منوف">منوف </option>
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
                                <option value="الكوم الاخضر">
                                  الكوم الاخضر
                                </option>
                                <option value="البتانون">البتانون</option>
                                <option value="ميت خلف">ميت خلف</option>
                                <option value="اصطباري">اصطباري</option>
                                <option value="كفر البتانون">
                                  كفر البتانون
                                </option>
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
                        ) : (
                          <select
                            required
                            className="form-control"
                            key={takeState} // Key resets the dropdown when takeState changes
                            value={takeArea || ""} // Ensure the default value is selected when no area is picked
                            onChange={(e) => selectArea(e.target.value)}
                          >
                            <option value="" disabled>
                              Select area
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
                                <option value="منوف">منوف </option>
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
                                <option value="الكوم الاخضر">
                                  الكوم الاخضر
                                </option>
                                <option value="البتانون">البتانون</option>
                                <option value="ميت خلف">ميت خلف</option>
                                <option value="اصطباري">اصطباري</option>
                                <option value="كفر البتانون">
                                  كفر البتانون
                                </option>
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
                        )}
                      </div>
                      <div className="w-100">
                        {alertAddressWrongStreet ? (
                          <input
                            required
                            type="text"
                            className="w-100 form-control border border-2 border-danger"
                            placeholder="Street *"
                            name="street"
                            onChange={takeContentOFAddress}
                            value={addressInfo.street}
                          />
                        ) : (
                          <input
                            required
                            type="text"
                            className="w-100 form-control"
                            placeholder="Street *"
                            name="street"
                            onChange={takeContentOFAddress}
                            value={addressInfo.street}
                          />
                        )}
                      </div>
                      <div className="d-flex justify-content-center gap-2 my-3">
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder="Bulding *"
                          name="building"
                          onChange={takeContentOFAddress}
                          value={addressInfo.building}
                        />
                        <input
                          required
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
                          required
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
                )
              ) : (
                <div className="d-flex justify-content-center flex-wrap">
                  <div className="w-100 d-flex justify-content-center mt-3">
                    <button
                      onClick={setHowPayOnDeliver}
                      className={`p-3 cursorPOinter btn btn-info w-[80%] ${
                        numberOfPay == 1
                          ? "border border-primary border-2 bg-white"
                          : ""
                      }`}
                    >
                      Payment Upon Delivery
                    </button>
                  </div>
                  <div className="w-100 d-flex justify-content-center mt-3">
                    <button
                      onClick={setHowPayOnLine}
                      className={`p-3 cursorPOinter btn btn-info w-[80%] ${
                        numberOfPay == 2
                          ? "border border-primary border-2 bg-white"
                          : ""
                      }`}
                    >
                      Pickup
                    </button>
                  </div>
                </div>
              )}

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
                  <div className="d-flex justify-content-center mt-3">
                    <button
                      onClick={() => {
                        goToItems("66fdee5ff8cb186d0962e7d0");
                      }}
                      className="btn btn-primary w-100"
                    >
                      Choose your card
                    </button>
                  </div>
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
              {flowerNumber == 2 ? (
                <div className="border p-4 mb-3 mt-4 rounded">
                  <p className="">Shipping Methods</p>
                  <form>
                    {takeState === "Alexandria" && (
                      <div>
                        <input
                          type="date"
                          onChange={dateOfOrder}
                          required
                          name="date"
                          className="form-control my-3"
                          placeholder="Date"
                        />
                        <select
                          className="form-control"
                          required
                          onChange={(e) => timeOfOrder(e.target.value)}
                        >
                          <option value="">Select Time</option>
                          <option value="Between 5pm  -  9pm">
                            Between 5pm - 9pm{" "}
                          </option>
                        </select>
                      </div>
                    )}
                    {takeState === "Elmonofia" && (
                      <div>
                        <input
                          required
                          type="date"
                          onChange={dateOfOrder}
                          name="date"
                          className="form-control my-3"
                          placeholder="Date"
                        />
                        <select
                          required
                          className="form-control"
                          onChange={(e) => timeOfOrder(e.target.value)}
                        >
                          <option value="">Select Time</option>
                          <option value="Between 11am  -  1pm">
                            Between 11am - 1pm{" "}
                          </option>
                          <option value="Between 1pm - 3pm">
                            Between 1pm - 3pm
                          </option>
                          <option value="Between 3pm - 5pm">
                            Between 3pm - 5pm
                          </option>
                          <option value="Between 5pm - 7pm">
                            Between 5pm - 7pm
                          </option>
                          <option value="Between 7pm - 9pm">
                            Between 7pm - 9pm
                          </option>
                          <option value="Between 9pm - 11pm">
                            Between 9pm - 11pm
                          </option>
                        </select>
                      </div>
                    )}
                    {takeState === "Cairo" && (
                      <div>
                        <input
                          required
                          type="date"
                          onChange={dateOfOrder}
                          name="date"
                          className="form-control my-3"
                          placeholder="Date"
                        />
                        <select
                          required
                          className="form-control"
                          onChange={(e) => timeOfOrder(e.target.value)}
                        >
                          <option value="">Select Time</option>
                          <option value="Between 2pm  -  6pm">
                            Between 2pm - 6pm{" "}
                          </option>
                          <option value="Between 7pm - 11pm">
                            Between 7pm - 11pm
                          </option>
                        </select>
                      </div>
                    )}
                    {user?.role == "customer" ? (
                      ""
                    ) : (
                      <input
                        type="text"
                        className="form-control my-3"
                        onChange={takeNumber}
                        required
                        placeholder="Please enter your mobile number"
                      />
                    )}
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
                        {flowerNumber == 2 || flowerNumber == 3 ? (
                          ""
                        ) : (
                          <i
                            onClick={() => {
                              deleteItem(element?.itemID._id);
                            }}
                            className="fa-solid fa-trash-can cursorPOinter"
                          ></i>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="textForPInCartWithImage">
                          EGP {element?.itemID?.lastPrice}
                        </p>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          {flowerNumber == 2 || flowerNumber == 3 ? (
                            ""
                          ) : (
                            <div className="d-flex justify-content-center gap-3 align-items-center">
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
                          )}
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
                    <div className="w-100 d-flex justify-content-between px-4 mb-2">
                      <p>Total</p>
                      <p>EGP {totalCost}</p>
                    </div>
                    <div className="w-100 d-flex justify-content-between px-4 mb-5">
                      <p>Shipping </p>
                      <p>EGP {orderInfo.shippingCost}</p>
                    </div>
                  </div>
                )
              ) : (
                ""
              )}
              {flowerNumber == 3 ? (
                itemsInCart === null || itemsInCart.length === 0 ? (
                  ""
                ) : (
                  <div className="w-100 mt-4 d-flex justify-content-between px-4 mb-5">
                    <form>
                      <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">
                          Promo Code
                        </label>
                        <input
                          onChange={getPromoCode}
                          type="text"
                          class="form-control w-100"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          name="code"
                          value={userPromoCode.code}
                        />
                      </div>
                      {errorMessageForPromo == "" ? (
                        ""
                      ) : (
                        <p className="text-danger">{errorMessageForPromo}</p>
                      )}
                    </form>
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
                  ) : flowerNumber === 3 ? (
                    <button
                      onClick={sendUserPromoCode}
                      className="w-[80%] btn btn-primary"
                    >
                      Payment
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
      <ToastContainer />
    </>
  );
}
