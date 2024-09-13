import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import purpleCircle from "../assets/card photo/purple-flower.svg";
import grayCircle from "../assets/card photo/gray-flower.svg";
import Arrow from "../assets/card photo/guidance-arrow.svg";
import axios from "axios";
export default function Basket() {
  let location = useLocation();
  let { userId } = location.state || null;
  
  // console.log(userId);
  const [itemsInCart, setItemsInCart] = useState([]);
  const [cartID, setCartId] = useState("");
  
  const [totalCost, setTotalCost] = useState("");
  useEffect(() => {
    getCart();
  }, []);
  // console.log(totalCost);
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(itemsInCart));
  }, [itemsInCart]);
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
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("No Items");
        }
      }
    }
  }
  let navigate = useNavigate();
  function goHome() {
    navigate("/home", { state: { cartID: cartID } });
  }
  async function deleteItem(itemID) {
    if (!itemID || !cartID) {
      alert("Invalid item or cart ID.");
      return;
    }

    const deleteDetails = { cart: cartID, itemID: itemID };

    try {
      await axios.patch(
        "https://freelance1-production.up.railway.app/customer/removeItemFromCart",
        deleteDetails
      );
      await getCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
  function clickSubmit() {
    // localStorage.setItem("cartItems", JSON.stringify([]));
  }
  return (
    <>
      <div className="container-xxl ">
        <div className="d-flex flex-column align-items-start justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">Basket</h2>
          <div className="d-flex justify-content-center gap-1 mt-1 align-items-center">
            <i className="fa-solid fa-house-chimney text-muted"></i>
            <p className="cursorPOinter" onClick={goHome}>
              Home
            </p>
            <i className="fa-solid fa-angle-right text-muted"></i>
            <p>Card & QR</p>
          </div>
        </div>
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
                    type="text"
                    placeholder="To"
                    className="form-control my-3 "
                  />
                  <textarea
                    placeholder="Card Message"
                    className="form-control mb-3"
                    rows="4" // Adjust the number of rows as needed
                  ></textarea>
                  <input
                    type="text"
                    placeholder="From"
                    className="form-control"
                  />
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
                    className="inSmallScreenBasket  d-flex justify-content-center gap-2 w-100"
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
                          <button className="btn border classForButtonBasket">
                            -
                          </button>
                          <p>{element?.quantity}</p>
                          <button className="btn border classForButtonBasket">
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
                <button onClick={clickSubmit} className="w-[80%] btn btn-primary">
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
