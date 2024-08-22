import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function ShowItems() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Destructure `id` from location.state, or set to undefined if state is null
  const { id } = location.state || {};
  // console.log(id);
  
  useEffect(() => {
    if (!id) {
      // If no ID is found, navigate to another page
      navigate('/home'); // Redirect to home or another appropriate page
    }
  }, [id, navigate]); // Dependencies array includes `id` and `navigate`

  if (!id) {
    return null; // Optionally render nothing or a fallback UI until redirect
  }
  return (
    <div>ShowItems</div>
  )
}
