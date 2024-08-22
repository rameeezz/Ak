import { useEffect, useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Fixed import for jwtDecode
import Home from "./pages/Home";
import MasterLayout from "./pages/MasterLayout";
import NotFound from "./pages/NotFound";
import Admin1 from "./pages/Admin1";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgetPassword from "./pages/ForgetPassword";
import Admin2 from './pages/Admin2';
import ShowItems from './pages/ShowItems';

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
        { path: "showItems", element: <ShowItems/>},
        {
          path: "login",
          element: <LogIn saveUser={SaveUserData} userRole={user} />,
        },
        { path: "forgetPassword", element: <ForgetPassword /> },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
