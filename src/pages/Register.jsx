import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../css/Register.css"; // Ensure the correct path to your CSS file
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
  // console.log(RegisterInfo);
  function SetInfo(e) {
    let MyUser = { ...RegisterInfo };
    MyUser[e.target.name] = e.target.value;
    setRegisterInfo(MyUser);
    // console.log(MyUser);
    setLoading(false)
  }
  const [phone, setPhone] = useState("");

  const handleOnChange = (value) => {
    setPhone(value);
    // console.log(value);
    setRegisterInfo({ ...RegisterInfo, mobileNumber: value });
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [errorList, setErrorList] = useState([]);
  // console.log(errorList);
  
  const [Loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
   let  valid  =  ValidData()
    console.log(valid);
    // setErrorMessage(valid.error.details.message)
    if (valid.error == null) {
      setLoading(true);
      setErrorList([])
      try {
        let { data } = await axios.post(
          "https://freelance1-production.up.railway.app/auth/signup",
          RegisterInfo
        );
        console.log(data.message);
        setErrorMessage("");
        setRegisterInfo({
          ...RegisterInfo,
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
          console.log("ahmd w astna");
          setErrorMessage(
            "The passwords you entered do not match. Please ensure both password fields contain the same information and try again"
          );
          setLoading(false);
        } else if (error.response && error.response.status === 400) {
          console.log("user mtkrrr");
          setErrorMessage(
            "The email address you have entered is already associated with an existing account"
          );
          setLoading(false);
        }
      }
    }else{
      setErrorList(valid.error.details)
    }
   
  
  }
  // function ValidData() {
  //   let scheme = joi.object({
  //     firstName: joi.string().required().min(3).max(15).alphanum(),
  //     lastName: joi.string().required().min(3).max(15).alphanum(),
  //     email: joi.string().required().email({tlds: {allow :["com","net"]}}),
  //     password: joi.string().required().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,} $/)),
  //     confirmPassword: joi.ref('password'),
  //   });
  // return  scheme.validate(RegisterInfo , {abortEarly:false})
  
  // }
  function ValidData() {
    const scheme = joi.object({
      firstName: joi
        .string()
        .required()
        .min(3)
        .max(15)
        .messages({
          'string.base': 'First name must be a string.',
          'string.empty': 'First name is required.',
          'string.min': 'First name must be at least 3 characters long.',
          'string.max': 'First name cannot exceed 15 characters.',
          'string.alphanum': 'First name must contain only letters and numbers.',
        }),
      lastName: joi
        .string()
        .required()
        .min(3)
        .max(15)
        .messages({
          'string.base': 'Last name must be a string.',
          'string.empty': 'Last name is required.',
          'string.min': 'Last name must be at least 3 characters long.',
          'string.max': 'Last name cannot exceed 15 characters.',
          'string.alphanum': 'Last name must contain only letters and numbers.',
        }),
      email: joi
        .string()
        .required()
        .email({ tlds: { allow: ['com', 'net'] } })
        .messages({
          'string.base': 'Email must be a string.',
          'string.empty': 'Email is required.',
          'string.email': 'Please enter a valid email address.',
          'any.invalid': 'Email must be a .com or .net .',
        }),
      password: joi
        .string()
        .required()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/))
        .messages({
          'string.base': 'Password must be a string.',
          'string.empty': 'Password is required.',
          'string.pattern.base':
            'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        }),
      confirmPassword: joi
        .string()
        .required()
        .valid(joi.ref('password'))
        .messages({
          'any.only': 'Confirm Password must match the Password.',
          'string.empty': 'Confirm Password is required.',
        }),
        mobileNumber: joi
        .string()
        .required()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .messages({
          'string.empty': 'Mobile number is required.',
          'string.pattern.base': 'Please enter a valid mobile number with a country code.',
        }),
    });
  
    return scheme.validate(RegisterInfo, { abortEarly: false });
  }
  
  return (
    <div className="backgroundBg">
      <div className="login-form p-4">
        <h2 className="mb-2">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center gap-2">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={SetInfo}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={SetInfo}
            />
          </div>
          <input
            onChange={SetInfo}
            type="email"
            placeholder="Email"
            name="email"
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
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={SetInfo}
          />
          {errorMessage == "" ? (
            ""
          ) : (
            <div className="alert text-muted">{errorMessage}</div>
          )}
          {errorList.length >0 ? (
            errorList.map((element)=><div className="my-2 text-muted textSTyleForError">{element.message}</div>)
          ) : (
            ""
          )}
          {Loading ? (
            <button>
              <i className="fa solid fa-spinner fa-spin"></i>
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}>
              Create
            </button>
          )}

          <div className="d-flex justify-content-center mt-3">
            <div className="styleLineBetweenItems"></div>
          </div>
          <div className="d-flex justify-content-center gap-2 mt-3 ">
            <i className="fa-brands fa-google text-success sizeOfI CursorPointer"></i>
            <i className="fa-brands fa-facebook sizeOfI CursorPointer text-primary"></i>
          </div>
        </form>
      </div>
    </div>
  );
}
