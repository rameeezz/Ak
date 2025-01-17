import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from "@react-oauth/google";
import Home from "./pages/Home";
import MasterLayout from "./pages/MasterLayout";
import NotFound from "./pages/NotFound";
import Admin1 from "./pages/Admin1";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgetPassword from "./pages/ForgetPassword";
import Admin2 from "./pages/Admin2";
import ShowItems from "./pages/ShowItems";
import BestSellerItems from "./pages/BestSellerItems";
import AllCategory from "./pages/AllCategory";
import AllOccasions from "./pages/AllOccasions";
import ShowItemsInOccasion from "./pages/ShowItemsInOccasion";
import AllSpecialDeals from "./pages/AllSpecialDeals";
import SubCategoryItems from "./pages/SubCategoryItems";
import ItemContent from "./pages/ItemContent";
import SearchItems from "./pages/SearchItems";
import Basket from "./pages/Basket";
import CartVeiw from "./pages/CartVeiw";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      SaveUserData();
    }
  }, []);

  function SaveUserData() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = jwtDecode(token);
        setUser(data);
        // console.log("Decoded JWT data:", data);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.error("No token found in localStorage.");
    }
  }

  function logOut() {
    localStorage.removeItem("token");
    setUser(null);
    googleLogout();
  }

  function ProtectRouter({ children, requiredRole }) {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === "customer") {
        return <Navigate to="/home" />;
      }
      if (user.role === "admin1") {
        return <Navigate to="/admin1" />;
      }
      if (user.role === "admin2") {
        return <Navigate to="/admin2" />;
      }
      return <Navigate to="/unauthorized" />;
    }

    return children;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MasterLayout user={user} logOut={logOut} />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home user={user} />, // Public route
        },
        {
          path: "home",
          element: <Home user={user} />, // Public route
        },
        {
          path: "admin1",
          element: (
            <ProtectRouter requiredRole="admin1">
              <Admin1 logOut={logOut} />
            </ProtectRouter>
          ),
        },
        {
          path: "admin2",
          element: (
            <ProtectRouter requiredRole="admin2">
              <Admin2 logOut={logOut} />
            </ProtectRouter>
          ),
        },
        { path: "register", element: <Register /> },
        { path: "show-items", element: <ShowItems user={user} /> },
        {
          path: "show-items-in-sub-category",
          element: <SubCategoryItems user={user} />,
        },
        {
          path: "show-items-in-occasion",
          element: <ShowItemsInOccasion user={user} />,
        },
        { path: "all-category", element: <AllCategory user={user} /> },
        { path: "all-occasion", element: <AllOccasions user={user} /> },
        { path: "basket", element: <Basket user={user} logOut={logOut} /> },
        { path: "result-search", element: <SearchItems user={user} /> },
        { path: "all-special-deals", element: <AllSpecialDeals user={user} /> },
        { path: "best-sellers", element: <BestSellerItems user={user} /> },
        { path: "item-content", element: <ItemContent user={user} /> },
        { path: "cart", element: <CartVeiw user={user} /> },
        {
          path: "login",
          element: <LogIn saveUser={SaveUserData} userRole={user} />,
        },
        { path: "forgetPassword", element: <ForgetPassword /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    // htt3dl tany lma nege n48lo 
    <>
  <style>
    {`
      body {
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        // background-color: #b38e38;
        font-family: Arial, sans-serif;
      }
      .wreath-container {
        position: relative;
        width: 400px;
        height: 400px;
      }
      .circle-of-flowers {
        position: relative;
        width: 100%;
        height: 100%;
        animation: rotateFlowers 10s linear infinite;
      }
      .flower {
        position: absolute;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .petal {
        position: absolute;
        width: 25px;
        height: 40px;
        background-color: #b38e38;
        border-radius: 50%;
        // transform-origin: bottom center;
      }
      .petal:nth-child(1) {
        transform: rotate(0deg) translateY(-15px);
      }
      .petal:nth-child(2) {
        transform: rotate(45deg) translateY(-15px);
      }
      .petal:nth-child(3) {
        transform: rotate(90deg) translateY(-15px);
      }
      .petal:nth-child(4) {
        transform: rotate(135deg) translateY(-15px);
      }
      .petal:nth-child(5) {
        transform: rotate(180deg) translateY(-15px);
      }
      .petal:nth-child(6) {
        transform: rotate(225deg) translateY(-15px);
      }
      .petal:nth-child(7) {
        transform: rotate(270deg) translateY(-15px);
      }
      .petal:nth-child(8) {
        transform: rotate(315deg) translateY(-15px);
      }
      .center {
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 50%;
        z-index: 1;
      }
      .text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color:dark;
        font-size: 16px;
        font-weight: bold;
        width: 150px;
        line-height: 1.4;
        z-index: 2;
        margin-top: 10px; /* Added margin between flowers and text */
      }
      @keyframes rotateFlowers {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}
  </style>
  <div className="wreath-container">
    <div className="circle-of-flowers">
      {Array.from({ length: 10 }).map((_, index) => {
        const angle = (index * 360) / 10; // Divide the circle into 10 equal parts
        const radius = 170; // Increased radius for more spacing
        const x = 200 + radius * Math.cos((angle * Math.PI) / 180); // X-coordinate
        const y = 200 + radius * Math.sin((angle * Math.PI) / 180); // Y-coordinate
        return (
          <div
            key={index}
            className="flower"
            style={{
              top: `${y}px`,
              left: `${x}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Petals */}
            {Array.from({ length: 8 }).map((_, petalIndex) => (
              <div key={petalIndex} className="petal"></div>
            ))}
            {/* Flower Center */}
            <div className="center"></div>
          </div>
        );
      })}
    </div>
    <div className="text">We Are Working On Something</div>
  </div>
</>


    // <RouterProvider router={router} />
  );
}

export default App;
