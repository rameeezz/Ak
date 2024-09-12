import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchItems({ user }) {
  const location = useLocation();
  const { itemName } = location.state || {};
  // console.log(itemName);
  
  let navigate = useNavigate();

  function addToCart() {
    if (user == null) {
      console.log("yarab");
      navigate("/login");
    } else {
      alert("نتمنى لكم حياة افضل ");
    }
  }

  function goHome() {
    navigate("/home");
  }

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loadingAllItems, setLoadingAllItems] = useState(false);
  useEffect(() => {
    getAllItems();
  }, []);

  useEffect(() => {
    setLoadingAllItems(true)
    // Filter items after allItems is set and itemName is available
    if (allItems.length > 0 && itemName) {
      searchFromItems();
      setLoadingAllItems(false)
    }
  }, [allItems, itemName]); // Run this when allItems or itemName changes

  async function getAllItems() {
    if (itemName == undefined) {
      console.log("wait");
      
    }else{
      try {
        let { data } = await axios.get(
          "https://freelance1-production.up.railway.app/customer/getItems"
        );
        setAllItems(data); // Set items first
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("Not Found");
        }
      }
    }
  }

  function searchFromItems() {
    const filtered = allItems.filter((item) =>
      item.name.toLowerCase().includes(itemName.toLowerCase())
    );
    setFilteredItems(filtered);
  }

  //   pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  function ShowItemContent(itemDetails) {
    navigate("/item-content", { state: { items: itemDetails } });
  }
  return (
    <>
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
      <div className="d-flex justify-content-center  gap-4 flex-wrap mb-5">
        {currentItem === null || currentItem.length === 0 ? (
          loadingAllItems ? (
            <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
          ) : (
            ""
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
