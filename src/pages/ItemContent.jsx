import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ItemContent({ user }) {
  const location = useLocation();
  const { items } = location.state || {};

  let navigate = useNavigate();

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
                src={`https://akflorist.s3.eu-north-1.amazonaws.com/${images[selectedIndex]}`}
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
                        src={`https://akflorist.s3.eu-north-1.amazonaws.com/${image}`}
                        alt={`Image ${index + 1}`}
                        className="img-fluid w-100 h-100 rounded"
                      />
                    </div>
                  ))}
            </div>
            <div className="w-100 d-flex justify-content-center mb-3 mt-2 responsive-font-size-p-items">
          <p className="text-center text-muted ">
              {" "}
              Note: Double tab to open image larger
            </p>
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
                   onClick={() => {
                    addToCart(element._id, 1, element?.type);
                  }}
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
        <div className={classToShowImage}>
          <div onClick={closeImage} className="position-absolute end-4 top-5">
            <button className="btn btn-close"></button>
          </div>
          <div className="w-50 inSmallScreenInsideWindowImage h-100 rounded">
            <img
              src={`https://akflorist.s3.eu-north-1.amazonaws.com/${images[selectedIndex]}`}
              alt=""
              className="w-100 h-100 rounded"
            />
          </div>
        </div>
      </div>
    </>
  );
}
