import React, { useEffect, useState } from "react";
import axios from "axios";
import image from "../assets/card photo/1.jpeg";
export default function CartVeiw({ user }) {
  const customerID =
    user?.role == "customer" ? user?.userId || null : user?.id || null;
  const [userCart, setuserCart] = useState([]);
  // console.log(userCart);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(userCart.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = userCart.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);
  const [loadingCart, setLoadingCart] = useState(false);
  async function getOrders() {
    setLoadingCart(true);
    try {
      let { data } = await axios.get(
        `https://akflorist-production.up.railway.app/customer/getOrder/${customerID}`
      );
      setLoadingCart(false);
      // console.log(data.getThisCart);
      setuserCart(data.getThisCart);
    } catch (error) {}
  }
  useEffect(() => {
    if (customerID) {
      getOrders();
    }
  }, [customerID]);
  const [classOfCard, setClassOfCard] = useState(false);
  function showCard() {
    setClassOfCard(true);
  }
  function hideCard() {
    setClassOfCard(false);
  }
  return (
    <>
      <div className="d-flex justify-content-center">
        {loadingCart ? (
          <div className="w-100 h-vh bg-white d-flex justify-content-center align-items-center">
            <div className="w-100 justify-content-center d-flex">
              <i className="fa fa-spinner fa-spin responsiveSpinnerForCartView text-[#D4B11C]"></i>
            </div>
          </div>
        ) : currentItem == null || currentItem.length == 0 ? (
          <div className="d-flex flex-column align-items-center mt-5 h-vh gap-3">
            <p className="mt-5 border border-2 p-5 rounded text-center responsive-font-size-h1">
              No Orders Here
            </p>
          </div>
        ) : (
          <div className="CardOFAllOreder d-flex align-items-center gap-3 shadow bg-white rounded mt-5 flex-coulmn flex-wrap px-4 pb-4">
            <div className="w-100 text-end mt-4">
              <p>Orders</p>
            </div>
            {currentItem.map((element, i) => (
              <div key={i} className="w-100">
                <div className="d-flex justify-content-start align-items-center gap-3 flex-column w-100">
                  {element.items && element.items.length > 0
                    ? element.items.map((item, i) => (
                        <div
                          key={i}
                          className="d-flex position-relative justify-content-start gap-3 border border-2 rounded p-1 w-100 h-[120px]"
                        >
                          <div className="position-absolute bottom-2 end-3 forClassforBtnInCartView">
                            {/* <button className="btn bg-[#f68b1e] text-white forBtnInCartView ">More details</button> */}
                            <p className="bg-[#f68b1e] text-white p-2 rounded forBtnInCartView">
                              {element.totalCost} EGP
                            </p>
                          </div>
                          <div className="inSmallScreenCartVeiwPhoto">
                            {item?.itemID?.images &&
                            item?.itemID?.images.length > 0 ? (
                              <img
                                src={`https://akflorist.s3.eu-north-1.amazonaws.com/${item?.itemID?.images[0]}`}
                                // src={image}
                                alt={item?.itemID?.name}
                                className="w-100 h-100"
                              />
                            ) : (
                              <span>No image available</span>
                            )}
                          </div>
                          <div className=" d-flex flex-column justify-content-center gap-2 responsiveNameInOrder">
                            <p className="text-start">
                              {typeof item?.itemID?.name === "string"
                                ? item?.itemID?.name.slice(0, 42)
                                : "No name available"}
                            </p>
                            <p>
                              {element?.done == false ? (
                                <p className="bg-info text-white text-center responsiveForOreder">
                                  Under delivery{" "}
                                </p>
                              ) : (
                                <p className="bg-success text-white text-center responsiveForOreder">
                                  Delivered{" "}
                                </p>
                              )}
                            </p>
                            <div className="d-flex justify-content-start gap-1">
                              <span>Arrival date </span>
                              <span>{element?.date.slice(0, 10)}</span>
                            </div>
                            <div className="d-flex justify-content-start gap-2 align-items-center">
                              <span>Card </span>
                              <i
                                onClick={showCard}
                                className="fa-solid fa-info text-primary cursorPOinter mb-1"
                              ></i>
                            </div>
                            {classOfCard ? (
                              <div className="w-50 classForCardPreview position-fixed top-50 start-50 translate-middle shadow bg-white p-5 rounded">
                                <div onClick={hideCard} className="position-absolute end-3 top-2 btn btn-close"></div>
                                <div className="d-flex flex-column">
                                  {/* <p>{element.}</p> */}
                                  <p className="text-center">This feature coming soon</p>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      ))
                    : "No items found"}
                </div>
              </div>
            ))}
          </div>
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
