import React, { useEffect, useState } from "react";
import "../css/Admin1.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin1({ logOut }) {
  let navigate = useNavigate();
  function GoTOLOgin() {
    navigate("/login");
    logOut();
  }

  // work of Add ADmin
  let [AdminInfo, setAdminInfo] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  // console.log(AdminInfo);
  let [ErrorMessage, setErrorMessage] = useState();
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
    setLoading(true);
    try {
      let { data } = await axios.post(
        "http://freelance1-production.up.railway.app/admin1/addAdmin",
        AdminInfo
      );
      setLoading(false);
      setErrorMessage("");
      console.log(data.message);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoading(false);
        setErrorMessage("server is down");
      }
    }
  }
  return (
    <>
      <div className="">
        <div className=" position-fixed end-2 rounded-circle bg-danger top-5">
          <button className=" p-2  text-white" onClick={GoTOLOgin}>
            {" "}
            log out{" "}
          </button>
        </div>
        <div className="container colorForBg py-5">
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
                  onChange={GetAdminInfo}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={GetAdminInfo}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  onChange={GetAdminInfo}
                />
              </div>
              {ErrorMessage == "" ? (
                ""
              ) : (
                <div className="my-3 text-danger">{ErrorMessage}</div>
              )}
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
        </div>
      </div>
    </>
  );
}
