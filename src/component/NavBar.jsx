import React, { useEffect, useState } from "react";
import "../css/NavBar.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NavBar({ user, logOut }) {
  let navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(false);
  const [category, setCategory] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null); // Track which category is expanded
  const [subCategory, setSubCategory] = useState([]);
  const [categoryWithSubCategories, setCategoryWithSubCategories] = useState({}); // Store which categories have subcategories

  function openNav() {
    setActiveNav(true);
  }

  function CloseNav() {
    setActiveNav(false);
    setExpandedCategory(null)
  }

  useEffect(() => {
    getCategory();
  }, []);

  async function getCategory() {
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/admin1/getCategories"
      );
      setCategory(data);
    } catch (error) {
      // Handle error if needed
    }
  }

  async function getSubCategory(idOfCategory) {
    setExpandedCategory(null)
    try {
      let { data } = await axios.get(
        `https://freelance1-production.up.railway.app/admin1/getCategoryContent/${idOfCategory}`
      );
      if (data.subcategories && data.subcategories.length > 0) {
        // Store that this category has subcategories
        setCategoryWithSubCategories((prev) => ({
          ...prev,
          [idOfCategory]: true,
        }));

        // Toggle expanded state
        setExpandedCategory((prevCategory) =>
          prevCategory === idOfCategory ? null : idOfCategory
        );
        setSubCategory(data.subcategories);
      } else {
        navigate("/showItems", { state: { id: idOfCategory } });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("No subcategories or items found for this category");
      }
    }
  }

  return (
    <>
      {user?.role === "admin1" || user?.role === "admin2" ? (
        ""
      ) : (
        <>
          <div
            onClick={openNav}
            className="position-fixed z-3 bg-transparent start-5 top-5 d-flex flex-column gap-1 justify-content-center p-3 cursorPointer"
          >
            <div className="styleFOrNav shadow"></div>
            <div className="styleFOrNav shadow"></div>
            <div className="styleFOrNav shadow"></div>
          </div>
          <div
            className={`position-fixed styleOfNavToGetOut bgForNav ${
              activeNav ? "active" : ""
            }`}
          >
            <div
              onClick={CloseNav}
              className="btn btn-close position-absolute end-5 top-5"
            ></div>
            <div className="text-white d-flex justify-content-center mt-5">
              <Link to="home">Home</Link>
            </div>
            {category.length === 0 ? (
              <p className="my-3 text-center text-black p-2">
                Currently, there are no categories available. Please check back
                later.
              </p>
            ) : (
              category.map((element, i) => (
                <div key={i}>
                  <p
                    onClick={() => getSubCategory(element?._id)}
                    className="my-3 text-center text-white CursorPointer"
                  >
                    {element?.name}
                    {categoryWithSubCategories[element?._id] && (
                      <span className="ms-2">
                        {expandedCategory === element?._id ? (
                          <span>&#9660;</span> // Down arrow
                        ) : (
                          <span>&#9654;</span> // Right arrow
                        )}
                      </span>
                    )}
                  </p>
                  <div
                    className={`subcategories-container ${
                      expandedCategory === element?._id ? "expanded" : ""
                    }`}
                  >
                    {/* Render the subcategories here */}
                    <div className="d-flex justify-content-center flex-column align-items-center">
                      {subCategory === null || subCategory.length === 0
                        ? ""
                        : subCategory.map((subElement, i) => (
                            <Link
                              key={i}
                              to={{
                                pathname: "showItems",
                              }}
                              state={{ id: subElement?._id }} // Pass the id as state
                              className="text-white text-center FontSizeForP"
                            >
                              {subElement?.name}
                            </Link>
                          ))}
                    </div>
                  </div>
                </div>
              ))
            )}
            {user != null ? (
              <>
                <div className="d-flex justify-content-center my-2">
                  <div className="w-50 bg-black rounded-2 shadow HeightOfDivBeforeLogOut"></div>
                </div>
                <div className="d-flex justify-content-center text-white">
                  <button onClick={logOut}>log out</button>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex justify-content-center my-2">
                  <div className="w-50 bg-black rounded-2 shadow HeightOfDivBeforeLogOut"></div>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <NavLink
                    to="register"
                    className={(isActive) =>
                      isActive
                        ? "nav-link active text-white"
                        : "nav-link text-white"
                    }
                  >
                    Register
                  </NavLink>
                  <NavLink
                    to="login"
                    className={(isActive) =>
                      isActive
                        ? "nav-link active text-white"
                        : "nav-link text-white"
                    }
                  >
                    login
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
