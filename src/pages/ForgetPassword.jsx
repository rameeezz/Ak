import React, { useState } from "react";
import axios from "axios";

export default function ForgetPassword() {
  const [email, setEmail] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  function takeEmailFromUser(e) {
    let myEmail = { ...email };
    myEmail[e.target.name] = e.target.value;
    setEmail(myEmail);
  }
  async function sendEmail(e) {
    e.preventDefault();
    if (email === "") {
      alert("Try again");
    } else {
      setLoading(true);
      try {
        let { data } = await axios.post(
          "https://freelance1-production.up.railway.app/auth/sendResetPasswordOTP",
          email
        );
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setLoading(false);
          alert("Not Found");
        }
      }
    }
  }
  return (
    <>
      <div className="background">
        <div className="d-flex justify-content-center align-items-center">
          <div className="shadow bg-white p-5 rounded">
            <h3 className="mb-3">Please enter your email address.</h3>
            <form>
              <input
                type="text"
                className="form-control ps-3"
                placeholder="Email"
                name="email"
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
        </div>
      </div>
    </>
  );
}
