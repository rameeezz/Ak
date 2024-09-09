import React, { useState } from "react";
import axios from "axios";
import joi from "joi";
import { useNavigate } from 'react-router-dom';
export default function ForgetPassword() {
  let navigate = useNavigate()
  const [email, setEmail] = useState({
    email: "",
  });
  // console.log(email.email);

  const [resetPasswordInfo, setResetPasswordInfo] = useState({
    email: email.email,
    resetToken: "",
    newPassword: "",
  });
  // console.log(resetPasswordInfo);
  const [errorList, setErrorList] = useState([]);
  const [loading, setLoading] = useState(false);
  // State for toggling password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [loadingForResetForm, setLoadingForResetForm] = useState(false);
  const [classOfEmail, setClassOfEmail] = useState(
    "shadow bg-white p-5 rounded"
  );
  const [classOfOtp, setClassOfOpt] = useState("d-none");
  function takeEmailFromUser(e) {
    let myEmail = { ...email };
    myEmail[e.target.name] = e.target.value.toLowerCase(); // Convert to lowercase
    setEmail(myEmail);
    setResetPasswordInfo((prev) => ({
      ...prev,
      email: myEmail.email,
    }));
  }
  function takeResetPass(e) {
    let myNewPass = { ...resetPasswordInfo };
    myNewPass[e.target.name] = e.target.value;
    setResetPasswordInfo(myNewPass);
  }
  async function sendEmail(e) {
    e.preventDefault();
    if (email.email === "") {
      alert("Please put an email.");
    } else {
      setLoading(true);
      try {
        let { data } = await axios.post(
          "https://freelance1-production.up.railway.app/auth/sendResetPasswordOTP",
          email
        );
        console.log(data);

        setLoading(false);
        setClassOfEmail("d-none");
        setClassOfOpt("shadow bg-white p-5 rounded");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setLoading(false);
          alert("Not Found");
        }
      }
    }
  }
  function ValidData() {
    const scheme = joi.object({
      newPassword: joi
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
    });

    const result = scheme.validate({ newPassword: resetPasswordInfo.newPassword }, { abortEarly: false });
    return result || { error: null }; // Ensure result is never undefined
  }
  async function sendInfoToResetPass(e) {
    e.preventDefault();
    let valid = ValidData();
    if (valid.error == null) {
      setLoadingForResetForm(true);
      setErrorList([]);
      try {
        let { data } = await axios.post(
          "https://freelance1-production.up.railway.app/auth/resetPassword",
          resetPasswordInfo
        );
        setLoadingForResetForm(false);
        navigate("/login")
      } catch (error) {}
    } else {
      setErrorList(valid.error.details || []);
    }
  }
  
  return (
    <>
      <div className="background">
        <div className="d-flex justify-content-center align-items-center">
          <div className={classOfEmail}>
            <h3 className="mb-3">Please enter your email address.</h3>
            <form onSubmit={sendEmail}>
              <input
                type="text"
                className="form-control ps-3"
                placeholder="Email"
                name="email"
                value={email.email}
                onChange={takeEmailFromUser}
              />
            </form>
            <div className="d-flex justify-content-center mt-3">
              {loading ? (
                <button>
                  <i className="fa solid fa-spinner fa-spin"></i>
                </button>
              ) : (
                <button
                  onClick={sendEmail}
                  className="btn btn-primary mt-3 w-100"
                >
                  Find my account
                </button>
              )}
            </div>
          </div>
          <div className={classOfOtp}>
            <h3 className="mb-3">
              Reset password code sent to you please check your email.
            </h3>
            <form onSubmit={sendInfoToResetPass}>
              <input
                type="text"
                className="form-control ps-3 mb-3"
                placeholder="Reset Password Code"
                name="resetToken"
                onChange={takeResetPass}
              />
               <div className="input-group">
                <input
                  type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                  className="form-control ps-3 mb-4"
                  placeholder="New Password"
                  name="newPassword"
                  onChange={takeResetPass}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary h-50"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fa ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </form>
            {errorList.length > 0
              ? errorList.map((element,i) => (
                  <div key={i} className="my-2 text-danger textSTyleForError">
                    {element.message}
                  </div>
                ))
              : ""}
            <div className="d-flex justify-content-center">
              {loadingForResetForm ? (
                <button>
                  <i className="fa solid fa-spinner fa-spin"></i>
                </button>
              ) : (
                <button onClick={sendInfoToResetPass} className="btn btn-primary w-75">Save</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
