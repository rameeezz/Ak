import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function ShowItemsInOccasion() {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure `id` from location.state, or set to undefined if state is null
  const { id } = location.state || {};
  console.log(id);
  
  function addToCart() {
    if (user == null) {
      navigate("/login");
    } else {
      alert("نتمنى لكم حياة افضل ");
    }
  }
  useEffect(() => {
    if (!id) {
      // If no ID is found, navigate to another page
      navigate("/home"); // Redirect to home or another appropriate page
    }
  }, [id, navigate]); // Dependencies array includes `id` and `navigate`

  if (!id) {
    return null; // Optionally render nothing or a fallback UI until redirect
  }
  return (
    <div>ShowItemsInOccasion</div>
  )
}
