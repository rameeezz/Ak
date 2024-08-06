import React, { useEffect, useState } from "react";
import BgForLogin from "../assets/bg/bgLogin.jpg";
import "../css/LogIn.css";
import { NavLink, Link, useNavigate ,Navigate} from "react-router-dom";
import joi from "joi";
import axios from "axios";

function navigates(url) {
  window.location.href = url
}
async function auth() {
  const response = await fetch("https://freelance1-production.up.railway.app/auth/google",{method:'post'})
  const data =await response.json();
  console.log(data.url);
  
  navigates(data.url); 
}
// async function auth() {
//   try {
//     const response = await fetch("/api/auth/google", { method: "post" });
//     const data = await response.json();
//     navigates(data.url);
//   } catch (error) {
//     console.error("Error during auth:", error);
//   }
// }


export default function LogIn({ saveUser, userRole }) {
  let [user, setUser] = useState({
    username: "",
    password: "",
  });
  // console.log(user);

  function SetUser(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    if (e.target.name === "username") {
      myUser.username = myUser.username.toLowerCase();
    }
    setUser(myUser);
    console.log(myUser);
    
  }
  const [checked, setChecked] = useState(false);

  const handleCheckboxClick = () => {
    setChecked(!checked);
  };
  const [errorMessage, setErrorMessage] = useState("");
  // const [errorList, setErrorList] = useState([]);
  // console.log(errorList);
  const [Loading, setLoading] = useState(false);
  let navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let { data } = await axios.post(
        "https://freelance1-production.up.railway.app/auth/login",
        user
      );
      // console.log(data.user.role);
      localStorage.setItem("token", data.token);
      saveUser();
      setErrorMessage("");
      setLoading(false);
      setUser({
        username:"",
        password:""
      })
      // console.log(userRole.role);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("email or password wrong");
        setLoading(false);
      }
    }
  }
  useEffect(()=>{
    if (userRole?.role) {
      switch (userRole.role) {
        case "customer":
          // return <Navigate to="/home" replace />;
          navigate("/home")
          break;
        case "admin1":
          // navigate("/admin1");
          // return <Navigate to="/admin1" replace />;
          navigate("/admin1")
          break;
        default:
          // return <Navigate to="/" replace />;
          navigate("/")
          break;
      }
    }
  },[userRole?.role])
  // function validUser() {
  //   let scheme = joi.object({
  //     username: joi
  //       .string()
  //       .required()
  //       .email({ tlds: { allow: ["com", "net"] } })
  //       .messages({
  //         "string.base": "Email must be a string.",
  //         "string.empty": "Email is required.",
  //         "string.email": "Please enter a valid email address.",
  //         "any.invalid": "Email must be a .com or .net .",
  //       }),
  //     password: joi
  //       .string()
  //       .required()
  //       .pattern(
  //         new RegExp(
  //           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/
  //         )
  //       )
  //       .messages({
  //         "string.base": "Password must be a string.",
  //         "string.empty": "Password is required.",
  //         "string.pattern.base":
  //           "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  //       }),
  //   });
  //   return scheme.validate(user, { abortEarly: false });
  // }
  return (
    <>
      {/* <img src={BgForLogin} alt="bg" className='bgForLogin'/> */}
      <div className="background">
        <div className="login-form">
          <h2 className="mb-2">Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              name="username"
              value={user.username}
              onChange={SetUser}
              className="form-control"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={SetUser}
              className="form-control"
            />
            <div
              className="checkbox-container mb-2"
              onClick={handleCheckboxClick}
            >
              <div className={`checkbox-box ${checked ? "checked" : ""}`}>
                {checked && <div className="checkmark">&#10003;</div>}
              </div>
              <label className="checkbox-label">Remember Me</label>
            </div>
            {errorMessage == "" ? (
              ""
            ) : (
              <div className="my-3 text-danger">{errorMessage}</div>
            )}
            {/* {errorList.length > 0
              ? errorList.map((element) => (
                  <div className="my-2 text-danger textSTyleForError">
                    {element.message}
                  </div>
                ))
              : ""} */}
            {Loading ? (
              <button>
                <i className="fa solid fa-spinner fa-spin"></i>
              </button>
            ) : (
              <div className="d-flex flex-column align-items-start">
                <button type="submit" onClick={handleSubmit} className="">
                  Login
                </button>
                <Link className="sizeOfFontNav" to="/forgetPassword">
                  Forgot Password?
                </Link>
              </div>
            )}

            <div className="d-flex mt-2 ">
              <span className="text-black textSizeForSpan">
                Don't have an account?
              </span>
              <NavLink
                to="/register"
                className="ms-2 sizeOfFontNav text-primary"
              >
                Create Account
              </NavLink>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <div className="styleLineBetweenItems"></div>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-3 ">
              <i onClick={()=>auth()} className="fa-brands fa-google text-success sizeOfI CursorPointer"></i>
             <i className="fa-brands fa-facebook sizeOfI CursorPointer text-primary"></i>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
