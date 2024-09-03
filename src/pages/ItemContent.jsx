import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ItemContent({ user }) {
  const location = useLocation();
  const { items } = location.state || {};

  let navigate = useNavigate();
  function addToCart() {
    if (user == null) {
      console.log("yarab");
      navigate("/login");
    } else {
      alert("نتمنى لكم حياة افضل ");
    }
  }
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = items.images;

  const [startPosition, setStartPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const changePhoto = (index) => {
    setSelectedIndex(index);
  };

  const leftArrow = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const rightArrow = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleMouseDown = (event) => {
    setStartPosition(event.clientX);
    setIsDragging(true);
  };

  const handleMouseUp = (event) => {
    if (!isDragging) return;

    const endPosition = event.clientX;
    const difference = startPosition - endPosition;

    if (difference > 50) {
      rightArrow();
    } else if (difference < -50) {
      leftArrow();
    }

    setIsDragging(false);
  };

  const handleTouchStart = (event) => {
    setStartPosition(event.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (event) => {
    if (!isDragging) return;

    const endPosition = event.changedTouches[0].clientX;
    const difference = startPosition - endPosition;

    if (difference > 50) {
      rightArrow();
    } else if (difference < -50) {
      leftArrow();
    }

    setIsDragging(false);
  };
  return (
    <>
      <div className="">
        <div className="container-xxl  d-flex justify-content-center gap-2 forSmallScreenItemPage ">
          <div className="d-flex justify-content-center flex-column w-50 mt-5 mb-3">
            {/* Main Image with Arrows */}
            <div
              className="heightOfImageInItems w-100 d-flex justify-content-center align-items-center rounded gap-3"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onDragStart={(e) => e.preventDefault()} // Prevent default image dragging behavior
              style={{ cursor: "grab" }} // Show grab cursor
            >
              <i
                onClick={leftArrow}
                className="fa-solid fa-angle-left cursor-pointer"
              ></i>
              <img
                src={`https://freelance1-production.up.railway.app/${images[selectedIndex]}`}
                alt=""
                className="w-100 h-100 rounded"
              />
              <i
                onClick={rightArrow}
                className="fa-solid fa-angle-right cursor-pointer"
              ></i>
            </div>

            {/* Thumbnail Images */}
            <div
              className="d-flex w-100 overflow-x-auto flex-row justify-content-start mt-3 gap-3 widthOfPhotosForSmallPages"
              style={{
                whiteSpace: "nowrap", // Prevent wrapping of images
              }}
            >
              {images.length === 0
                ? "No images available"
                : images.map((image, index) => (
                    <div
                      onClick={() => changePhoto(index)}
                      key={index}
                      style={{ minWidth: "100px", maxWidth: "100px" }}
                      className={`rounded  cursor-pointer smallPhotosStyleItemPage ${
                        selectedIndex === index ? "active-thumbnail" : ""
                      }`}
                    >
                      <img
                        src={`https://freelance1-production.up.railway.app/${image}`}
                        alt={`Image ${index + 1}`}
                        className="img-fluid w-100 h-100 rounded"
                      />
                    </div>
                  ))}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-start align-items-center w-50 my-5 cardOfContentInSmallScreen gap-3">
            <div className="mb-3 mt-5 forSmallScreenDiv">
              <h2 className="responsive-font-size-h1 text-center">
                {items?.name}
              </h2>
            </div>
            <div className="mb-3">
              <h4 className="responsive-font-size-p-items">
                {items?.description}
              </h4>
            </div>
            <div className="d-flex flex-row justify-content-center forSmallScreenButton mb-5 w-100">
              <div className="firstButtonInSmallScreen">
                <p className="text-center bg-[#9cdce6] rounded-none mt-2 p-3 w-100 buttonForSmallScreen">
                  {items?.price} EGP
                </p>
              </div>
              <div className="firstButtonInSmallScreen">
                <button
                  onClick={addToCart}
                  className="btn  rounded-none text-white ColorButton classForButtonForCard w-100 mt-2 me-3 p-3 buttonForSmallScreen"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            {/* <div className="d-flex flex-row justify-content-start">
            <p>Pay in installments with:</p>
          </div> */}
          </div>
        </div>
      </div>
      {/* <h1>{items?.name}</h1>
      <img src={`https://freelance1-production.up.railway.app/${items.images[0]}`} alt="" />
      <p>{items?.description}</p>
      <p>{items?.price} EGP</p> */}
    </>
  );
}
