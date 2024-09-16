// import { useEffect, useState } from "react";
// import "./App.css";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Navigate,
// } from "react-router-dom";
// import {jwtDecode} from "jwt-decode"; // Fixed import for jwtDecode
// import Home from "./pages/Home";
// import MasterLayout from "./pages/MasterLayout";
// import NotFound from "./pages/NotFound";
// import Admin1 from "./pages/Admin1";
// import Register from "./pages/Register";
// import LogIn from "./pages/LogIn";
// import ForgetPassword from "./pages/ForgetPassword";
// import Admin2 from './pages/Admin2';
// import ShowItems from './pages/ShowItems';
// import BestSellerItems from './pages/BestSellerItems';

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (localStorage.getItem("token") != null) {
//       SaveUserData();
//     }
//   }, []);

//   function SaveUserData() {
//     const token = localStorage.getItem("token");
//     const data = jwtDecode(token);
//     setUser(data);
//   }

//   function logOut() {
//     localStorage.removeItem("token");
//     setUser(null);
//   }

//   function ProtectRouter({ children, requiredRole }) {
//     if (!user) {
//       return <Navigate to="/login" />;
//     }

//     if (requiredRole && user.role !== requiredRole) {
//       if (user.role === "customer") {
//         return <Navigate to="/home" />;
//       }
//       if (user.role === "admin1") {
//         return <Navigate to="/admin1" />;
//       }
//       if (user.role === "admin2") {
//         return <Navigate to="/admin2" />;
//       }
//       return <Navigate to="/unauthorized" />;
//     }

//     return children;
//   }
  
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <MasterLayout user={user} logOut={logOut} />,
//       errorElement: <NotFound />,
//       children: [
//         {
//           path: "",
//           element: <Home user={user} />, // Public route
//         },
//         {
//           path: "home",
//           element: <Home user={user} />, // Public route
//         },
//         {
//           path: "admin1",
//           element: (
//             <ProtectRouter requiredRole="admin1">
//               <Admin1 logOut={logOut} />
//             </ProtectRouter>
//           ),
//         },
//         {
//           path: "admin2",
//           element: (
//             <ProtectRouter requiredRole="admin2">
//               <Admin2 logOut={logOut} />
//             </ProtectRouter>
//           ),
//         },
//         { path: "register", element: <Register /> },
//         { path: "showItems", element: <ShowItems/>},
//         { path: "best-sellers", element: <BestSellerItems user={user}/>},
//         {
//           path: "login",
//           element: <LogIn saveUser={SaveUserData} userRole={user} />,
//         },
//         { path: "forgetPassword", element: <ForgetPassword /> },
//       ],
//     },
//   ]);

//   return (
//     <RouterProvider router={router} />
//   );
// }

// export default App;
import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Home from "./pages/Home";
import MasterLayout from "./pages/MasterLayout";
import NotFound from "./pages/NotFound";
import Admin1 from "./pages/Admin1";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgetPassword from "./pages/ForgetPassword";
import Admin2 from './pages/Admin2';
import ShowItems from './pages/ShowItems';
import BestSellerItems from './pages/BestSellerItems';
import AllCategory from './pages/AllCategory';
import AllOccasions from './pages/AllOccasions';
import ShowItemsInOccasion from "./pages/ShowItemsInOccasion";
import AllSpecialDeals from './pages/AllSpecialDeals';
import SubCategoryItems from './pages/SubCategoryItems';
import ItemContent from './pages/ItemContent';
import SearchItems from './pages/SearchItems';
import Basket from './pages/Basket';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      SaveUserData();
    }
  }, []);

  function SaveUserData() {
    const token = localStorage.getItem("token");
    const data = jwtDecode(token);
    setUser(data);
  }

  function logOut() {
    localStorage.removeItem("token");
    setUser(null);
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
          path: "",
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
        { path: "show-items", element: <ShowItems user={user}/> },
        { path: "show-items-in-sub-category", element: <SubCategoryItems user={user}/> },
        { path: "show-items-in-occasion", element: <ShowItemsInOccasion user={user}/> },
        { path: "all-category", element: <AllCategory /> },
        { path: "all-occasion", element: <AllOccasions /> },
        { path: "basket", element: <Basket user={user} logOut={logOut}/> },
        { path: "result-search", element: <SearchItems  user={user}/> },
        { path: "all-special-deals", element: <AllSpecialDeals user={user}/> },
        { path: "best-sellers", element: <BestSellerItems user={user} /> },
        { path: "item-content", element: <ItemContent user={user} /> },
        {
          path: "login",
          element: <LogIn saveUser={SaveUserData} userRole={user} />,
        },
        { path: "forgetPassword", element: <ForgetPassword /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

