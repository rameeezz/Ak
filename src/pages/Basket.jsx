import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import purpleCircle from "../assets/card photo/purple-flower.svg";
import grayCircle from "../assets/card photo/gray-flower.svg";
import Arrow from "../assets/card photo/guidance-arrow.svg";
import axios from "axios";
import NavBar from './../component/NavBar';
export default function Basket({user , logOut}) {
  let location = useLocation();
  let { userId } = location.state || null;

  // console.log(userId);
  const [itemsInCart, setItemsInCart] = useState([]);
  // console.log(itemsInCart);
  const [itemsSameHome, setItemsSameHome] = useState([]);
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
  let navigate = useNavigate();
  async function deleteItem(itemID) {
    if (!itemID || !cartID) {
      alert("Invalid item or cart ID.");
      return;
    }

    const deleteDetails = { cart: cartID, itemID: itemID };

    try {
      let { data } = await axios.patch(
        "https://freelance1-production.up.railway.app/customer/removeItemFromCart",
        deleteDetails
      );
      await getCart();
      // console.log(data);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
  // change quantity
  async function changeQuantity(e, itemID, operation) {
    e.preventDefault();
    const quantityInfo = {
      customerID: userId,
      itemID: itemID,
      operation: operation,
    };
    if (
      quantityInfo.customerID === null ||
      quantityInfo.itemID == "" ||
      quantityInfo.operation == ""
    ) {
      alert("Please Try Again.");
    } else {
      try {
        let { data } = await axios.patch(
          "https://freelance1-production.up.railway.app/customer/changeQuantity",
          quantityInfo
        );
        // console.log(data);
        setTotalCost(data.cart.totalCost);
        setItemsSameHome(data.cart.items);
        getCart();
      } catch (error) {}
    }
  }
  // take form details of card
  const [cardDetails, setCardDetails] = useState({
    to: "",
    from: "",
    text: "",
  });
  // console.log(cardDetails);
  const [loadingCardDetaisl, setLoadingCardDetails] = useState(false);
  const[cardID , serCardID] = useState("")
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
      serCardID(data?._id)
    } catch (error) {}
  }
  // done
  function clickSubmit() {
    // localStorage.setItem("cartItems", JSON.stringify([]));
  }
  return (
    <>
    <NavBar user={user} logOut={logOut} cartID={cartID} />

    <div className="position-fixed  bg-white z-[131]">

    </div>
      <div className="container-xxl">
        <div className="w-100 d-flex justify-content-center">
          <div className="w-[90%] d-flex justify-content-center my-5 gap-4 flex-wrap">
            <div className="">
              <div className="d-flex justify-content-center gap-2 align-items-center ">
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="position-relative">
                    <img src={purpleCircle} alt="" />
                    <p className="position-absolute start-50 top-50 translate-middle">
                      1
                    </p>
                  </div>
                  <p className="textForPInCart">Card & QR</p>
                </div>
                <img src={Arrow} alt="" />
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="position-relative ">
                    <img src={grayCircle} alt="" />
                    <p className="position-absolute start-50 top-50 translate-middle">
                      2
                    </p>
                  </div>
                  <p className="textForPInCart">Shipping details</p>
                </div>
                <img src={Arrow} alt="" />
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="position-relative ">
                    <img src={grayCircle} alt="" />
                    <p className="position-absolute start-50 top-50 translate-middle">
                      3
                    </p>
                  </div>
                  <p className="textForPInCart">Payment</p>
                </div>
              </div>
              <p className="mt-3">Type Your Feelings....</p>
              <div>
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
                            onClick={(e) => {
                              changeQuantity(e, element?.itemID?._id, "-");
                            }}
                            className="btn border classForButtonBasket"
                          >
                            -
                          </button>
                          <p>{element?.quantity}</p>
                          <button
                            onClick={(e) => {
                              changeQuantity(e, element?.itemID?._id, "+");
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

              {itemsInCart === null || itemsInCart.length === 0 ? (
                ""
              ) : (
                <div>
                  <p className="ms-4 mb-3 mt-4"> Summary</p>
                  <div className="w-100 d-flex justify-content-between px-4 mb-5">
                    <p>Total</p>
                    <p>EGP {totalCost}</p>
                  </div>
                </div>
              )}
              <div className="mt-3 d-flex justify-content-center">
                <button
                  onClick={clickSubmit}
                  className="w-[80%] btn btn-primary"
                >
                  Proceed to Shipping Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
