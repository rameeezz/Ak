import React, { useEffect, useState } from "react";
import "../css/Admin1.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import joi from "joi";

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
  console.log(AdminInfo);
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
        </div>
      </div>
    </>
  );
}

// import React, { useState } from "react";
// import "../css/Admin1.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import joi from "joi";

// export default function Admin1({ logOut }) {
//   const navigate = useNavigate();

//   function GoTOLogin() {
//     navigate("/login");
//     logOut();
//   }

//   // State for admin information
//   const [AdminInfo, setAdminInfo] = useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [ErrorMessage, setErrorMessage] = useState("");
//   const [errorList, setErrorList] = useState([]);
//   const [Loading, setLoading] = useState(false);

//   // Handle input changes
//   function GetAdminInfo(e) {
//     const { name, value } = e.target;
//     setAdminInfo((prevInfo) => ({
//       ...prevInfo,
//       [name]: name === "username" ? value.toLowerCase() : value,
//     }));
//   }

//   // Handle form submission
//   async function HandleSubmitForAdmin(e) {
//     e.preventDefault();
//     const valid = ValidData();
//     if (valid.error == null) {
//       setLoading(true);
//       setErrorList([]);
//       try {
//         const { data } = await axios.post(
//           "https://freelance1-production.up.railway.app/admin1/addAdmin",
//           AdminInfo
//         );
//         setLoading(false);
//         setErrorMessage("");
//         console.log(data.message);
//         // Reset input fields after successful submission
//         setAdminInfo({
//           username: "",
//           password: "",
//           confirmPassword: "",
//         });
//       } catch (error) {
//         setLoading(false);
//         if (error.response && error.response.status === 400) {
//           setErrorMessage("There is already a user with the same username.");
//         } else {
//           setErrorMessage("An error occurred. Please try again later.");
//           console.error("Error during form submission:", error);
//         }
//       }
//     } else {
//       setErrorList(valid.error.details);
//       console.log(valid.error.details);
//     }
//   }

//   // Validate form data using Joi
//   function ValidData() {
//     const schema = joi.object({
//       username: joi.string().required().min(3).max(15).messages({
//         "string.base": "Username must be a string.",
//         "string.empty": "Username is required.",
//         "string.min": "Username must be at least 3 characters long.",
//         "string.max": "Username cannot exceed 15 characters.",
//         "string.alphanum": "Username must contain only letters and numbers.",
//       }),
//       password: joi.string().required().messages({
//         "string.base": "Password must be a string.",
//         "string.empty": "Password is required.",
//         "string.pattern.base":
//           "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
//       }),
//       confirmPassword: joi
//         .string()
//         .required()
//         .valid(joi.ref("password"))
//         .messages({
//           "any.only": "Confirm Password must match the Password.",
//           "string.empty": "Confirm Password is required.",
//         }),
//     });

//     return schema.validate(AdminInfo, { abortEarly: false });
//   }

//   return (
//     <>
//       <div className="">
//         <div className="position-fixed end-2 rounded-circle bg-danger top-5">
//           <button className="p-2 text-white" onClick={GoTOLogin}>
//             Log out
//           </button>
//         </div>
//         <div className="container colorForBg py-5">
//           <h2 className="responsive-font-size-h3 colorForTitles text-center">
//             Add Admin
//           </h2>
//           <div className="d-flex justify-content-center align-items-center my-5">
//             <form onSubmit={HandleSubmitForAdmin} className="w-50">
//               <div className="mb-3">
//                 <label className="form-label">Username</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="username"
//                   value={AdminInfo.username}
//                   onChange={GetAdminInfo}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="password"
//                   value={AdminInfo.password}
//                   onChange={GetAdminInfo}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Confirm Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="confirmPassword"
//                   value={AdminInfo.confirmPassword}
//                   onChange={GetAdminInfo}
//                 />
//               </div>
//               {ErrorMessage && (
//                 <div className="my-3 text-danger">{ErrorMessage}</div>
//               )}
//               {errorList.length > 0 &&
//                 errorList.map((element, index) => (
//                   <div key={index} className="my-2 text-danger textSTyleForError">
//                     {element.message}
//                   </div>
//                 ))}

//               {Loading ? (
//                 <button className="btn btn-primary px-4" disabled>
//                   <i className="fa solid fa-spinner fa-spin"></i>
//                 </button>
//               ) : (
//                 <button type="submit" className="btn btn-primary">
//                   Submit
//                 </button>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
