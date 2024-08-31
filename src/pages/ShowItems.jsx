import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeadOfPages from "./HeadOfPages";

export default function ShowItems() {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure `id` from location.state, or set to undefined if state is null
  const { id } = location.state || {};
  function addToCart() {
    if (user == null) {
      navigate("/login");
    } else {
      alert("نتمنى لكم حياة افضل ");
    }
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
    getSubCategories();
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
        `https://freelance1-production.up.railway.app/customer/getItemFromMainCategory/${id}`
      );
      // console.log(data.items);
      setLoadingAllItems(false);
      setErrorForAllItems("");
      setAllItems(data.items);
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

  // get sub categories
  const [allSubCategories, setAllSubCategories] = useState([]);
  async function getSubCategories() {
    try {
      let { data } = await axios.get(
        `https://freelance1-production.up.railway.app/customer/getSubCategories/${id}`
      );
      // console.log(data.getCategory);
      setAllSubCategories(data.getCategory);
      setErrorForAllItems("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorForAllItems("no items");
      }
    }
  }
  // for itmes in sub category
  const [selectedOptionForSubCategory, setSelectedOptionForSubCategory] =
    useState("");
  // console.log(selectedOptionForSubCategory);
  useEffect(() => {
    itemsInSubCategory();
  }, [selectedOptionForSubCategory]);
  const handleSelectChangeForSubCategory = (event) => {
    if (event.target.value === id) {
      getAllItems();
    } else {
      setSelectedOptionForSubCategory(event.target.value);
    }
  };
  async function itemsInSubCategory() {
    try {
      let { data } = await axios.get(
        `https://freelance1-production.up.railway.app/customer/getItemsFromCategory/${selectedOptionForSubCategory}`
      );
      // console.log(data);
      setAllItems(data);
      setErrorForAllItems("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAllItems([]);
        setErrorForAllItems("no items");
      }
    }
  }
  return (
    <>
      <HeadOfPages />
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
            <p>Best Sellers</p>
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
                <p className="inSmallScreen">Filter by:</p>
                <div>
                  <select
                    id="dropdown"
                    className="form-select"
                    value={selectedOptionForSubCategory}
                    onChange={handleSelectChangeForSubCategory}
                  >
                    <option value={id}>All</option>
                    {allSubCategories === null || allSubCategories.length === 0
                      ? ""
                      : allSubCategories.map((element, i) => (
                          <option value={element._id} key={i}>
                            {element.name}
                          </option>
                        ))}
                  </select>
                </div>
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
                src={`https://freelance1-production.up.railway.app/${element?.images[0]}`}
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
                  {element?.name}
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
    </>
  );
}
