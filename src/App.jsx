import { useEffect, useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Use default import for jwtDecode
import Home from "./pages/Home";
import MasterLayout from "./pages/MasterLayout";
import NotFound from "./pages/NotFound";
import Admin1 from "./pages/Admin1";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgetPassword from "./pages/ForgetPassword";

function App() {
  const [user, setUser] = useState(null);
  console.log(user);
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
    // return <Navigate to="/login" />
  }

  // function ProtectRouter({ children, requiredRole }) {
  //   if (!user) {
  //     return <Navigate to="/login" />;
  //   }

  //   if (requiredRole && user.role !== requiredRole) {
  //     // Redirect to a different page if the role doesn't match
  //     if (user.role === "customer") {
  //       return <Navigate to="/home" />;
  //     }
  //     if (user.role === "admin1") {
  //       return <Navigate to="/admin1" />;
  //     }
  //     // Add more role checks as needed
  //     return <Navigate to="/unauthorized" />;
  //   }

  //   return children;
  // }
  // Function to handle the "Add to Cart" action

  const Router = createBrowserRouter([
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
            <Admin1  logOut= {logOut}/>
            //  <ProtectRouter requiredRole="admin1">
            //  </ProtectRouter>
          ),
        },
        { path: "register", element: <Register /> },
        {
          path: "login",
          element: <LogIn saveUser={SaveUserData} userRole={user} />,
        },
        { path: "forgetPassword", element: <ForgetPassword /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
