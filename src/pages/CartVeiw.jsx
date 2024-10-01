import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CartVeiw({ user }) {
  const customerID =
    user?.role == "customer" ? user?.userId || null : user?.id || null;
  const [userCart, setuserCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  async function getOrders() {
    try {
      let { data } = await axios.get(
        `https://akflorist-production.up.railway.app/customer/getOrder/${customerID}`
      );
      console.log(data.getThisCart);
    } catch (error) {}
  }
  useEffect(() => {
    if (customerID) {
      getOrders();
    }
  }, [customerID]);
  return (
    <>
      <div></div>
    </>
  );
}
