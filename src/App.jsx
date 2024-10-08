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
import CartVeiw from './pages/CartVeiw';

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
      errorElement: <NotFound/>,
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

  return <RouterProvider router={router} />;
}

export default App;
