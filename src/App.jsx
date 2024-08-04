import { useEffect, useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  redirect,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Home from "./pages/Home";
import MasterLayout from "./pages/MasterLayout";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import ForgetPassword from "./pages/ForgetPassword";
function App() {
  let [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      SaveUserData();
    }
  }, []);
  function SaveUserData() {
    let token = localStorage.getItem("token");
    let data = jwtDecode(token);
    console.log(data);
    setUser(data);
  }
  function logOut() {
    console.log("ssss");

    localStorage.removeItem("token");
    setUser(null);
    return redirect("/login");
  }
  function protectRouter(props) {
    if (localStorage.getItem("token") == null) {
      return <Navigate to="/login" />;
    } else {
      return props.children;
    }
  }

  let Router = createBrowserRouter([
    {
      path: "/",
      element: <MasterLayout user={user} logOut={logOut} />,
      errorElement: <NotFound />,
      children: [
        {
          path: "",
          element: (
            <protectRouter>
              {" "}
              <Home />{" "}
            </protectRouter>
          ),
        },
        {
          path: "home",
          element: (
            <protectRouter>
              {" "}
              <Home />{" "}
            </protectRouter>
          ),
        },
        { path: "register", element: <Register /> },
        { path: "login", element: <LogIn saveUser={SaveUserData} /> },
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
