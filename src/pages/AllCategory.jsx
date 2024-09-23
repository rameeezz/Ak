import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Home.css";
import PHoto1 from "../assets/card photo/2.jpeg";
import HeadOfPages from "./HeadOfPages";
export default function AllCategory({user}) {
  let location = useLocation();
  const [itemsArray, setItemsArray] = useState(() => {
    // Retrieve saved items from localStorage (if any)
    const savedItems = localStorage.getItem("cartItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const  parsedCartID= localStorage.getItem("cartID");
  const cartID = parsedCartID ? JSON.parse(parsedCartID) : "";
  let navigate = useNavigate();
  function goHome() {
    navigate("/home");
  }
  useEffect(() => {
    getAllCategory();
  }, []);
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
  // on click open the items
  function goToItems(idOfCategory) {
    navigate("/show-items", { state: { id: idOfCategory, cartID: cartID } });
  }
  return (
    <>
      <HeadOfPages user={user} cartID={cartID} itemsArray={itemsArray} />
      <div className="container-xxl ">
        <div className="d-flex flex-column align-items-start justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">
            Flowers Categories
          </h2>
          <p>Imagine - Explore - Enjoy Our Gifts</p>
          <div className="d-flex justify-content-center gap-1 mt-1 align-items-center">
            <i className="fa-solid fa-house-chimney text-muted"></i>
            <p className="cursorPOinter" onClick={goHome}>
              Home
            </p>
            <i className="fa-solid fa-angle-right text-muted"></i>
            <p>Categories</p>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <div className="d-flex flex-row justify-content-center gap-3 w-100 cursorPOinter flex-wrap">
          {allCategory.length === 0 ? (
            loadingForCategory ? (
              <div className="w-100 justify-content-center d-flex">
                <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
              </div>
            ) : (
              <div>{errorMessageForCategory}</div> // Ensure that this is a string or valid JSX
            )
          ) : (
            allCategory.map((element, i) => (
              <div
                onClick={() => {
                  goToItems(element._id);
                }}
                key={i}
                className="rounded w-80 position-relative forAllCategoryItems"
                // style={{ minWidth: "250px" }}
              >
                <img
                  src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.image}`}
                  alt=""
                  className="w-100 h-100 rounded"
                />
                <div className="position-absolute top-0 h-100 w-100 bg-black opacity-25 z-1 rounded"></div>
                <div className="d-flex justify-content-center align-items-center position-absolute w-100 h-100 z-3 top-0 styleForCategories z-2">
                  <h2 className="text-white text-center">{element?.name}</h2>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
