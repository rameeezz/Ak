import React from 'react'
import NavBar from './../component/NavBar';
import "../css/ErrorPage.css"
export default function NotFound() {
  return (
    <>
    <NavBar/>
    <div className="error-page-container">
      <h1 className="error-heading">Oops! Something went wrong.</h1>
      <p className="error-message">
        The page you're looking for doesn't exist or an error occurred.
      </p>
      <Link to="/" className="home-button">
        Go to Home
      </Link>
    </div>
    </>
  )
}
