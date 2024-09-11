import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HeadOfPages({ user }) {
  let navigate = useNavigate();
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
        "https://freelance1-production.up.railway.app/customer/getItems"
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

  return (
    <>
      {user?.role === "admin1" || user?.role === "admin2" ? (
        ""
      ) : isLoginPage ? (
        ""
      ) : (
        <div className="d-flex justify-content-center position-relative bg-transparent py-3">
          <span className="position-absolute end-14 top-7 responsive-font-size-p">
            <i className="fa-solid fa-cart-shopping text-muted"></i>
          </span>
          {/* search work */}
          <div className="d-flex flex-column justify-content-center align-items-center w-100 ">
            <div className="w-50 d-flex justify-content-center align-items-center gap-1 classforResponsive">
              <input
                type="text"
                className="form-control w-75"
                placeholder="What Are You Looking For?"
                onChange={searchFromItems}
                value={searchTerm}
              />
              {/* <i className="fa-solid fa-magnifying-glass responsive-for-i-head-page text-info cursorPOinter"></i> */}
            </div>
            {filteredItems === null || filteredItems.length === 0 ? (
              ""
            ) : (
              <div className="styleForResultSearch d-flex justify-content-center flex-column align-items-center overflow-y-scroll position-absolute bg-white z-20">
                {filteredItems === null || filteredItems.length === 0 ? (
                  "Not Found"
                ) : (
                  filteredItems.map((element, i) => (
                    <p
                      onClick={() => {
                        handleSearch(element.name);
                      }}
                      key={i}
                      className="text-center text-[#323232] cursor-pointer my-1"
                    >
                      {element.name}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
