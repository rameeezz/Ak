import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/card photo/1.jpeg";
export default function Admin2({ logOut }) {
  let navigate = useNavigate();
  function GoTOLOgin() {
    navigate("/login");
    logOut();
  }
  const [showAlert, setShowAlert] = useState("d-none");
  const showAlertMessage = () => {
    setShowAlert(" position-fixed start-3 top-5 alert alert-success w-25");
    setTimeout(() => {
      setShowAlert("d-none");
    }, 1000);
  };
  const [showCategory, setShowCategory] = useState([]);
  async function getCategory() {
    try {
      let { data } = await axios.get(
        "https://akflorist-production.up.railway.app/admin1/getCategories"
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
  // done show category *************
  // add items in category ***************\\\\\\
  const [AllCategoryId, setAllCategoryId] = useState([]);
  const [AllCategoryName, setAllCategoryName] = useState([]);
  const [itemsDetails, setItemsDetails] = useState({
    name: "",
    description: "",
    price: 0,
    category: [],
    images: [],
  });
  useEffect(() => {
    setItemsDetails((prevDetails) => ({
      ...prevDetails,
      category: AllCategoryId,
    }));
  }, [AllCategoryId]);
  const [getSubCategory, setGetSubCategory] = useState([]);
  // console.log(getSubCategory);
  const [loadingForSub, setLoadingForSub] = useState(null);
  // console.log(itemsDetails);
  const [imagePreviews, setImagePreviews] = useState([]);

  async function putIdOfCategoryForItem(e, IdOfCategory, categoryName) {
    e.preventDefault();
    setLoadingForSub(IdOfCategory);
    try {
      let { data } = await axios.get(
        `https://akflorist-production.up.railway.app/admin1/getCategoryContent/${IdOfCategory}`
      );
      setLoadingForSub(null);
      if (data.subcategories == undefined) {
        setAllCategoryId((prevIds) => {
          if (!prevIds.includes(IdOfCategory)) {
            setAllCategoryName((prevNames) => {
              if (!prevNames.includes(categoryName)) {
                return [...prevNames, categoryName];
              }
              return prevNames;
            });
            return [...prevIds, IdOfCategory];
          }
          return prevIds;
        });
      }
      setGetSubCategory(data.subcategories);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoadingForSub(null);
        setAllCategoryId((prevIds) => {
          if (!prevIds.includes(IdOfCategory)) {
            setAllCategoryName((prevNames) => {
              if (!prevNames.includes(categoryName)) {
                return [...prevNames, categoryName];
              }
              return prevNames;
            });
            return [...prevIds, IdOfCategory];
          }
          return prevIds;
        });
      }
    }
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
    setItemsDetails({ ...itemsDetails, images: [] });
    setImagePreviews([]);
  };
  function removeCategoryId(categoryID, categoryName) {
    setAllCategoryId((prevIds) => prevIds.filter((id) => id !== categoryID));
    setAllCategoryName((prevNames) =>
      prevNames.filter((name) => name !== categoryName)
    );
  }

  const [isLoading, setIsLoading] = useState(false);
  async function sendItemDetail(e) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", itemsDetails.name);
    formData.append("description", itemsDetails.description);
    formData.append("price", itemsDetails.price);
    // formData.append("category", itemsDetails.category);

    // Append each image in the array
    itemsDetails.images.forEach((image, index) => {
      formData.append("images", image); // Sending images without an index
    });
    itemsDetails.category.forEach((categoryID) => {
      formData.append("category", categoryID);
    });
    if (itemsDetails.images.length >= 10) {
      alert("max number of images 10");
      setIsLoading(false);
    } else {
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/admin1/additems",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log(data);
        // Reset the form or perform other actions
        // console.log(data);

        setItemsDetails({
          name: "",
          description: "",
          price: 0,
          category: [],
          images: [],
        });
        setImagePreviews([]);
        setIsLoading(false);
        setErrorMessageForItem("");
        setAllCategoryName([]);
        setAllCategoryId([]);
        showAlertMessage();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          setErrorMessageForItem("you should choose category.");
          setIsLoading(false);
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
  // console.log(itemsInCategory);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(itemsInCategory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = itemsInCategory.slice(indexOfFirstItem, indexOfLastItem);
  // console.log(currentItem);

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
  const [getSubCategorys, setGetSubCategorys] = useState([]);
  // for delete item in one category
  const [categroryId, setCategoryID] = useState({
    categoryId: "",
    itemID: "",
  });
  // console.log(categroryId);

  // ****************
  async function getSubCategories(e, idOfParentCateg) {
    e.preventDefault();
    try {
      let { data } = await axios.get(
        `https://akflorist-production.up.railway.app/admin1/getCategoryContent/${idOfParentCateg}`
      );
      // console.log(data.subcategories);
      setGetSubCategorys(data.subcategories);
      setItemInCategory([]);
      setLoadingForItems(false);
      setErrorMessageForItemsInCategory("");
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
        setGetSubCategorys([]);
      }
    }
  }
  async function getItems(e, itemID) {
    e.preventDefault();

    setLoadingForItems(true);
    setIdForOneItem(itemID);
    try {
      let { data } = await axios.get(
        `https://akflorist-production.up.railway.app/admin1/getItems/${itemID}`
      );
      // console.log(data);
      setLoadingForItems(false);
      setCurrentPage(1);
      setItemInCategory(data);
      setCategoryID({ ...categroryId, categoryId: itemID });
      setGetSubCategorys([]);
      setClassForItems(
        "d-flex justify-content-center gap-3 flex-wrap position-relative"
      );
      setClassOFArrow(
        "pagination-controls my-4 d-flex justify-content-center "
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        getSubCategories(e, itemID);
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
    setGetSubCategorys([]);
  }

  // delete items and status *******------------
  const [itemIDForDelete, setItemIdForDelete] = useState({ itemID: "" });
  const [sureDeleteItem, setSureDeleteItem] = useState("d-none");
  const [statusLoading, setStatusLoading] = useState(false);

  // console.log(bestSeller);

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
        `https://akflorist-production.up.railway.app/admin1/deleteItem/${itemIDForDelete}`
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
        `https://akflorist-production.up.railway.app/admin1/changeStatus/${idOfItem}`
      );
      setStatusLoading(false);
      // console.log(data);
      getItems(e, idForOneItem);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // console.log("leeeh");
        setStatusLoading(false);
      }
    }
  }
  // best seller work
  function handleSellerButtonClick(e, idOfItem) {
    // Call submitSellerOfItem with the correct itemID
    submitSellerOfItem(e, idOfItem);
    // console.log(idOfItem);
  }
  async function submitSellerOfItem(e, itemID) {
    e.preventDefault();
    setSellerLoading(true);
    //  console.log(itemID);
    if (itemID === "") {
      alert("try again later");
    } else {
      try {
        let { data } = await axios.patch(
          "https://akflorist-production.up.railway.app/admin1/bestSeller",
          { itemID: `${itemID}` }
        );
        setSellerLoading(false);
        getItems(e, idForOneItem);
      } catch (error) {
        setSellerLoading(false);
        console.error("Error updating best seller:", error);
      }
    }
  }
  const [sellerLoading, setSellerLoading] = useState(false);
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
          "https://akflorist-production.up.railway.app/admin1/sale",
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
  // delete Item From one Category
  const [sureDeleteItemFromOneCategory, setSureDeleteItemFromOneCategory] =
    useState("d-none");
  function closeSureBoxOFitem() {
    setSureDeleteItemFromOneCategory("d-none");
  }
  function putIdOFItemDeletIt(itemID) {
    setCategoryID({ ...categroryId, itemID: itemID });
    setSureDeleteItemFromOneCategory(
      "position-fixed top-50 start-50 translate-middle z-3 bg-white shadow rounded-3  text-black p-5"
    );
  }
  async function deleteItemFromOneCategory(e) {
    // console.log(itemID);
    e.preventDefault();
    if (categroryId.itemID == "" || categroryId.categoryId == "") {
      alert("click on delete again please");
    } else {
      try {
        let { data } = await axios.patch(
          "https://akflorist-production.up.railway.app/admin1/removeOneCategory",
          categroryId
        );
        showAlertMessage();
        setSureDeleteItemFromOneCategory("d-none");
        getItems(e, categroryId.categoryId);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("delete it from X button");
        }
      }
    }
  }
  // **********************************

  // show occasion
  const [showCategoryForOccasion, setShowCategoryForOccasion] = useState([]);
  async function getCategoryForOccasions() {
    try {
      let { data } = await axios.get(
        "https://akflorist-production.up.railway.app/admin1/getOccasions"
      );
      // console.log(data);
      setShowCategoryForOccasion(data);
    } catch (error) {
      if (error.response && error.response.status === 502) {
        alert("server is down try again later");
      }
      if (error.response && error.response.status === 404) {
        setShowCategoryForOccasion([]);
      }
    }
  }

  useEffect(() => {
    getCategoryForOccasions();
  }, []);
  // **************************

  // add items in Occasions
  const [AllCategoryNameForOccasion, setAllCategoryNameForOccasion] = useState(
    []
  );
  const [AllCategoryIdForOccasion, setAllCategoryIdForOccasion] = useState([]);
  const [isLoadingForOccasion, setIsLoadingForOccasion] = useState(false);
  const imageInputRefForOccasion = useRef(null);
  const [imagePreviewsForOccasion, setImagePreviewsForOccasion] = useState([]);
  const [errorMessageForItemForOccasion, setErrorMessageForItemForOccasion] =
    useState("");
  const [itemsDetailsForOccasion, setItemsDetailsForOccasion] = useState({
    name: "",
    description: "",
    price: 0,
    occasions: [],
    images: [],
  });
  function handleCategorySelection(categoryID, categoryName) {
    setItemsDetailsForOccasion((prevDetails) => {
      // Only update if the categoryID is not already in the occasions array
      if (!prevDetails.occasions.includes(categoryID)) {
        return {
          ...prevDetails,
          occasions: [...prevDetails.occasions, categoryID],
        };
      }
      return prevDetails;
    });

    setAllCategoryIdForOccasion((prevIds) => {
      if (!prevIds.includes(categoryID)) {
        return [...prevIds, categoryID];
      }
      return prevIds;
    });

    setAllCategoryNameForOccasion((prevNames) => {
      if (!prevNames.includes(categoryName)) {
        return [...prevNames, categoryName];
      }
      return prevNames;
    });
  }

  function removeCategoryIdForOccasion(categoryID, categoryName) {
    setItemsDetailsForOccasion((prevDetails) => {
      // Only update if the categoryID is in the occasions array
      if (prevDetails.occasions.includes(categoryID)) {
        return {
          ...prevDetails,
          occasions: prevDetails.occasions.filter((id) => id !== categoryID),
        };
      }
      return prevDetails;
    });

    setAllCategoryIdForOccasion((prevIds) =>
      prevIds.includes(categoryID)
        ? prevIds.filter((id) => id !== categoryID)
        : prevIds
    );

    setAllCategoryNameForOccasion((prevNames) =>
      prevNames.includes(categoryName)
        ? prevNames.filter((name) => name !== categoryName)
        : prevNames
    );
  }

  function putItemInfoForOccasion(e) {
    let myItem = { ...itemsDetailsForOccasion };
    myItem[e.target.name] = e.target.value;
    setItemsDetailsForOccasion(myItem);
    if (myItem[e.target.name] == "name") {
      setErrorMessageForItemForOccasion("");
    }
  }
  function handleImageOnChangeForOccasion(event) {
    const files = Array.from(event.target.files); // Convert FileList to Array
    // Create image preview URLs
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setItemsDetailsForOccasion((prev) => ({
      ...prev,
      images: [...prev.images, ...files], // Append new files to the existing array
    }));
    setImagePreviewsForOccasion((prev) => [...prev, ...imageUrls]);
  }

  const closeShowItemsForOccasion = () => {
    setItemsDetailsForOccasion({ ...itemsDetails, images: [] });
    setImagePreviewsForOccasion([]);
  };
  async function sendItemDetailForOccasion(e) {
    e.preventDefault();
    setIsLoadingForOccasion(true);
    const formData = new FormData();

    formData.append("name", itemsDetailsForOccasion.name);
    formData.append("description", itemsDetailsForOccasion.description);
    formData.append("price", itemsDetailsForOccasion.price);

    // Append each image in the array
    itemsDetailsForOccasion.images.forEach((image, index) => {
      formData.append("images", image);
    });

    // Safely iterate over the occasions array
    if (Array.isArray(itemsDetailsForOccasion.occasions)) {
      itemsDetailsForOccasion.occasions.forEach((categoryID) => {
        formData.append("occasions", categoryID);
      });
    }

    if (itemsDetailsForOccasion.images.length >= 10) {
      alert("max number of images 10");
      setIsLoadingForOccasion(false);
    } else {
      try {
        let { data } = await axios.post(
          "https://akflorist-production.up.railway.app/admin1/additemsOfOccasions",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Reset the form or perform other actions
        setItemsDetailsForOccasion({
          name: "",
          description: "",
          price: 0,
          occasions: [], // Reset to an empty array
          images: [],
        });
        setImagePreviewsForOccasion([]);
        setIsLoadingForOccasion(false);
        setErrorMessageForItemForOccasion("");
        setAllCategoryNameForOccasion([]);
        setAllCategoryIdForOccasion([]);
        showAlertMessage();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          setErrorMessageForItemForOccasion("you should choose occasion.");
        } else if (error.response && error.response.status === 404) {
          alert("name is already exist.");
        } else if (error.response && error.response.status === 500) {
          alert("max number of images 10");
        } else if (error.response && error.response.status === 400) {
          alert("please add name and description");
        }
        setIsLoadingForOccasion(false);
      }
    }
  }

  // ----------------------
  // show items in occasion and delete and status and discount
  const [loadingForItemsForOccasion, setLoadingForItemsForOccasion] =
    useState(false);
  const [classForItemsForOccasion, setClassForItemsForOccasion] =
    useState("d-none");
  const [statusLoadingForOccasion, setStatusLoadingForOccasion] =
    useState(false);
  const [itemsInCategoryForOccasion, setItemInCategoryForOccasion] = useState(
    []
  );
  const [itemIDForDeleteForOccasion, setItemIdForDeleteForOccasion] = useState({
    itemID: "",
  });
  // console.log(itemIDForDeleteForOccasion);

  const [sureDeleteItemForOccasion, setSureDeleteItemForOccasion] =
    useState("d-none");
  const [sellerLoadingForOccasion, setSellerLoadingForOccasion] =
    useState(false);
  const [categroryIdForOccasion, setCategoryIDForOccasion] = useState({
    categoryId: "",
    itemID: "",
  });
  const [salePercentForOccasion, setSalePercentForOccasion] = useState({
    itemID: "",
    discount: 0,
  });
  const [salePuttedForOccasion, setSaleputtedForOccasion] = useState(false);
  const [salePuttedItemIdForOccasion, setSalePuttedItemIdForOccasion] =
    useState(null);
  const [sureBoxForCancelperForOcccasion, setSureBoxForCAncelPerForOccasion] =
    useState(false);
  const [loadForPercentForOccasion, setLoadForPercentForOccasion] =
    useState(false);
  const [sureDeleteItemFromOneOccasion, setSureDeleteItemFromOccasion] =
    useState("d-none");
  // pagination
  const [currentPageForOccasion, setCurrentPageForOccasion] = useState(1);
  const itemsPerPageForOccasion = 6;
  const totalPagesForOccasion = Math.ceil(
    itemsInCategoryForOccasion.length / itemsPerPageForOccasion
  );
  const indexOfLastItemForOccasion =
    currentPageForOccasion * itemsPerPageForOccasion;
  const indexOfFirstItemForOcassion =
    indexOfLastItemForOccasion - itemsPerPageForOccasion;
  const currentItemForOccasion = itemsInCategoryForOccasion.slice(
    indexOfFirstItemForOcassion,
    indexOfLastItemForOccasion
  );
  // console.log(currentItem);

  const paginateForOccasion = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPagesForOccasion) {
      setCurrentPageForOccasion(pageNumber);
    }
  };
  const [classOfArrowForOccasion, setClassOFArrowForOccasion] =
    useState("d-none");
  // end of pagination
  async function getItemsForOccasions(e, categoryId) {
    e.preventDefault();
    setLoadingForItemsForOccasion(true);
    try {
      let { data } = await axios.get(
        `https://akflorist-production.up.railway.app/admin1/getItemOfOccasion/${categoryId}`
      );
      // console.log(data);
      setLoadingForItemsForOccasion(false);
      setItemInCategoryForOccasion(data);
      setCategoryIDForOccasion({
        ...categroryIdForOccasion,
        categoryId: categoryId,
      });
      setCurrentPageForOccasion(1)
      setClassForItemsForOccasion(
        "d-flex justify-content-center gap-3 flex-wrap position-relative"
      );
      setClassOFArrowForOccasion(
        "pagination-controls my-4 d-flex justify-content-center "
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoadingForItemsForOccasion(false);
        setItemInCategoryForOccasion([]);
        alert("no items in this occasion");
      }
    }
  }

  function putItemIdForOccasion(itemID) {
    setItemIdForDeleteForOccasion(itemID);
    // console.log(itemID);

    setSureDeleteItemForOccasion(
      "position-fixed top-50 start-50 translate-middle z-3 bg-white shadow rounded-3  text-black p-5"
    );
  }
  async function putStatusOfItemForOccasion(e, idOfItem) {
    // console.log(idOfItem);

    e.preventDefault();
    setStatusLoadingForOccasion(true);
    try {
      let { data } = await axios.patch(
        `https://akflorist-production.up.railway.app/admin1/changeItemOfOccasionStatus/${idOfItem}`
      );
      setStatusLoadingForOccasion(false);
      getItemsForOccasions(e, categroryIdForOccasion.categoryId);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setStatusLoadingForOccasion(false);
      }
    }
  }

  function handleSellerButtonClickForOccasion(e, idOfItem) {
    // Call submitSellerOfItem with the correct itemID
    submitSellerOfItemForOccasion(e, idOfItem);
    // console.log(idOfItem);
  }
  function putSalePercentForOccasion(e) {
    setSalePercentForOccasion({
      ...salePercentForOccasion,
      discount: e.target.value,
    });
    setSaleputtedForOccasion(false);
  }
  function CloseItemsInCategoryForOccasion() {
    setClassForItemsForOccasion("d-none");
    setSaleputtedForOccasion(false);
    setSalePercentForOccasion({
      itemID: "",
      discount: 0,
    });

    setClassOFArrowForOccasion("d-none ");
  }
  function putSalePercentItemIdForOccasion(itemID) {
    setSalePercentForOccasion({ ...salePercentForOccasion, itemID: itemID });
    setSaleputtedForOccasion(true);
    setSalePuttedItemIdForOccasion(itemID);
  }
  function cancelSaleForOccasion(idOFOneItem) {
    setSalePercentForOccasion({
      itemID: idOFOneItem,
      discount: 0,
    });
    setSureBoxForCAncelPerForOccasion(true);
  }
  function closeSureBoxForCancelPerForOccasion() {
    setSureBoxForCAncelPerForOccasion(false);
  }
  function submitCancelPercentForOccasion(e) {
    submitSalePercentForOccasion(e);
  }
  async function submitSalePercentForOccasion(e) {
    e.preventDefault();
    setLoadForPercentForOccasion(true);
    if (
      !salePercentForOccasion.itemID ||
      salePercentForOccasion.discount === null ||
      salePercentForOccasion.discount === undefined ||
      salePercentForOccasion.itemID === undefined
    ) {
      alert("Please Put Percent Before You Clicked.");
      setLoadForPercentForOccasion(false);
    } else {
      try {
        let { data } = await axios.patch(
          "https://akflorist-production.up.railway.app/admin1/occasionSale",
          salePercentForOccasion
        );
        // console.log(data);
        getItemsForOccasions(e, categroryIdForOccasion.categoryId);
        setSaleputtedForOccasion(false);
        setSalePercentForOccasion({ itemID: "", discount: 0 });
        showAlertMessage();
        setLoadForPercentForOccasion(false);
        setSureBoxForCAncelPerForOccasion(false);
      } catch (error) {}
    }
  }
  function putIdOFItemDeletItForOccasion(itemID) {
    setCategoryIDForOccasion({ ...categroryIdForOccasion, itemID: itemID });
    setSureDeleteItemFromOccasion(
      "position-fixed top-50 start-50 translate-middle z-3 bg-white shadow rounded-3  text-black p-5"
    );
  }
  function closeSureBoxForOccasion() {
    setSureDeleteItemForOccasion("d-none");
  }
  async function deleteItemForOccasion(e) {
    e.preventDefault();
    try {
      let { data } = await axios.delete(
        `https://akflorist-production.up.railway.app/admin1/deleteItemOfOccasion/${itemIDForDeleteForOccasion}`
      );
      // console.log(data);
      setSureDeleteItemForOccasion("d-none");
      getItemsForOccasions(e, categroryIdForOccasion.categoryId);
      showAlertMessage();
    } catch (error) {}
  }
  async function deleteItemFromOneOccasion(e) {
    // console.log(itemID);
    e.preventDefault();
    if (
      categroryIdForOccasion.itemID == "" ||
      categroryIdForOccasion.categoryId == ""
    ) {
      alert("click on delete again please");
    } else {
      try {
        let { data } = await axios.patch(
          "https://akflorist-production.up.railway.app/admin1/removeOneOccasion",
          categroryIdForOccasion
        );
        showAlertMessage();
        setSureDeleteItemFromOccasion("d-none");
        getItemsForOccasions(e, categroryIdForOccasion.categoryId);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("delete it from X button");
        }
      }
    }
  }
  function closeSureBoxOFitemForOccasion() {
    setSureDeleteItemFromOccasion("d-none");
  }
  async function submitSellerOfItemForOccasion(e, itemID) {
    e.preventDefault();
    setSellerLoadingForOccasion(true);
    //  console.log(itemID);
    if (itemID === "") {
      alert("try again later");
    } else {
      try {
        let { data } = await axios.patch(
          "https://akflorist-production.up.railway.app/admin1/bestSellerOccasion",
          { itemID: `${itemID}` }
        );
        setSellerLoadingForOccasion(false);
        getItemsForOccasions(e, categroryIdForOccasion.categoryId);
        showAlertMessage();
      } catch (error) {
        setSellerLoadingForOccasion(false);
        console.error("Error updating best seller:", error);
      }
    }
  }
  // -------------------------------------------------------
  const [allOrders, setAllOrders] = useState([]);
  const [classOfCard, setClassOfCard] = useState("d-none");
  const [selectedCardInfo, setSelectedCardInfo] = useState({});
  // console.log(selectedCardInfo.from);

  const [loadingOrderButton, setLoadingOrderButton] = useState(false);
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const itemsPerPageOrders = 3;
  const totalPagesOrders = Math.ceil(allOrders.length / itemsPerPageOrders);
  const indexOfLastItemOrders = currentPageOrders * itemsPerPageOrders;
  const indexOfFirstItemOrders = indexOfLastItemOrders - itemsPerPageOrders;
  const currentItemOrders = allOrders.slice(
    indexOfFirstItemOrders,
    indexOfLastItemOrders
  );
  // console.log(currentItemOrders);

  const paginateOrders = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPagesOrders) {
      setCurrentPageOrders(pageNumber);
    }
  };
  async function getAllOrders() {
    try {
      let { data } = await axios.get(
        "https://akflorist-production.up.railway.app/admin2/getAllOrders"
      );
      // console.log(data.orders);
      setAllOrders(data.orders);
      // const items = data.orders.flatMap((order) => order.items || []);
      // setOrderItems(items);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAllOrders([]);
      }
    }
  }
  useEffect(() => {
    getAllOrders();
  }, []);
  async function removeItemsFinished(e, orderIDs) {
    e.preventDefault();
    setLoadingOrderButton(true);
    const orderID = {
      orderID: orderIDs,
    };
    try {
      let { data } = await axios.patch(
        "https://akflorist-production.up.railway.app/admin2/changeOrderStatus",
        orderID
      );
      // console.log(data);
      getAllOrders();
      setLoadingOrderButton(false);
    } catch (error) {}
  }
  function showCardinfo(cardInfo) {
    setClassOfCard(
      "position-fixed top-50 start-50 widthOfCardDetails translate-middle shadow bg-white p-5 rounded d-flex justify-content-center gap-3 flex-column z-[31353]"
    );
    setSelectedCardInfo(cardInfo);
  }
  function closeCard() {
    setClassOfCard("d-none");
  }

  const [editeStatus, setEditStatus] = useState(false);
  const [loadingForEdit, setLoadingForedit] = useState(false);
  const [newPriceInfo, setNewPriceInfo] = useState({
    itemID: "",
    newPrice: 0,
  });

  function turnEditTrue(ItemID) {
    setNewPriceInfo({ ...newPriceInfo, itemID: ItemID });
    setEditStatus(true);
  }
  function takeNewPrice(e) {
    let { name, value } = e.target;
    setNewPriceInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  async function sendNewValue(e) {
    e.preventDefault();
    setLoadingForedit(true);
    try {
      let { data } = await axios.patch(
        "https://akflorist-production.up.railway.app/admin2/editPrice",
        newPriceInfo
      );
      setEditStatus(false);
      setLoadingForedit(false);
      getItems(e, idForOneItem);
    } catch (error) {}
  }
  async function sendNewValueOccasion(e) {
    e.preventDefault();
    setLoadingForedit(true);
    try {
      let { data } = await axios.patch(
        "https://akflorist-production.up.railway.app/admin2/editPrice",
        newPriceInfo
      );
      setEditStatus(false);
      setLoadingForedit(false);
      getItemsForOccasions(e, categroryIdForOccasion.categoryId);
    } catch (error) {}
  }
  return (
    <>
      <div className=" position-fixed end-2 rounded-circle bg-danger top-5 z-[123131]">
        <button className=" p-3  text-white" onClick={GoTOLOgin}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      <div className={showAlert}>
        <div className="custom-alert text-center">Done</div>
      </div>
      {/* orders  */}
      <h3 className="text-center py-3  responsive-font-size-h3 text-[#7E96C4]">
        {" "}
        Orders Of The Day{" "}
      </h3>
      <div className="d-flex justify-content-center mt-5 gap-3 flex-wrap">
        {currentItemOrders == null || currentItemOrders.length === 0
          ? "No orders Found "
          : currentItemOrders.map((element, i) => (
              <div
                key={i}
                className="p-2 rounded border border-2 border-danger gap-2 d-flex flex-column justify-content-end align-items-center position-relative"
              >
                {loadingOrderButton ? (
                  <div className="w-100 justify-content-end d-flex">
                    <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      removeItemsFinished(e, element?._id);
                    }}
                    className="position-absolute btn btn-primary end-0 top-0  p-1"
                  >
                    {" "}
                    Done
                  </button>
                )}

                <p className="w-100 text-start">
                  <span className="fw-bold">Name :</span>{" "}
                  <span className="text-muted">
                    {element?.customer[0]?.customerID?.firstName}{" "}
                    {element?.customer[0]?.customerID?.lastName}
                  </span>{" "}
                </p>
                <p className="w-100 text-start">
                  <span className="fw-bold">Mobile Number :</span>{" "}
                  <span className="text-muted">
                    {element?.customer[0]?.customerID?.mobileNumber}
                  </span>{" "}
                </p>
                <p className="w-100 text-start">
                  <span className="fw-bold">Address : </span>
                  <span>
                    {element?.address?.state} {element?.address?.area}
                  </span>{" "}
                </p>
                <p className="w-100 text-start">
                  <span className="fw-bold">Street : </span>
                  <span>{element?.address?.street} </span>{" "}
                </p>
                <div className="d-flex justify-content-center gap-3 ">
                  <div className="d-flex justify-content-center flex-column ">
                    <p className="text-center">Apartment</p>
                    <span className="text-center">
                      {" "}
                      {element?.address?.apartment}{" "}
                    </span>
                  </div>
                  <div className="d-flex justify-content-center flex-column ">
                    <p className="text-center">Building</p>
                    <span className="text-center">
                      {" "}
                      {element?.address?.building}{" "}
                    </span>
                  </div>
                  <div className="d-flex justify-content-center flex-column ">
                    <p className="text-center">Floor</p>
                    <span className="text-center">
                      {" "}
                      {element?.address?.floor}{" "}
                    </span>
                  </div>
                </div>
                <p className="w-100 text-start">
                  <span className="fw-bold">Date : </span>
                  <span>{element?.date.slice(0, 10)} </span>{" "}
                </p>
                <p className="w-100 text-start">
                  <span className="fw-bold">Time : </span>
                  <span>{element?.time} </span>{" "}
                </p>
                <p className="w-100 text-start">
                  <span className="fw-bold">Total Cost : </span>
                  <span>{element?.totalCost} </span>{" "}
                </p>
                <p className="w-100 text-start d-flex  gap-3">
                  <span className="fw-bold "> Payment: </span>
                  <span className=" w-75 overflow-x-scroll">
                    {element?.intendID}{" "}
                  </span>{" "}
                </p>
                <div className="d-flex justify-content-start align-items-center gap-3 flex-column overflow-y-scroll border h-[150px] w-100">
                  {element.items && element.items.length > 0
                    ? element.items.map((item, i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-between gap-3 border border-2 rounded p-1 w-100 h-[120px]"
                        >
                          <div className="w-[40%]">
                            {item?.itemID?.images &&
                            item?.itemID?.images.length > 0 ? (
                              <img
                                src={`https://akflorist.s3.eu-north-1.amazonaws.com/${item?.itemID?.images[0]}`}
                                alt={item?.itemID?.name}
                                className="w-100 h-100"
                              />
                            ) : (
                              <span>No image available</span>
                            )}
                          </div>
                          <div className="d-flex justify-content-center align-items-center gap-3 flex-column">
                            <p>card</p>
                            {element.card == null ? (
                              ""
                            ) : (
                              <button
                                onClick={() => showCardinfo(element.card)}
                                className="btn btn-primary"
                              >
                                i
                              </button>
                            )}
                          </div>
                          <div className={classOfCard}>
                            <div className="d-flex justify-content-center gap-3">
                              <span className="fw-bold">from :</span>
                              <p> {selectedCardInfo.from} </p>
                            </div>
                            <div className="d-flex justify-content-center gap-3">
                              <span className="fw-bold ">text:</span>
                              <p> {selectedCardInfo.text} </p>
                            </div>
                            <div className="d-flex justify-content-center gap-3">
                              <span className="fw-bold">to :</span>
                              <p> {selectedCardInfo.to} </p>
                            </div>
                            <button
                              className="btn btn-primary"
                              onClick={closeCard}
                            >
                              {" "}
                              close
                            </button>
                          </div>
                          <div className="d-flex flex-column justify-content-center gap-3 align-items-center  ">
                            <p className="text-center">
                              {typeof item?.itemID?.name === "string"
                                ? item?.itemID?.name.slice(0, 20)
                                : "No name available"}
                            </p>
                            <span>{item?.quantity}</span>
                          </div>
                        </div>
                      ))
                    : "No items found"}
                </div>
              </div>
            ))}
      </div>
      <div className="pagination-controls my-4 d-flex justify-content-center ">
        <button
          className="btn btn-secondary mx-2 inSmallScreenButton"
          onClick={() => paginateOrders(currentPageOrders - 1)}
          disabled={currentPageOrders === 1}
        >
          &laquo; Previous
        </button>
        <span className="mx-2 mt-2 ">
          Page {currentPageOrders} of {totalPagesOrders}
        </span>
        <button
          className="btn btn-secondary mx-2 inSmallScreenButton"
          onClick={() => paginateOrders(currentPageOrders + 1)}
          disabled={currentPageOrders === totalPagesOrders}
        >
          Next &raquo;
        </button>
      </div>
      {/* done */}
      {/* add items in category */}
      <h3 className="responsive-font-size-h3 mt-3 colorForTitles text-center">
        Add Items In Category
      </h3>

      {/* add itmes in categories  */}

      <div className="d-flex justify-content-center flex-wrap gap-3 mt-5">
        <div className="d-flex border-3 border-secondary rounded pt-3 flex-column gap-3">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {showCategory === null || showCategory.length === 0 ? (
              <p className="text-center text-danger">
                "There are no categories"
              </p>
            ) : (
              showCategory.map((element, i) => (
                <div key={i}>
                  {loadingForSub === element._id ? (
                    <button disabled className="btn btn-secondary px-4">
                      <i className="fa solid fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        putIdOfCategoryForItem(e, element?._id, element?.name);
                      }}
                      className="btn btn-secondary text-white"
                    >
                      {element?.name}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="d-flex justify-content-center flex-wrap flex-row gap-3">
            {Array.isArray(getSubCategory) && getSubCategory.length > 0
              ? getSubCategory.map((element, i) => (
                  <div key={i}>
                    {loadingForSub === element._id ? (
                      <button disabled className="btn btn-primary px-4">
                        <i className="fa solid fa-spinner fa-spin"></i>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          putIdOfCategoryForItem(e, element._id, element.name);
                        }}
                        className="btn btn-primary text-white"
                      >
                        {element?.name}
                      </button>
                    )}
                  </div>
                ))
              : ""}
          </div>
          <div className="d-flex justify-content-center border-3 border-secondary gap-3 flex-wrap p-2 overflow-auto">
            {AllCategoryName === null || AllCategoryName.length === 0
              ? "Here, you will find the categories you have selected. This section provides a clear and organized view of your chosen categories, ensuring that you can easily track and manage your selections."
              : AllCategoryName.map((element, i) => (
                  <div key={i} className="d-flex justify-content-center gap-1">
                    <button className="btn btn-light text-dark">
                      {element}
                    </button>
                    <button
                      onClick={() => {
                        const categoryID = AllCategoryId[i]; // This assumes names and IDs are in the same order
                        removeCategoryId(categoryID, element);
                      }}
                      className="btn btn-close"
                    ></button>
                  </div>
                ))}
          </div>
        </div>
        {/* form ---------------------- */}
        <div className="container border-3 border-secondary rounded d-flex align-items-center flex-column p-3 position-relative ">
          <div
            onClick={closeShowItems}
            className="position-absolute end-4 top-50"
          >
            <button className="btn btn-close"></button>
          </div>
          <form className="w-50">
            <div className="mb-3">
              <label htmlFor="itemName" className="form-label">
                item name
              </label>
              <input
                onChange={putItemInfo}
                type="text"
                className="form-control"
                id="itemName" // Unique id
                aria-describedby="emailHelp"
                name="name"
                value={itemsDetails.name}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="itemDescription" className="form-label">
                description
              </label>
              <input
                onChange={putItemInfo}
                type="text"
                className="form-control"
                id="itemDescription" // Unique id
                name="description"
                value={itemsDetails.description}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="itemPrice1">
                {" "}
                {/* Changed id */}
                price
              </label>
              <input
                onChange={putItemInfo}
                type="number"
                className="form-control"
                id="itemPrice1" // Unique id
                name="price"
                value={itemsDetails.price}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="itemImages">
                image
              </label>
              <input
                onChange={handleImageOnChange}
                ref={imageInputRef}
                multiple
                type="file"
                className="form-control"
                id="itemImages" // Unique id
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
            {errorMessageForItem === "" ? "" : errorMessageForItem}
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
      </div>
      {/* done add items in category ***************** */}

      {/* add status for each item IN stock or out  */}
      <h3 className="responsive-font-size-h3 mt-3 colorForTitles text-center">
        Choose Category To Show Items
      </h3>
      <div className="container flex-wrap d-flex justify-content-center gap-3 py-5">
        {showCategory === null || showCategory.length === 0 ? (
          <p className="text-center text-danger">"There are no categories"</p>
        ) : (
          showCategory.map((element, i) => (
            <button
              onClick={(e) => {
                getItems(e, element?._id);
              }}
              key={i}
              className="btn btn-secondary text-white"
            >
              {element?.name}
            </button>
          ))
        )}
      </div>
      <div className="d-flex justify-content-center flex-row gap-2 mb-5">
        {getSubCategorys === null || getSubCategorys.length === 0
          ? ""
          : getSubCategorys.map((element, i) => (
              <div key={i}>
                <button
                  onClick={(e) => {
                    getItems(e, element._id);
                  }}
                  className="btn btn-primary text-white"
                >
                  {element?.name}
                </button>
              </div>
            ))}
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
          <div className="position-absolute z-3 end-0 top-0">
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
                    src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.images[0]}`}
                    className="card-img-top"
                    alt=""
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      {editeStatus ? (
                        <input
                          name="newPrice"
                          type="number"
                          className="form-control"
                          onChange={takeNewPrice}
                        />
                      ) : (
                        <p className="text-muted mb-2">
                          {element?.lastPrice} EGP
                        </p>
                      )}
                      {editeStatus ? (
                        loadingForEdit ? (
                          <div className="w-100 justify-content-center d-flex">
                            <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                          </div>
                        ) : (
                          <button
                            onClick={sendNewValue}
                            className="btn btn-primary"
                          >
                            done
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            turnEditTrue(element._id);
                          }}
                          className="btn btn-primary"
                        >
                          edit
                        </button>
                      )}
                    </div>
                    <h5 className="card-title">{element?.name}</h5>
                    <p className="card-text mb-2">{element?.description}</p>
                    <div className="d-flex justify-content-center">
                      {statusLoading ? (
                        <i className="fa solid fa-spinner fa-spin responsive-font-size-h1"></i>
                      ) : (
                        <button
                          onClick={(e) => {
                            putStatusOfItem(e, element?._id);
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
                    <div className="d-flex justify-content-center mt-3">
                      {sellerLoading ? (
                        <i className="fa solid fa-spinner fa-spin responsive-font-size-h1"></i>
                      ) : (
                        <button
                          onClick={(e) =>
                            handleSellerButtonClick(e, element?._id)
                          }
                          className={`btn ${
                            element?.bestSeller === false
                              ? "btn-danger"
                              : "btn-success"
                          }`}
                        >
                          {element?.bestSeller === false
                            ? "Out of Best"
                            : "Best Seller"}
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
                            putSalePercentItemId(element?._id);
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
                      {element?.discount <= 0 || element?.discount == null ? (
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
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-center my-2">
                      <button
                        onClick={() => {
                          putIdOFItemDeletIt(element?._id);
                        }}
                        className="btn btn-secondary"
                      >
                        Delete{" "}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* delete item */}
          <div className={sureDeleteItem}>
            <button
              onClick={closeSureBox}
              className="position-absolute end-2 top-2 btn btn-close"
            ></button>
            <p className="py-4">
              {" "}
              Are you sure you want to delete this item? This action is
              irreversible and will permanently remove the item from the system.{" "}
            </p>
            <div className="d-flex justify-content-center">
              <button onClick={deleteItem} className="btn btn-primary ">
                delete
              </button>
            </div>
          </div>
          {/* delete item from one category */}
          <div className={sureDeleteItemFromOneCategory}>
            <button
              onClick={closeSureBoxOFitem}
              className="position-absolute end-2 top-2 btn btn-close"
            ></button>
            <p className="py-4">
              {" "}
              Are you sure you want to delete this item from this category only?{" "}
            </p>
            <div className="d-flex justify-content-center">
              <button
                onClick={deleteItemFromOneCategory}
                className="btn btn-primary "
              >
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
      {/* add itmes in occasions  */}
      <div className="d-flex justify-content-center flex-wrap gap-3 mt-5">
        <div className="d-flex border-3 border-secondary rounded pt-3 flex-column gap-3">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {showCategoryForOccasion === null ||
            showCategoryForOccasion.length === 0 ? (
              <p className="text-center text-danger">
                "There are no categories"
              </p>
            ) : (
              showCategoryForOccasion.map((element, i) => (
                <div key={i}>
                  <button
                    onClick={() => {
                      handleCategorySelection(element._id, element.name);
                    }}
                    className="btn btn-secondary text-white"
                  >
                    {element?.name}
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="d-flex justify-content-center border-3 border-secondary gap-3 flex-wrap p-2 overflow-auto">
            {AllCategoryNameForOccasion === null ||
            AllCategoryNameForOccasion.length === 0
              ? "Here, you will find the categories you have selected. This section provides a clear and organized view of your chosen categories, ensuring that you can easily track and manage your selections."
              : AllCategoryNameForOccasion.map((element, i) => (
                  <div key={i} className="d-flex justify-content-center gap-1">
                    <button className="btn btn-light text-dark">
                      {element}
                    </button>
                    <button
                      onClick={() => {
                        const categoryID = AllCategoryIdForOccasion[i]; // This assumes names and IDs are in the same order
                        removeCategoryIdForOccasion(categoryID, element);
                      }}
                      className="btn btn-close"
                    ></button>
                  </div>
                ))}
          </div>
        </div>
        {/* form ---------------------- */}
        <div className="container border-3 border-secondary rounded d-flex align-items-center flex-column p-3 position-relative ">
          <div
            onClick={closeShowItemsForOccasion}
            className="position-absolute end-4 top-50"
          >
            <button className="btn btn-close"></button>
          </div>
          <form className="w-50">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                item name
              </label>
              <input
                onChange={putItemInfoForOccasion}
                type="text"
                className="form-control"
                id="itemNameForOccasion" // Unique id
                aria-describedby="emailHelp"
                name="name"
                value={itemsDetailsForOccasion.name}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                description
              </label>
              <input
                onChange={putItemInfoForOccasion}
                type="text"
                className="form-control"
                id="itemDescriptionForOccasion" // Unique id
                name="description"
                value={itemsDetailsForOccasion.description}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="price">
                {" "}
                {/* Changed id */}
                price
              </label>
              <input
                onChange={putItemInfoForOccasion}
                type="number"
                className="form-control"
                id="itemPrice1ForOccasion" // Unique id
                name="price"
                value={itemsDetailsForOccasion.price}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="images">
                image
              </label>
              <input
                onChange={handleImageOnChangeForOccasion}
                ref={imageInputRefForOccasion}
                multiple
                type="file"
                className="form-control"
                id="itemImages" // Unique id
                name="images"
                accept="image/*"
              />
            </div>
            <div className="image-preview-container d-flex gap-3">
              {imagePreviewsForOccasion.length > 0 &&
                imagePreviewsForOccasion.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Preview ${index}`} width="100" />
                  </div>
                ))}
            </div>
            {errorMessageForItemForOccasion === ""
              ? ""
              : errorMessageForItemForOccasion}
            {isLoadingForOccasion ? (
              <button disabled className=" btn btn-primary px-4">
                <i className="fa solid fa-spinner fa-spin "></i>
              </button>
            ) : (
              <button
                onClick={sendItemDetailForOccasion}
                type="submit"
                className="btn btn-primary"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
      {/* done add items in occasion ***************** */}
      {/* add status for each item IN stock or out  */}
      <h3 className="responsive-font-size-h3 mt-3 colorForTitles text-center">
        Choose Occasion To Show Items
      </h3>
      <div className="container flex-wrap d-flex justify-content-center gap-3 py-5">
        {showCategoryForOccasion === null ||
        showCategoryForOccasion.length === 0 ? (
          <p className="text-center text-danger">"There are no categories"</p>
        ) : (
          showCategoryForOccasion.map((element, i) => (
            <button
              onClick={(e) => {
                getItemsForOccasions(e, element?._id);
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
        {loadingForItemsForOccasion ? (
          <div className="w-100 d-flex justify-content-center">
            <i className="fa solid fa-spinner fa-spin responsive-font-size-h1"></i>
          </div>
        ) : (
          ""
        )}
        <div className={classForItemsForOccasion}>
          <div className="position-absolute z-3 end-0 top-0">
            <button
              onClick={CloseItemsInCategoryForOccasion}
              className="btn btn-close"
            ></button>
          </div>
          {currentItemForOccasion == null ||
          currentItemForOccasion.length == 0 ? (
            ""
          ) : (
            <div className="d-flex justify-content-center position-relative gap-3 flex-wrap">
              {currentItemForOccasion.map((element, i) => (
                <div
                  key={i}
                  className="card widthOfCard my-5 position-relative"
                >
                  <div className="position-absolute top-0 start-100 translate-middle">
                    <button
                      onClick={() => {
                        putItemIdForOccasion(element._id);
                      }}
                      className="btn btn-close"
                    ></button>
                  </div>
                  <img
                    src={`https://akflorist.s3.eu-north-1.amazonaws.com/${element?.images[0]}`}
                    className="card-img-top"
                    alt=""
                  />
                  <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                      {editeStatus ? (
                        <input
                          name="newPrice"
                          type="number"
                          className="form-control"
                          onChange={takeNewPrice}
                        />
                      ) : (
                        <p className="text-muted mb-2">
                          {element?.lastPrice} EGP
                        </p>
                      )}
                      {editeStatus ? (
                        loadingForEdit ? (
                          <div className="w-100 justify-content-center d-flex">
                            <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
                          </div>
                        ) : (
                          <button
                            onClick={sendNewValueOccasion}
                            className="btn btn-primary"
                          >
                            done
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            turnEditTrue(element._id);
                          }}
                          className="btn btn-primary"
                        >
                          edit
                        </button>
                      )}
                    </div>
                    <h5 className="card-title">{element?.name}</h5>
                    <p className="card-text mb-2">{element?.description}</p>
                    <div className="d-flex justify-content-center">
                      {statusLoadingForOccasion ? (
                        <i className="fa solid fa-spinner fa-spin responsive-font-size-h1"></i>
                      ) : (
                        <button
                          onClick={(e) => {
                            putStatusOfItemForOccasion(e, element?._id);
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
                    <div className="d-flex justify-content-center mt-3">
                      {sellerLoadingForOccasion ? (
                        <i className="fa solid fa-spinner fa-spin responsive-font-size-h1"></i>
                      ) : (
                        <button
                          onClick={(e) =>
                            handleSellerButtonClickForOccasion(e, element?._id)
                          }
                          className={`btn ${
                            element?.bestSeller === false
                              ? "btn-danger"
                              : "btn-success"
                          }`}
                        >
                          {element?.bestSeller === false
                            ? "Out of Best"
                            : "Best Seller"}
                        </button>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="d-flex justify-content-center gap-2">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="discount percent"
                          onChange={putSalePercentForOccasion}
                          id="discountPercent"
                        />
                        <button
                          onClick={() => {
                            putSalePercentItemIdForOccasion(element?._id);
                          }}
                          className="btn btn-secondary"
                        >
                          {" "}
                          OK
                        </button>
                      </div>
                      {salePuttedForOccasion &&
                      salePuttedItemIdForOccasion === element._id
                        ? "done"
                        : ""}
                      {element?.discount <= 0 || element?.discount == null ? (
                        ""
                      ) : (
                        <div className="d-flex justify-content-center gap-2 mt-2">
                          <p>cancel sale</p>
                          <button
                            onClick={() => {
                              cancelSaleForOccasion(element._id);
                            }}
                            className="btn btn-primary p-1"
                          >
                            cancel
                          </button>
                        </div>
                      )}
                      {sureBoxForCancelperForOcccasion ? (
                        <div className="position-fixed top-50 start-50 translate-middle z-3 bg-white shadow rounded-3  text-black p-5">
                          <button
                            onClick={closeSureBoxForCancelPerForOccasion}
                            className="position-absolute end-2 top-2 btn btn-close"
                          ></button>
                          <p>are you sure you want to cancel the sale </p>
                          <div className="d-flex justify-content-center mt-4">
                            <button
                              onClick={(e) => {
                                submitCancelPercentForOccasion(e);
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
                        {loadForPercentForOccasion ? (
                          <button className="btn btn-primary">
                            <i className="fa solid fa-spinner fa-spin "></i>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              submitSalePercentForOccasion(e);
                            }}
                            className="btn btn-primary mt-2"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-center my-2">
                      <button
                        onClick={() => {
                          putIdOFItemDeletItForOccasion(element?._id);
                        }}
                        className="btn btn-secondary"
                      >
                        Delete{" "}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* delete item */}
          <div className={sureDeleteItemForOccasion}>
            <button
              onClick={closeSureBoxForOccasion}
              className="position-absolute end-2 top-2 btn btn-close"
            ></button>
            <p className="py-4">
              {" "}
              Are you sure you want to delete this item? This action is
              irreversible and will permanently remove the item from the system.{" "}
            </p>
            <div className="d-flex justify-content-center">
              <button
                onClick={deleteItemForOccasion}
                className="btn btn-primary "
              >
                delete
              </button>
            </div>
          </div>
          {/* delete item from one category */}
          <div className={sureDeleteItemFromOneOccasion}>
            <button
              onClick={closeSureBoxOFitemForOccasion}
              className="position-absolute end-2 top-2 btn btn-close"
            ></button>
            <p className="py-4">
              {" "}
              Are you sure you want to delete this item from this category only?{" "}
            </p>
            <div className="d-flex justify-content-center">
              <button
                onClick={deleteItemFromOneOccasion}
                className="btn btn-primary "
              >
                delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={classOfArrowForOccasion}>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => paginateForOccasion(currentPageForOccasion - 1)}
          disabled={currentPageForOccasion === 1}
        >
          &laquo; Previous
        </button>
        <span className="mx-2 mt-2">
          Page {currentPageForOccasion} of {totalPagesForOccasion}
        </span>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => paginateForOccasion(currentPageForOccasion + 1)}
          disabled={currentPageForOccasion === totalPagesForOccasion}
        >
          Next &raquo;
        </button>
      </div>
      {/* end of status  ****************************----*/}
    </>
  );
}
