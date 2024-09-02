import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
export default function AllOccasions() {
  let navigate = useNavigate();
  function goHome() {
    navigate("/home");
  }
  useEffect(()=>{
    getAllOccasion()
  },[])
  const [allOccasion, setAllOccasion] = useState([]);
  const [loadingForOccasion, setLoadingForOcassion] = useState(false);
  const [errorMessageForOccasion, setErrorMessageForOccasion] = useState("");
  async function getAllOccasion() {
    setLoadingForOcassion(true);
    try {
      let { data } = await axios.get(
        "https://freelance1-production.up.railway.app/customer/getOccasions"
      );
      setAllOccasion(data);
      setLoadingForOcassion(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessageForOccasion("no items");
        setLoadingForOcassion(false);
        setAllOccasion([]);
      }
    }
  }
  function goToOccasionItems(idOfCategory) {
    navigate("/show-items-in-occasion", { state: { id: idOfCategory } });
  }
  return (
    <>

      <div className="container-xxl ">
        <div className="d-flex flex-column align-items-start justify-content-center mt-5 mb-4">
          <h2 className="responsive-font-size-h2-Home fw-bold">
            Flowers Occasions
          </h2>
          <p>Celebrate every moment with us!</p>
          <div className="d-flex justify-content-center gap-1 mt-1 align-items-center">
            <i className="fa-solid fa-house-chimney text-muted"></i>
            <p className="cursorPOinter" onClick={goHome}>
              Home
            </p>
            <i className="fa-solid fa-angle-right text-muted"></i>
            <p>Occasions</p>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <div className="d-flex flex-row justify-content-center gap-3 w-100 cursorPOinter flex-wrap">
          {allOccasion.length === 0 ? (
            loadingForOccasion ? (
              <div className="w-100 justify-content-center d-flex">
                <i className="fa fa-spinner fa-spin responsive-font-size-h1"></i>
              </div>
            ) : (
              <div>{errorMessageForOccasion}</div> // Ensure that this is a string or valid JSX
            )
          ) : (
            allOccasion.map((element, i) => (
              <div
                onClick={() => {
                  goToOccasionItems(element._id);
                }}
                key={i}
                className="rounded w-80 position-relative forAllCategoryItems"
                // style={{ minWidth: "250px" }}
              >
                <img
                  src={`https://freelance1-production.up.railway.app/${element?.image}`}
                  alt=""
                  className="w-100 h-100 rounded"
                />
                <div className="position-absolute top-0 h-100 w-100 bg-black opacity-25 z-1 rounded"></div>
                <div className="d-flex justify-content-center align-items-center position-absolute w-100 h-100 z-3 top-0 styleForCategories z-2">
                  <h2 className="text-white text-center">{element?.name}</h2>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
