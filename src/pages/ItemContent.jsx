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
  const images = items.images;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [startPosition, setStartPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [classToShowImage, setClasstoShowImage] = useState("d-none");

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
    setIsDragging(false);
  };

  const handleMouseUp = (event) => {
    if (isDragging) {
      return; // Skip opening the image if it was a drag
    }

    const endPosition = event.clientX;
    const difference = startPosition - endPosition;

    if (difference > 50) {
      rightArrow();
    } else if (difference < -50) {
      leftArrow();
    }
  };

  const handleTouchStart = (event) => {
    setStartPosition(event.touches[0].clientX);
    setIsDragging(false);
  };

  const handleTouchEnd = (event) => {
    if (isDragging) {
      return; // Skip opening the image if it was a drag
    }

    const endPosition = event.changedTouches[0].clientX;
    const difference = startPosition - endPosition;

    if (difference > 50) {
      rightArrow();
    } else if (difference < -50) {
      leftArrow();
    }
  };
  function openImage() {
    setClasstoShowImage(
      "d-flex justify-content-center align-items-center position-fixed bg-white rounded w-50 inSmallScreenWindowImage top-50 start-50 translate-middle shadow h-50 z-3 p-3"
    );
  }

  function closeImage() {
    setClasstoShowImage("d-none");
  }
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
                onDoubleClick={openImage}
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
            <p className="text-center text-muted ">
              {" "}
              Note: Double tab to open image larger
            </p>
          </div>
        </div>
        <div className={classToShowImage}>
          <div onClick={closeImage} className="position-absolute end-4 top-5">
            <button className="btn btn-close"></button>
          </div>
          <div className="w-50 inSmallScreenInsideWindowImage h-100 rounded">
            <img
              src={`https://freelance1-production.up.railway.app/${images[selectedIndex]}`}
              alt=""
              className="w-100 h-100 rounded"
            />
          </div>
        </div>
      </div>
    </>
  );
}
