import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import "../css/LogIn.css";
import { jwtDecode } from "jwt-decode";
import { date } from "joi";

function LogIn({ saveUser, userRole }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [checked, setChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // State for toggling password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const handleGoogleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    // console.log(credentialResponse);

    if (token) {
      console.log(jwtDecode(token));
      
      localStorage.setItem("token", token);
      // Send the token to the backend
      fetch("https://akflorist-production.up.railway.app/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }), // Send token to the backend
      })
        .then((res) => res.json())
        .then((data) => {
          const userData = data.user;
          console.log("from api :  ", userData);
          saveUser(userData);
          // Redirect to home page or handle accordingly
          navigate("/home");
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Failed to retrieve login credentials.");
    }
  };



  // Step 1: Initiate Google OAuth flow
  // async function auth() {
  //   try {
  //     // Initiate Google OAuth flow by making a request to your backend
  //     const response = await fetch(
  //       "https://akflorist-production.up.railway.app/auth/google",
  //       {
  //         method: "POST",
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Failed to initiate OAuth: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     window.location.href = data.url;
  //   } catch (error) {
  //     console.error("Error during auth:", error.message);
  //     alert("Authentication failed. Please try again."); // User-friendly message
  //   }
  // }

  // // Step 2: Handle the callback after Google redirects back to your app
  // useEffect(() => {
  //   console.log(window.location.search);

  //   const urlParams = new URLSearchParams(window.location.search);
  //   // const code = urlParams.get("code");
  //   // if (code) {
  //   //   // Save the code to localStorage
  //   //   localStorage.setItem("code", code);
  //   //   console.log("OAuth code saved:", code);
  //   // } else {
  //   //   console.log("No OAuth code found in the URL.");
  //   // }
  //   // console.log(code);

  //   // if (code) {
  //   //   console.log("Google auth code:", code);
  //   //   handleGoogleCallback(code);
  //   // } else {
  //   //   console.log("No code found in the URL");
  //   // }
  // }, []);

  // async function handleGoogleCallback(code) {
  //   console.log(code);

  //   try {
  //     const response = await fetch(
  //       `https://akflorist-production.up.railway.app/getGoogleUser?code=${code}`,
  //       { method: "GET" }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch user data: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Google user data:", data);

  //     // Save token and user data to local storage
  //     localStorage.setItem("token", data.tokens.access_token);
  //     saveUser(data.userData); // Assuming saveUser is a function to manage user data
  //   } catch (error) {
  //     console.error("Error during Google callback:", error.message);
  //     alert("Failed to retrieve user data. Please try again."); // User-friendly message
  //   }
  // }

  // Handle form input changes
  function setUserInput(e) {
    let myUserInfo = { ...user };
    myUserInfo[e.target.name] = e.target.value;
    if (e.target.name === "username") {
      myUserInfo.username = myUserInfo.username.toLowerCase();
    }
    setUser(myUserInfo);
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let { data } = await axios.post(
        "https://akflorist-production.up.railway.app/auth/login",
        user
      );
      localStorage.setItem("token", data.token);

      // Update the user and role locally before navigating
      saveUser(data.user);
      setErrorMessage("");

      // Wait until user role is available before navigating
      if (data.user?.role) {
        navigateBasedOnRole(data.user.role); // Use the role from the response
      } else {
        setErrorMessage("Unable to determine user role.");
      }

      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }

  function navigateBasedOnRole(role) {
    if (role) {
      switch (role) {
        case "customer":
          navigate("/home");
          break;
        case "admin1":
          navigate("/admin1");
          break;
        case "admin2":
          navigate("/admin2");
          break;
        default:
          navigate("/");
          break;
      }
    }
  }

  function handleError(error) {
    if (error.response && error.response.status === 400) {
      setErrorMessage("Email or password incorrect");
    } else if (error.response && error.response.status === 502) {
      alert("Server is down");
    }
    setLoading(false);
  }
  useEffect(() => {
    if (userRole?.role) {
      navigateBasedOnRole(userRole.role);
    }
  }, [userRole]);

  return (
    <div className="background">
      <div className="login-form">
        <h2 className="mb-2">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="username"
            value={user.username}
            onChange={setUserInput}
            className="form-control"
          />
          <div className="input-group">
            <input
              type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={setUserInput}
              className="form-control"
            />
            <button
              type="button"
              className="btn bg-white text-muted h-50 w-25"
              onClick={togglePasswordVisibility}
            >
              <i
                className={`fa ${
                  isPasswordVisible ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </button>
          </div>
          {/* <input
            type="password"
            placeholder="Password"
            name="password"
            value={user.password}
            onChange={setUserInput}
            className="form-control"
          /> */}
          <div
            className="checkbox-container mb-2"
            onClick={() => setChecked(!checked)}
          >
            <div className={`checkbox-box ${checked ? "checked" : ""}`}>
              {checked && <div className="checkmark">&#10003;</div>}
            </div>
            <label className="checkbox-label">Remember Me</label>
          </div>
          {errorMessage && (
            <div className="my-3 text-danger">{errorMessage}</div>
          )}
          {loading ? (
            <button disabled>
              <i className="fa solid fa-spinner fa-spin"></i>
            </button>
          ) : (
            <div className="d-flex flex-column align-items-start">
              <button type="submit" className="">
                Login
              </button>
              <Link className="sizeOfFontNav" to="/forgetPassword">
                Forgot Password?
              </Link>
            </div>
          )}

          <div className="d-flex mt-2">
            <span className="text-black textSizeForSpan">
              Don't have an account?
            </span>
            <NavLink to="/register" className="ms-2 sizeOfFontNav text-primary">
              Create Account
            </NavLink>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <div className="styleLineBetweenItems"></div>
          </div>
          <div className="d-flex justify-content-center gap-2 mt-3 ">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                alert("Login Failed");
              }}
              // scope="https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.phonenumbers.read"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
