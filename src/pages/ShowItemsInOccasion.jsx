import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import  axios  from 'axios';

export default function ShowItemsInOccasion({user}) {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure `id` from location.state, or set to undefined if state is null
  const { id } = location.state || {};

  let { cartID } = location.state || "";
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
  }, [itemsArray]);
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
          "https://freelance1-production.up.railway.app/customer/createCart",
          createCartInfo
        );
        // console.log(data);
        goToBasket();
      } catch (error) {
        if (error.response && error.response.status === 409) {
          editeCart(e);
        }
      }
    }
  }
  async function editeCart(e) {
    setLoadingButtonCat(true);
    e.preventDefault();
    const cartInfo = {
      items: itemsArray,
      cart: cartID,
    };
    if (cartID === null || cartID == "") {
    } else {
      try {
        let { data } = await axios.patch(
          "https://freelance1-production.up.railway.app/customer/editCart",
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

  function ShowItemContent(itemDetails) {
    navigate("/item-content", { state: { items: itemDetails } });
  }
  useEffect(() => {
    if (!id) {
      // If no ID is found, navigate to another page
      navigate("/home"); // Redirect to home or another appropriate page
    }
  }, [id, navigate]); // Dependencies array includes `id` and `navigate`

  if (!id) {
    return null; // Optionally render nothing or a fallback UI until redirect
  }
  // show items now
  useEffect(() => {
    getAllItems();
  }, []);
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = allItems.slice(indexOfFirstItem, indexOfLastItem);
  // console.log(currentItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const [loadingAllItems, setLoadingAllItems] = useState(false);
  const [errorForAllItems, setErrorForAllItems] = useState("");
  async function getAllItems() {
    setLoadingAllItems(true);
    try {
      let { data } = await axios.get(
        `https://freelance1-production.up.railway.app/customer/itemsOfOccasions/${id}`
      );
      // console.log(data);
      setLoadingAllItems(false);
      setErrorForAllItems("");
      setAllItems(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoadingAllItems(false);
        setErrorForAllItems("no items");
      }
    }
  }
  function goHome() {
    navigate("/home");
  }
  // dorpDownlIst
  const [selectedOption, setSelectedOption] = useState("");
  // console.log(selectedOption);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  useEffect(() => {
    filterItems();
  }, [selectedOption]);
  const filterItems = () => {
    let filteredItems = [...allItems]; // Create a copy to avoid mutating the original array

    switch (selectedOption) {
      case "option1":
        filteredItems.sort((a, b) => a.name.localeCompare(b.name)); // Sort A-Z
        break;
      case "option2":
        filteredItems.sort((a, b) => b.name.localeCompare(a.name)); // Sort Z-A
        break;
      case "option3":
        filteredItems.sort((a, b) => a.price - b.price); // Sort Low-High
        break;
      case "option4":
        filteredItems.sort((a, b) => b.price - a.price); // Sort High-Low
        break;
      default:
        break;
    }

    // Only update state if there is a change
    setAllItems(filteredItems);
  };
  return (
    <>
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
      <div className="container-xxl ">
        <div className="d-flex flex-row  justify-content-center mt-5 mb-4">
          <div className="container-xxl">
            <div className="d-flex justify-content-between">
              <div className="ms-4 inSmallScreen">
                Showing {currentPage} - {totalPages}
              </div>
              <div className="me-4 d-flex justify-content-center align-items-center gap-2">
                <p className="inSmallScreen">Sort by:</p>
                <div>
                  <select
                    id="dropdown"
                    className="form-select"
                    value={selectedOption}
                    onChange={handleSelectChange}
                  >
                    <option value="" disabled>
                      Recommended
                    </option>
                    <option value="option1">Name (A - Z)</option>
                    <option value="option2">Name (Z - A)</option>
                    <option value="option3">Price (Low - High)</option>
                    <option value="option4">Price (High - Low)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center  gap-4 flex-wrap mb-5">
              {currentItem === null || currentItem.length === 0 ? (
                loadingAllItems ? (
                  <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                ) : (
                  <p>{errorForAllItems}</p>
                )
              ) : (
                currentItem.map((element, i) => (
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
                         onClick={() => {
                          addToCart(element._id, 1, element?.type);
                        }}
                        className="btn text-white ColorButton classForButtonForCardForBestSeller w-100"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pagination-controls my-4 d-flex justify-content-center ">
              <button
                className="btn btn-secondary mx-2 inSmallScreenButton"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Previous
              </button>
              <span className="mx-2 mt-2 ">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary mx-2 inSmallScreenButton"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
