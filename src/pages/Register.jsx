import React, { useState, useRef } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../css/Register.css";
import { useNavigate } from "react-router-dom";
import joi from "joi";

export default function Register() {
  let navigate = useNavigate();
  const [RegisterInfo, setRegisterInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });
  const [verifyOtp, setVerifyOtp] = useState({
    email: "",
    otp: "",
  });

  const [classOfOtp, setClassOfOtp] = useState("d-none");

  function SetInfo(e) {
    setErrorList([]);
    let MyUser = { ...RegisterInfo };
    MyUser[e.target.name] = e.target.value;

    if (e.target.name === "email") {
      MyUser.email = MyUser.email.toLowerCase();
    }

    setRegisterInfo(MyUser);
    setLoading(false);
  }

  function takeNumberOfOtp(e, index) {
    const otpArray = [...verifyOtp.otp];
    otpArray[index] = e.target.value; // Update the specific index
    const otpValue = otpArray.join(""); // Join the array to form the full OTP

    setVerifyOtp({
      ...verifyOtp,
      otp: otpValue, // Update otp in the state with the concatenated value
    });

    // Focus the next input field if the current one has a value
    if (e.target.value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  }

  const [phone, setPhone] = useState("");

  const handleOnChange = (value) => {
    setPhone(value);
    setRegisterInfo({ ...RegisterInfo, mobileNumber: value });
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [errorList, setErrorList] = useState([]);

  const [Loading, setLoading] = useState(false);
  const [LoadingForVerify, setLoadingForVerify] = useState(false);

  async function sendOpt(e) {
    e.preventDefault();
    let valid = ValidData();
    if (valid.error == null) {
      setLoading(true);
      setErrorList([]);
      try {
        let { data } = await axios.post(
          "https://freelance1-production.up.railway.app/auth/sendOTP",
          { email: RegisterInfo.email }
        );
        setClassOfOtp(
          "w-100 h-vh bg-white d-flex justify-content-center align-items-center position-fixed z-10 top-0 end-0"
        );
        setLoading(false);
        setVerifyOtp({ ...verifyOtp, email: RegisterInfo.email });
      } catch (error) {}
    } else {
      setErrorList(valid.error.details);
    }
  }

  async function sendVerifyOtp(e) {
    e.preventDefault();
    setLoadingForVerify(true);
    try {
      let { data } = await axios.post(
        "https://freelance1-production.up.railway.app/auth/verifyOTP",
        verifyOtp
      );
      // console.log(data);
      setLoadingForVerify(false);
      handleSubmit(e);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        alert("The (OTP) number is wrong try again.");
        setLoadingForVerify(false);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorList([]);
    try {
      let { data } = await axios.post(
        "https://freelance1-production.up.railway.app/auth/signup",
        RegisterInfo
      );
      setErrorMessage("");
      setRegisterInfo({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrorMessage(
          "The passwords you entered do not match. Please ensure both password fields contain the same information and try again"
        );
        setLoading(false);
      } else if (error.response && error.response.status === 400) {
        setClassOfOtp("d-none");
        setErrorMessage(
          "The email address you have entered is already associated with an existing account."
        );
        setLoading(false);
      }
    }
  }

  function ValidData() {
    const scheme = joi.object({
      firstName: joi.string().required().min(3).max(15).messages({
        "string.base": "First name must be a string.",
        "string.empty": "First name is required.",
        "string.min": "First name must be at least 3 characters long.",
        "string.max": "First name cannot exceed 15 characters.",
        "string.alphanum": "First name must contain only letters and numbers.",
      }),
      lastName: joi.string().required().min(3).max(15).messages({
        "string.base": "Last name must be a string.",
        "string.empty": "Last name is required.",
        "string.min": "Last name must be at least 3 characters long.",
        "string.max": "Last name cannot exceed 15 characters.",
        "string.alphanum": "Last name must contain only letters and numbers.",
      }),
      email: joi
        .string()
        .required()
        .email({ tlds: { allow: ["com", "net"] } })
        .messages({
          "string.base": "Email must be a string.",
          "string.empty": "Email is required.",
          "string.email": "Please enter a valid email address.",
          "any.invalid": "Email must be a .com or .net .",
        }),
      password: joi
        .string()
        .required()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/
          )
        )
        .messages({
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
      mobileNumber: joi
        .string()
        .required()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .messages({
          "string.empty": "Mobile number is required.",
          "string.pattern.base":
            "Please enter a valid mobile number with a country code.",
        }),
    });

    return scheme.validate(RegisterInfo, { abortEarly: false });
  }

  // Create a ref for each OTP input field
  const otpRefs = useRef([]);

  return (
    <>
      <div className="backgroundBg">
        <div className="login-form p-4">
          <h2 className="mb-2">Register</h2>
          <form onSubmit={sendOpt}>
            <div className="d-flex justify-content-center gap-2">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={SetInfo}
                className="form-control"
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={SetInfo}
                className="form-control"
              />
            </div>
            <input
              onChange={SetInfo}
              type="email"
              placeholder="Email"
              name="email"
              className="form-control"
            />
            <div className="phone-input-container">
              <PhoneInput
                country={"eg"} // Default country
                value={phone}
                onChange={handleOnChange}
                inputClass="phone-input-field" // Custom class for styling the input
                dropdownClass="country-dropdown" // Custom class for styling the dropdown
                preferredCountries={["eg", "us", "gb"]} // List of preferred countries
              />
            </div>

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={SetInfo}
              className="form-control"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={SetInfo}
              className="form-control"
            />
            {errorMessage === "" ? (
              ""
            ) : (
              <div className="alert text-danger">{errorMessage}</div>
            )}
            {errorList.length > 0 ? (
              <ul className="alert text-danger">
                {errorList.map((error) => (
                  <li key={error.message}>{error.message}</li>
                ))}
              </ul>
            ) : (
              ""
            )}

            <button type="submit" className="btn btn-primary">
              {Loading ? "Loading..." : "Register"}
            </button>
          </form>
        </div>
        <div className={classOfOtp}>
          <div className="position-relative shadow p-5 rounded">
            <div className="otp-div p-3">
              <h2 className="text-center mb-3">
                Please enter the One-Time Password (OTP) sent to your registered
                email address.
              </h2>
              <form onSubmit={sendVerifyOtp}>
                <div className="d-flex justify-content-center align-items-center gap-4 ">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="form-control square-input"
                      onChange={(e) => takeNumberOfOtp(e, index)}
                      ref={(el) => (otpRefs.current[index] = el)}
                    />
                  ))}
                </div>
                <div className="w-100 d-flex justify-content-center align-items-center mt-4">
                  {LoadingForVerify ? (
                    <button className="btn btn-primary px-4">
                      <i className="fa solid fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button className="btn btn-primary px-4" onClick={sendVerifyOtp}>
                      Verify
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
