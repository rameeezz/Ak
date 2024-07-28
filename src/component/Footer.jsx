import React from "react";
import "../css/Footer.css";
import Visa from "../assets/png payment/visa.png";
export function Footer() {
  return (
    <>
      {/* <footer className="bg-[#ecd9e8]">
        <div className="container   px-10 py-4 mx-auto flex flex-col items-center md:flex-row md:justify-between">
          <div className="w-1/5 text-center md:text-left pt-1">
            <h3 className="text-[#323232] font-medium leading-none text-lg">
              Navigation
            </h3>
            <p className="text-[#323232] moveOfPInFooter my-2">Categories</p>
          </div>
          <div className="w-1/5 text-center md:text-left pt-1">
            <h3 className="text-[#323232] font-medium leading-none text-lg">
              Navigation
            </h3>
            <p className="text-[#323232] moveOfPInFooter my-2">Categories</p>
          </div>
          <div className="w-1/5 text-center md:text-left pt-1">
            <h3 className="text-[#323232] font-medium leading-none text-lg">
              Navigation
            </h3>
            <p className="text-[#323232] moveOfPInFooter my-2">Categories</p>
          </div>
          <div className=" w-1/5 text-center md:text-left pb-1 ">
            <h3 className="text-[#323232] font-medium text-lg  mb-1">
              Follow Us
            </h3>
              <div className="flex ">
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
                  <i className="fa-brands fa-instagram text-xl mx-4 bgForInstaIcon"></i>
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
        <div className="bg-[#323232] py-2 mt-6">
          <p className="text-center text-white">
            &copy; 2024 MyWebsite. All rights reserved.
          </p>
        </div>
      </footer> */}
      <footer className="bg-[#ecd9e8]">
        <div className="container-sm text-center">
          <div className="row py-4 ">
            <div className="col-md-4 col-sm-2">
              <h3 className="responsive-font-size ">Navigation</h3>
              <p className="moveOfPInFooter">Categories</p>
            </div>
            <div className="col-md-4 col-sm-2">
              <h3>Navigation</h3>
              <p className="moveOfPInFooter">Categories</p>
            </div>
            <div className="col-md-4 col-sm-2">
            <div className=" ">
            <h3 className="text-[#323232] font-medium text-lg  mb-1">
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
                  <i className="fa-brands fa-instagram text-xl mx-4 bgForInstaIcon"></i>
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
        </div>
        <div className="bg-[#323232] py-2 mt-6">
          <p className="text-center text-white">
            &copy; 2024 MyWebsite. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
