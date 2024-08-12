import React, { useEffect, useState } from "react";
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
          setErrorMessage("there are user as the same username");
        }
      }
    } else {
      setErrorList(valid.error.details);
      console.log(valid.error.details);
    }
  }
  function ValidData() {
    const scheme = joi.object({
      username: joi.string().required().min(3).max(15).messages({
        "string.base": "First name must be a string.",
        "string.empty": "First name is required.",
        "string.min": "First name must be at least 3 characters long.",
        "string.max": "First name cannot exceed 15 characters.",
        "string.alphanum": "First name must contain only letters and numbers.",
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
    }
  }
  useEffect(() => {
    getCategory();
  }, [showCategory]);
  function openCayegory() {
    setClassOfShowCategory("row text-center");
  }
  function closeCategory() {
    setClassOfShowCategory("d-none");
  }
  // done show category *************
  // delete category
  const [setCategoryId , setSetCategoryId] = useState({
    categoryID:""
  }) 
  // console.log(setCategoryId);
  
  const [sureMessage , setSureMessage]  = useState("")
  const [classOFShowSureBox , setclassOFShowSureBox]  = useState("d-none ")
   function DeleteCategory(IdOfElement) {
    // console.log(IdOfElement);
    
  setSetCategoryId({...setCategoryId , categoryID:IdOfElement})
  setSureMessage("are you sure you want to delete this category ?")
  setclassOFShowSureBox("position-fixed top-50 start-50 translate-middle z-3 bg-white shadow rounded-3  text-black p-5")
  }
  async function sureDeleteCategory() {
    // console.log(setCategoryId.categoryID);
    
    try {
      let {data} = await axios.delete(`https://freelance1-production.up.railway.app/admin1/deleteCategory/${setCategoryId.categoryID}`)
      console.log(data);
      showAlertMessage();
      setclassOFShowSureBox("d-none")
      // getCategory()
    } catch (error) {
      
    }
    
  }
  function closeSureSection() {
    setclassOFShowSureBox("d-none")
  }
  // done delete categroy *****************
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
          <h2 className="responsive-font-size-h3 colorForTitles text-center">
            Add Admin
          </h2>
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
          <h2 className="responsive-font-size-h3 colorForTitles text-center">
            add category
          </h2>
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
              showCategory.map((element,i) => (
                <div key={i} className="col-md-2 col-sm-1 my-2 d-flex justify-content-center">
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
            <button  onClick={closeSureSection} className="position-absolute end-2 top-2 btn btn-close"></button>
            <p className="py-4"> {sureMessage}</p>
            <div className="d-flex justify-content-center">
            <button onClick={sureDeleteCategory} className="btn btn-primary ">delete</button>
            </div>
          </div>
          {/* ------------------------------------ */}
        </div>
      </div>
    </>
  );
}
