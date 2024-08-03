import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../css/Register.css"; // Ensure the correct path to your CSS file

export default function Register() {
  const [phone, setPhone] = useState("");

  const handleOnChange = (value) => {
    setPhone(value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log("yarab akrmna");
  }

  return (
    <div className="backgroundBg">
      <div className="login-form p-4">
        <h2 className="mb-2">Register</h2>
        <form>
          <div className="d-flex justify-content-center gap-2">
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
          </div>
          <input type="email" placeholder="Email" required />
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

          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="button" onClick={handleSubmit}>
            Create
          </button>
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
