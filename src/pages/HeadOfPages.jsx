import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function HeadOfPages({ user, cartID, itemsArray }) {
  const notify = (text) => toast(text);
  let navigate = useNavigate();
  const customerID = user?.userId || null;
  const customerRolee = user?.role || null;
  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgetPassword";
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllItems();
  }, []);

  async function getAllItems() {
    try {
      let { data } = await axios.get(
        "https://akflorist-production.up.railway.app/customer/getItems"
      );
      setAllItems(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Not Found");
      }
    }
  }

  function searchFromItems(e) {
    const inputValue = e.target.value.toLowerCase(); // Get the current input value directly
    setSearchTerm(inputValue);

    if (inputValue === "") {
      setFilteredItems([]); // Clear the filtered items if input is empty
    } else {
      const filtered = allItems.filter((item) =>
        item.name.toLowerCase().includes(inputValue)
      );
      setFilteredItems(filtered);
    }
  }

  function handleSearch(nameOfItem) {
    navigate("/result-search", { state: { itemName: nameOfItem } });
    setFilteredItems([]);
    setSearchTerm("");
  }
  function handleSubmitSearch(nameOfItem) {
    // console.log(nameOfItem);
    navigate("/result-search", { state: { itemName: nameOfItem } });
    setFilteredItems([]);
    setSearchTerm("");
  }
  // cart work
  const userID =
    user?.role == "customer" ? user?.userId || null : user?.id || null;
  const cartIds = cartID;
  const itemsArrays = itemsArray;
  const [createCartInfo, setCreateCartInfo] = useState({
    items: itemsArray,
    customer: [
      {
        customerID: customerID,
        customerRole: customerRolee,
      },
    ],
  });
  async function handleSubmitCreateCart(e) {
    // setLoadingButtonCat(true);
    // console.log(createCartInfo);

    e.preventDefault();
    if (createCartInfo.customer == null) {
      // alert("please Login ");
      notify("please Login");
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
            const deleteCartId = {
              customerID: customerID,
            };
            deleteCartUser(e, deleteCartId);
            handleSubmitCreateCart(e);
            setLoadingButtonCat(false);
          } else {
            editeCart(e);
          }
        } else if (error.response && error.response.status === 400) {
          navigate("/cart");
        }
      }
    }
  }
  async function deleteCartUser(e, userID) {
    e.preventDefault();
    try {
      let { data } = await axios.delete(
        "https://akflorist-production.up.railway.app/customer/deleteCart",
        userID
        // {
        //   data: , // Pass customerID in the body of the request
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // }
      );
      // console.log(data);
      // handleSubmitCreateCart(e)
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  }

  async function editeCart(e) {
    e.preventDefault();
    const cartInfo = {
      items: itemsArrays,
      cart: cartIds,
    };
    if (cartIds === null || cartIds == "") {
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
      state: { userId: userID },
    });
  }
  // done
  return (
    <>
      <ToastContainer />
      {user?.role === "admin1" || user?.role === "admin2" ? (
        ""
      ) : isLoginPage ? (
        ""
      ) : (
        <div className="d-flex justify-content-center position-relative bg-transparent py-3">
          <span
            onClick={handleSubmitCreateCart}
            className="position-absolute cursorPOinter inSmallPageHeadPageCart end-14 top-7 responsive-font-size-p z-1"
          >
            <i className="fa-solid fa-cart-shopping text-muted"></i>
          </span>
          <div className="position-absolute end-11 top-3 bg-[#ecd9e8] inSmallPageHeadPageCartNumber rounded-circle">
            <p className="p-1">{itemsArrays.length}</p>
          </div>
          {/* search work */}
          <div className="d-flex flex-column justify-content-center  align-items-center w-100 ">
            <div className="w-50 inSmallScreenSearchHeadPage">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitSearch(searchTerm);
                }}
                className="w-100 d-flex justify-content-center align-items-center gap-1 classforResponsive"
              >
                <input
                  type="text"
                  className="form-control w-75"
                  placeholder="What Are You Looking For?"
                  onChange={searchFromItems}
                  value={searchTerm}
                />
                <i
                  onClick={() => {
                    handleSubmitSearch(searchTerm);
                  }}
                  className="fa-solid fa-magnifying-glass responsive-for-i-head-page text-info cursorPOinter"
                ></i>
              </form>
            </div>
            {filteredItems === null || filteredItems.length === 0 ? (
              ""
            ) : (
              <div className="styleForResultSearch d-flex justify-content-start flex-column align-items-center overflow-y-scroll position-absolute bg-white z-20">
                {filteredItems === null || filteredItems.length === 0
                  ? "Not Found"
                  : filteredItems.map((element, i) => (
                      <p
                        onClick={() => {
                          handleSearch(element.name);
                        }}
                        key={i}
                        className="text-center text-[#323232] cursor-pointer my-1"
                      >
                        {element.name}
                      </p>
                    ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
