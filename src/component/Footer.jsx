import React from "react";
import "../css/Footer.css";
import Visa from "../assets/png payment/visa.png";
import { Link } from "react-router-dom";
export function Footer({ user }) {
  return (
    <>
      {user?.role == "admin1" || user?.role == "admin2" ? (
        ""
      ) : (
        <footer className="bg-[#b38e38]">
          <div className="container-fluid">
            <div className="d-flex justify-content-evenly py-4 ">
              <div className="text-center">
                <h3 className="text-white font-medium text-lg  mb-1 responsive-font-size-p">
                  Get to know us
                </h3>
                <p className="moveOfPInFooter text-white">About us</p>
                <p className="moveOfPInFooter text-white">Contact us</p>
                <p className="moveOfPInFooter text-white">Privacy policy</p>
              </div>

              <div className="text-center">
                <h3 className="text-white font-medium text-lg  mb-1 responsive-font-size-p">
                  Navigation
                </h3>
                <p className="moveOfPInFooter text-white">Categories</p>
                <p className="moveOfPInFooter text-white">Occasions</p>
              </div>

              <div className="text-center">
                <h3 className="text-white font-medium text-lg  mb-1 responsive-font-size-p ">
                  Follow Us
                </h3>
                <div className="d-flex justify-content-center">
                  <a
                    className="moveForIcons"
                    href="https://www.facebook.com/ByAseelKamal"
                    target="_blank"
                  >
                    <i className="fa-brands fa-facebook-f text-xl text-blue-900"></i>
                  </a>
                  <a
                    className="moveForIcons"
                    href="https://www.instagram.com/ak_byaseelkamal?igshid=YmMyMTA2M2Y%3D&fbclid=IwY2xjawER8KxleHRuA2FlbQIxMAABHamKXnEIEwbf3nVKRaTcPFzOGqPnhmc9Tem5Q4TUlQm4-Vqi6Hh0DWD5og_aem_KXlJIj7Z09I5LtkE7onq8Q"
                    target="_blank"
                  >
                    <i className="fa-brands fa-instagram text-xl mx-3 bgForInstaIcon"></i>
                  </a>
                  <a
                    href="https://www.tiktok.com/@akflorist2020?_t=8oNJ3QDHDAj&_r=1"
                    target="_blank"
                    className="moveForIcons"
                  >
                    <i className="fa-brands fa-tiktok text-black text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#323232] py-2 mt-2">
            <p className="text-center text-white">
              &copy; 2024 MyWebsite. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
