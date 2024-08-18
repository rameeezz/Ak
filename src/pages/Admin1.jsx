import React, { useEffect, useState, useRef, useCallback } from "react";
import "../css/Admin1.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import joi from "joi";
export default function Admin1({ logOut }) {
  let navigate = useNavigate();
  const [showAlert, setShowAlert] = useState("d-none");
  const showAlertMessage = () => {
    setShowAlert(" position-fixed start-3 top-5 alert alert-success w-25");
    setTimeout(() => {
      setShowAlert("d-none");
    }, 1000);
  };
  function GoTOLOgin() {
    navigate("/login");
    logOut();
  }

  // work of Add ADmin ************
  let [AdminInfo, setAdminInfo] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  // console.log(AdminInfo);
  let [ErrorMessage, setErrorMessage] = useState();
  const [errorList, setErrorList] = useState([]);
  // console.log(errorList);

  let [Loading, setLoading] = useState(false);
  function GetAdminInfo(e) {
    let myAdmin = { ...AdminInfo };
    myAdmin[e.target.name] = e.target.value;
    if (e.target.name === "username") {
      myAdmin.username = myAdmin.username.toLowerCase();
    }
    setAdminInfo(myAdmin);
  }

  async function HandleSubmitForAdmin(e) {
    e.preventDefault();
    let valid = ValidData();
    if (valid.error == null) {
      setLoading(true);
      setErrorList([]);
      try {
        let { data } = await axios.post(
          "https://freelance1-production.up.railway.app/admin1/addAdmin",
          AdminInfo
        );
        setLoading(false);
        setErrorMessage("");
        console.log(data.message);
        setAdminInfo({
          ...AdminInfo,
          username: "",
          password: "",
          confirmPassword: "",
        });
        showAlertMessage();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setLoading(false);
          setErrorMessage("username already exist.");
        }
      }
    } else {
      setErrorList(valid.error.details);
      setErrorMessage("");
      // console.log(valid.error.details);
    }
  }
  function ValidData() {
    const scheme = joi.object({
      username: joi.string().required().min(3).max(15).messages({
        "string.base": "username must be a string.",
        "string.empty": "username is required.",
        "string.min": "username must be at least 3 characters long.",
        "string.max": "username cannot exceed 15 characters.",
        "string.alphanum": "username must contain only letters and numbers.",
      }),

      password: joi.string().required().messages({
        "string.base": "Password must be a string.",
        "string.empty": "Password is required.",
        "string.pattern.base":
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }),
      confirmPassword: joi
        .string()
        .required()
        .valid(joi.ref("password"))
        .messages({
          "any.only": "Confirm Password must match the Password.",
          "string.empty": "Confirm Password is required.",
        }),
    });

    return scheme.validate(AdminInfo, { abortEarly: false });
  }
  // done admin  *********************
  // work of add category ********
  const [categoryName, setCategoryName] = useState({
    name: "",
  });

  function getCategoryName(e) {
    const myCategory = { ...categoryName };
    myCategory[e.target.name] = e.target.value;
    // console.log(myCategory);
    setCategoryName(myCategory);
    setErrorMessageForCategory("");
  }
  const [LoadingAddCategory, setLoadingAddCategory] = useState(false);
  const [ErrorMessageForCategory, setErrorMessageForCategory] = useState("");
  async function sendCategoryName(e) {
    e.preventDefault();
    if (categoryName.name === "") {
      alert("please write name of category");
    } else {
      setLoadingAddCategory(true);
      try {
        let { data } = await axios.post(
          "https://freelance1-production.up.railway.app/admin1/addCategory",
          categoryName
        );
        console.log(data);

        setLoadingAddCategory(false);
        // alert("done");
        setErrorMessageForCategory("");
        showAlertMessage();
        setCategoryName({
          name: "",
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // console.log("m4 dayf");
          setErrorMessageForCategory("try again later");
          setLoadingAddCategory(false);
        }
        if (error.response && error.response.status === 422) {
          // console.log("m4 dayf");
          setErrorMessageForCategory("Category creation failed.");
          setLoadingAddCategory(false);
        }
        if (error.response && error.response.status === 412) {
          // console.log("m4 dayf");
          setErrorMessageForCategory("This category already exists.");
          setLoadingAddCategory(false);
        }
      }
    }
  }
  // done add category *******************
  // Show category
  const [showCategory, setShowCategory] = useState([]);
  // console.log(showCategory);

  const [classOFShowCategroy, setClassOfShowCategory] = useState("d-none");
  async function getCategory() {
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/admin1/getCategories"
      );
      // console.log(data);
      setShowCategory(data);
    } catch (error) {
      if (error.response && error.response.status === 502) {
        alert("server is down try again later");
      }
      if (error.response && error.response.status === 404) {
        setShowCategory([]);
      }
    }
  }
  useEffect(() => {
    getCategory();
  }, []);
  function openCayegory() {
    setClassOfShowCategory("row text-center");
    getCategory();
  }
  function closeCategory() {
    setClassOfShowCategory("d-none");
  }
  // done show category *************
  // delete category
  const [setCategoryId, setSetCategoryId] = useState({
    categoryID: "",
  });
  // console.log(setCategoryId);

  const [sureMessage, setSureMessage] = useState("");
  const [classOFShowSureBox, setclassOFShowSureBox] = useState("d-none ");
  function DeleteCategory(IdOfElement) {
    setSetCategoryId({ ...setCategoryId, categoryID: IdOfElement });
    setSureMessage("are you sure you want to delete this category ?");
    setclassOFShowSureBox(
      "position-fixed top-50 start-50 translate-middle z-3 bg-white shadow rounded-3  text-black p-5"
    );
  }
  async function sureDeleteCategory() {
    // console.log(setCategoryId.categoryID);

    try {
      let { data } = await axios.delete(
        `https://freelance1-production.up.railway.app/admin1/deleteCategory/${setCategoryId.categoryID}`
      );
      console.log(data);
      showAlertMessage();
      setclassOFShowSureBox("d-none");
      getCategory();
    } catch (error) {}
  }
  function closeSureSection() {
    setclassOFShowSureBox("d-none");
  }
  // done delete categroy *****************
  // add items in category ***************\\\\\\

  const [itemsDetails, setItemsDetails] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    images: [],
  });
  const [showDivOfItems, setshowDivOfItems] = useState(false);
  // console.log(itemsDetails);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [showNameOfCategory, setshowNameOfCategory] = useState("");
  function putIdOfCategoryForItem(IdOfCategory, categoryNam) {
    setItemsDetails({ ...itemsDetails, category: IdOfCategory });
    setshowDivOfItems(true);
    setshowNameOfCategory(categoryNam);
  }
  function putItemInfo(e) {
    let myItem = { ...itemsDetails };
    myItem[e.target.name] = e.target.value;
    setItemsDetails(myItem);
    if (myItem[e.target.name] == "name") {
      setErrorMessageForItem("");
    }
  }
  const [errorMessageForItem, setErrorMessageForItem] = useState("");
  const imageInputRef = useRef(null);
  function handleImageOnChange(event) {
    const files = Array.from(event.target.files); // Convert FileList to Array
    // Create image preview URLs
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setItemsDetails((prev) => ({
      ...prev,
      images: [...prev.images, ...files], // Append new files to the existing array
    }));
    setImagePreviews((prev) => [...prev, ...imageUrls]);
  }
  const closeShowItems = () => {
    setshowDivOfItems(false);
    setItemsDetails({
      name: "",
      description: "",
      price: 0,
      category: "",
      images: [],
    });
    setshowNameOfCategory("");
    setImagePreviews([]);
  };
  const [isLoading, setIsLoading] = useState(false);
  async function sendItemDetail(e) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", itemsDetails.name);
    formData.append("description", itemsDetails.description);
    formData.append("price", itemsDetails.price);
    formData.append("category", itemsDetails.category);

    // Append each image in the array
    itemsDetails.images.forEach((image, index) => {
      formData.append("images", image); // Sending images without an index
    });
    if (itemsDetails.images.length >= 10) {
      alert("max number of images 10");
      setIsLoading(false);
    } else {
      try {
        let { data } = await axios.post(
          "https://freelance1-production.up.railway.app/admin1/additems",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log(data);
        // Reset the form or perform other actions
        console.log(data);

        setItemsDetails({
          name: "",
          description: "",
          price: 0,
          category: itemsDetails.category,
          images: [],
        });
        setImagePreviews([]);
        setIsLoading(false);
        setErrorMessageForItem("");
        showAlertMessage();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          setErrorMessageForItem("name already exist.");
        }
        if (error.response && error.response.status === 404) {
          alert("name is already exist.");
          setIsLoading(false);
        }
        if (error.response && error.response.status === 500) {
          alert("max number of images 10");
          setIsLoading(false);
        }
        if (error.response && error.response.status === 400) {
          alert("please add name and description");
          setIsLoading(false);
        }
      }
    }
  }
  // done add items in category /********/*/* */

  /* add status for each item IN stock or out  */

  const [itemsInCategory, setItemInCategory] = useState([]);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(itemsInCategory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = itemsInCategory.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const [classOfArrow, setClassOFArrow] = useState("d-none");
  // done pagination
  const [classForItems, setClassForItems] = useState("d-none");
  const [errorMessageForItemsInCategory, setErrorMessageForItemsInCategory] =
    useState("");
  const [loadingForItems, setLoadingForItems] = useState(false);
  const [idForOneItem, setIdForOneItem] = useState("");
  const [salePercent, setSalePercent] = useState({
    itemID: "",
    discount: 0,
  });
  async function getItems(e, itemID) {
    e.preventDefault();

    setLoadingForItems(true);
    setIdForOneItem(itemID);
    try {
      let { data } = await axios.get(
        `https://freelance1-production.up.railway.app/admin1/getItems/${itemID}`
      );
      // console.log(data);
      setLoadingForItems(false);
      setItemInCategory(data);
      setClassForItems(
        "d-flex justify-content-center gap-3 flex-wrap position-relative"
      );
      setClassOFArrow(
        "pagination-controls my-4 d-flex justify-content-center "
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessageForItemsInCategory("No Items In This Category.");
        setItemInCategory([]);
        setLoadingForItems(false);
        setClassForItems(
          "d-flex justify-content-center gap-3 flex-wrap position-relative"
        );
        setClassOFArrow(
          "pagination-controls my-4 d-flex justify-content-center "
        );
      }
    }
  }
  function CloseItemsInCategory() {
    setClassForItems("d-none");
    setSaleputted(false);
    setSalePercent({
      itemID: "",
      discount: 0,
    });
    setClassOFArrow("d-none ");
  }

  // delete items and status *******------------
  const [itemIDForDelete, setItemIdForDelete] = useState({ itemID: "" });
  const [sureDeleteItem, setSureDeleteItem] = useState("d-none");
  const [statusLoading, setStatusLoading] = useState(false);
  function putItemId(itemID) {
    setItemIdForDelete(itemID);
    // console.log(itemID);

    setSureDeleteItem(
      "position-fixed top-50 start-50 translate-middle z-3 bg-white shadow rounded-3  text-black p-5"
    );
  }
  function closeSureBox() {
    setSureDeleteItem("d-none");
  }
  async function deleteItem(e) {
    e.preventDefault();
    try {
      let { data } = await axios.delete(
        `https://freelance1-production.up.railway.app/admin1/deleteItem/${itemIDForDelete}`
      );
      // console.log(data);
      setSureDeleteItem("d-none");
      getItems(e, idForOneItem);
      showAlertMessage();
    } catch (error) {}
  }
  async function putStatusOfItem(e, idOfItem) {
    e.preventDefault();
    setStatusLoading(true);
    try {
      let { data } = await axios.patch(
        `https://freelance1-production.up.railway.app/admin1/changeStatus/${idOfItem}`
      );
      setStatusLoading(false);
      // console.log(data);
      getItems(e, idForOneItem);
    } catch (error) {}
  }
  /* end of status and delete ****************************----*/
  // work on sale of item
  const [loadForPercent, setLoadForPercent] = useState(false);
  // console.log(salePercent);

  function putSalePercent(e) {
    setSalePercent({ ...salePercent, discount: e.target.value });
    setSaleputted(false);
  }
  const [salePutted, setSaleputted] = useState(false);
  const [salePuttedItemId, setSalePuttedItemId] = useState(null);
  function putSalePercentItemId(itemID) {
    setSalePercent({ ...salePercent, itemID: itemID });
    setSaleputted(true);
    setSalePuttedItemId(itemID);
  }
  async function submitSalePercent(e) {
    e.preventDefault();
    setLoadForPercent(true);
    if (
      !salePercent.itemID ||
      salePercent.discount === null ||
      salePercent.discount === undefined ||
      salePercent.itemID === undefined
    ) {
      alert("Please Put Percent Before You Clicked.");
      setLoadForPercent(false);
    } else {
      try {
        let { data } = await axios.patch(
          "https://freelance1-production.up.railway.app/admin1/sale",
          salePercent
        );
        // console.log(data);
        getItems(e, idForOneItem);
        setSaleputted(false);
        setSalePercent({ itemID: "", discount: 0 });
        showAlertMessage();
        setLoadForPercent(false);
        setSureBoxForCAncelPer(false);
      } catch (error) {}
    }
  }
  const [sureBoxForCancelper, setSureBoxForCAncelPer] = useState(false);
  function cancelSale(idOFOneItem) {
    setSalePercent({
      itemID: idOFOneItem,
      discount: 0,
    });
    setSureBoxForCAncelPer(true);
  }
  function submitCancelPercent(e) {
    submitSalePercent(e);
  }
  function closeSureBoxForCancelPer() {
    setSureBoxForCAncelPer(false);
  }
  // ************************************
  return (
    <>
      <div>
        <div className={showAlert}>
          <div className="custom-alert text-center">Done</div>
        </div>
        <div className=" position-fixed end-2 rounded-circle bg-danger top-5">
          <button className=" p-3 text-white" onClick={GoTOLOgin}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
        <div className="container colorForBg py-5">
          {/* add Admin2 */}
          <h3 className="responsive-font-size-h3 colorForTitles text-center">
            Add Admin
          </h3>
          <div className="d-flex justify-content-center align-items-center my-5">
            <form onSubmit={HandleSubmitForAdmin} className="w-50">
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={AdminInfo.username}
                  onChange={GetAdminInfo}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={AdminInfo.password}
                  onChange={GetAdminInfo}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={AdminInfo.confirmPassword}
                  onChange={GetAdminInfo}
                />
              </div>
              {ErrorMessage == "" ? (
                ""
              ) : (
                <div className="my-3 text-danger">{ErrorMessage}</div>
              )}
              {errorList.length > 0
                ? errorList.map((element) => (
                    <div className="my-2 text-danger textSTyleForError">
                      {element.message}
                    </div>
                  ))
                : ""}

              {Loading ? (
                <button className=" btn btn-primary px-4">
                  <i className="fa solid fa-spinner fa-spin "></i>
                </button>
              ) : (
                <button
                  onClick={HandleSubmitForAdmin}
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              )}
            </form>
          </div>
          {/* -------------------------- */}
          {/* add category  */}
          <h3 className="responsive-font-size-h3 colorForTitles text-center">
            Add Category
          </h3>
          <div className="d-flex justify-content-center align-items-center my-5">
            <form onSubmit={sendCategoryName} className="w-50">
              <div className="mb-3">
                <label className="form-label">name of category</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={categoryName.name}
                  onChange={getCategoryName}
                />
              </div>
              {ErrorMessageForCategory == "" ? (
                ""
              ) : (
                <div className="my-3 text-danger text-center">
                  {ErrorMessageForCategory}
                </div>
              )}
              {LoadingAddCategory ? (
                <button className=" btn btn-primary px-4">
                  <i className="fa solid fa-spinner fa-spin "></i>
                </button>
              ) : (
                <button
                  onClick={sendCategoryName}
                  type="submit"
                  className="btn btn-primary"
                >
                  add category
                </button>
              )}
            </form>
          </div>
          {/* ---------------------------------------------- */}
          {/* show category and delete from it  */}
          <div className="d-flex justify-content-start">
            {classOFShowCategroy === "d-none" ? (
              <button
                onClick={() => {
                  openCayegory();
                }}
                className="btn btn-secondary"
              >
                show categories
              </button>
            ) : (
              <button
                onClick={closeCategory}
                className="btn btn-close text-danger"
              ></button>
            )}
          </div>
          <div className={classOFShowCategroy}>
            {showCategory == null || showCategory.length == 0 ? (
              <p className="text-center text-danger">
                "There are no categories, please add categories"
              </p>
            ) : (
              showCategory.map((element, i) => (
                <div
                  key={i}
                  className="col-md-2 col-sm-1 my-2 d-flex justify-content-center"
                >
                  <p className=" bg-info p-2 text-white py-1 rounded-1 position-relative">
                    {element?.name}
                    <i
                      onClick={() => {
                        DeleteCategory(element?._id);
                      }}
                      className="position-absolute top-0 start-100 translate-middle fa-solid fa-xmark styleOFX text-black"
                    ></i>
                  </p>
                </div>
              ))
            )}
          </div>
          {/* box to show sure message  */}
          <div className={classOFShowSureBox}>
            <button
              onClick={closeSureSection}
              className="position-absolute end-2 top-2 btn btn-close"
            ></button>
            <p className="py-4"> {sureMessage}</p>
            <div className="d-flex justify-content-center">
              <button onClick={sureDeleteCategory} className="btn btn-primary ">
                delete
              </button>
            </div>
          </div>
          {/* ------------------------------------ */}
          {/* add items in category */}
          <h3 className="responsive-font-size-h3 mt-3 colorForTitles text-center">
            Add Items In Category
          </h3>
          <div className="container flex-wrap d-flex justify-content-center gap-3 py-5">
            {showCategory === null || showCategory.length === 0 ? (
              <p className="text-center text-danger">
                "There are no categories"
              </p>
            ) : (
              showCategory.map((element, i) => (
                <button
                  onClick={() => {
                    putIdOfCategoryForItem(element._id, element.name);
                  }}
                  key={i}
                  className="btn btn-secondary text-white"
                >
                  {element?.name}
                </button>
              ))
            )}
          </div>
          {/* show form to add items */}
          {showDivOfItems ? (
            <div className="container position-relative d-flex align-items-center flex-column">
              <div className="position-absolute end-0 top-0 ">
                <button
                  onClick={closeShowItems}
                  className="btn btn-close"
                ></button>
              </div>
              <h3 className="text-center my-3 responsive-font-size-h3">
                {showNameOfCategory}
              </h3>
              <form className="w-50">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    item name
                  </label>
                  <input
                    onChange={putItemInfo}
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    name="name"
                    value={itemsDetails.name}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    description
                  </label>
                  <input
                    onChange={putItemInfo}
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    name="description"
                    value={itemsDetails.description}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="price">
                    price{" "}
                  </label>
                  <input
                    onChange={putItemInfo}
                    type="number"
                    className="form-control"
                    id="exampleCheck1"
                    name="price"
                    value={itemsDetails.price}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="images">
                    image{" "}
                  </label>
                  <input
                    onChange={handleImageOnChange}
                    ref={imageInputRef}
                    multiple
                    type="file"
                    className="form-control"
                    id="exampleCheck1"
                    name="images"
                    accept="image/*"
                  />
                </div>
                <div className="image-preview-container d-flex gap-3">
                  {imagePreviews.length > 0 &&
                    imagePreviews.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image} alt={`Preview ${index}`} width="100" />
                      </div>
                    ))}
                </div>
                {errorMessageForItem == "" ? "" : errorMessageForItem}
                {isLoading ? (
                  <button disabled className=" btn btn-primary px-4">
                    <i className="fa solid fa-spinner fa-spin "></i>
                  </button>
                ) : (
                  <button
                    onClick={sendItemDetail}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                )}
              </form>
            </div>
          ) : (
            ""
          )}

          {/* done add items in category ***************** */}

          {/* add status for each item IN stock or out  */}
          <h3 className="responsive-font-size-h3 mt-3 colorForTitles text-center">
            Choose Category To Show Items
          </h3>
          <div className="container flex-wrap d-flex justify-content-center gap-3 py-5">
            {showCategory === null || showCategory.length === 0 ? (
              <p className="text-center text-danger">
                "There are no categories"
              </p>
            ) : (
              showCategory.map((element, i) => (
                <button
                  onClick={(e) => {
                    getItems(e, element._id);
                  }}
                  key={i}
                  className="btn btn-secondary text-white"
                >
                  {element?.name}
                </button>
              ))
            )}
          </div>
          {/* show items */}
          <div>
            {loadingForItems ? (
              <div className="w-100 d-flex justify-content-center">
                <i className="fa solid fa-spinner fa-spin responsive-font-size-h1"></i>
              </div>
            ) : (
              ""
            )}
            <div className={classForItems}>
              <div className="position-absolute end-0 top-0">
                <button
                  onClick={CloseItemsInCategory}
                  className="btn btn-close"
                ></button>
              </div>
              {currentItem == null || currentItem.length == 0 ? (
                <p className="text-center text-danger mt-5">
                  {errorMessageForItemsInCategory}
                </p>
              ) : (
                <div className="d-flex justify-content-center position-relative gap-3 flex-wrap">
                  {currentItem.map((element, i) => (
                    <div
                      key={i}
                      className="card widthOfCard my-5 position-relative"
                    >
                      <div className="position-absolute top-0 start-100 translate-middle">
                        <button
                          onClick={() => {
                            putItemId(element._id);
                          }}
                          className="btn btn-close"
                        ></button>
                      </div>
                      <img
                        src={`https://freelance1-production.up.railway.app/${element?.images[0]}`}
                        className="card-img-top"
                        alt=""
                      />
                      <div className="card-body">
                        <p className="text-muted mb-2">
                          {element?.lastPrice} EGP
                        </p>
                        <h5 className="card-title">{element?.name}</h5>
                        <p className="card-text mb-2">{element?.description}</p>
                        <div className="d-flex justify-content-center">
                          {statusLoading ? (
                            <i className="fa solid fa-spinner fa-spin responsive-font-size-h1"></i>
                          ) : (
                            <button
                              onClick={(e) => {
                                putStatusOfItem(e, element._id);
                              }}
                              className={`btn  ${
                                element?.status == "in stock"
                                  ? "btn-success"
                                  : "btn-danger"
                              }`}
                            >
                              {element?.status == "in stock"
                                ? "In Stock"
                                : "Out of Stock"}
                            </button>
                          )}
                        </div>
                        <div className="mt-3">
                          <div className="d-flex justify-content-center gap-2">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="discount percent"
                              onChange={putSalePercent}
                            />
                            <button
                              onClick={() => {
                                putSalePercentItemId(element._id);
                              }}
                              className="btn btn-secondary"
                            >
                              {" "}
                              OK
                            </button>
                          </div>
                          {salePutted && salePuttedItemId === element._id
                            ? "done"
                            : ""}
                          {element?.discount <= 0 ||
                          element?.discount == null ? (
                            ""
                          ) : (
                            <div className="d-flex justify-content-center gap-2 mt-2">
                              <p>cancel sale</p>
                              <button
                                onClick={() => {
                                  cancelSale(element._id);
                                }}
                                className="btn btn-primary p-1"
                              >
                                cancel
                              </button>
                            </div>
                          )}
                          {sureBoxForCancelper ? (
                            <div className="position-fixed top-50 start-50 translate-middle z-3 bg-white shadow rounded-3  text-black p-5">
                              <button
                                onClick={closeSureBoxForCancelPer}
                                className="position-absolute end-2 top-2 btn btn-close"
                              ></button>
                              <p>are you sure you want to cancel the sale </p>
                              <div className="d-flex justify-content-center mt-4">
                                <button
                                  onClick={(e) => {
                                    submitCancelPercent(e);
                                  }}
                                  className="btn btn-primary"
                                >
                                  submit
                                </button>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}

                          <div className="d-flex justify-content-center">
                            {loadForPercent ? (
                              <button className="btn btn-primary">
                                <i className="fa solid fa-spinner fa-spin "></i>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  submitSalePercent(e);
                                }}
                                className="btn btn-primary mt-2"
                              >
                                submit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* osition-absolute bottom-0 start-50 translate-middle-x d-flex justify-content-center */}
                </div>
              )}

              <div className={sureDeleteItem}>
                <button
                  onClick={closeSureBox}
                  className="position-absolute end-2 top-2 btn btn-close"
                ></button>
                <p className="py-4">
                  {" "}
                  Are you sure you want to delete this item? This action is
                  irreversible and will permanently remove the item from the
                  system.{" "}
                </p>
                <div className="d-flex justify-content-center">
                  <button onClick={deleteItem} className="btn btn-primary ">
                    delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={classOfArrow}>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>
            <span className="mx-2 mt-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
          {/* end of status  ****************************----*/}
        </div>
      </div>
    </>
  );
}
