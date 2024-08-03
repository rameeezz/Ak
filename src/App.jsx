import { useState } from 'react'
import './App.css'

import {createBrowserRouter , RouterProvider} from 'react-router-dom'
import Home from './pages/Home';
import MasterLayout from './pages/MasterLayout';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
function App() {

let Router = createBrowserRouter([
{path: "/" , element : <MasterLayout/> ,errorElement:<NotFound/> , children : [
  {path: "" , element:<Home/>},
  {path: "home" , element:<Home/>},
  {path: "register" , element:<Register/>},
  {path: "login" , element:<LogIn/>},

]}

])



  return (
    <>
     <RouterProvider router={Router}/>
    </>
  )
}

export default App
