import React, { useState } from "react";
import CustomerTableForm from "../components/customerTableForm";
import ProductTableForm from "../components/productTableForm";
import VendorTableForm from "../components/vendorTableForm";
import PurchaseTableForm from "../components/purchaseTableForm";
import ReviewTableForm from "../components/ReviewTableForm";
import MusicTableForm from "../components/musicTableForm";
import MovieTableForm from "../components/movieTableForm";
import QueryForm from "../components/queryForm";
import { Link } from "react-router-dom";

function AdminHomePage() {
  const [productid, setProductid] = useState("");
  const [producttype, setProducttype] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [vendorid, setVendorid] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      productid: parseInt(productid, 10),
      producttype,
      rating,
      price,
      vendorid,
    };

    // send request to backend to create or update record
    try {
      const response = await fetch(`/create/product`, {
        method: "CREATE", // Use the dynamic method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // set response and error message
      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message);
        setError(null);
      } else {
        setError(`Failed`);
        setResponseMessage("");
      }
    } catch (error) {
      console.log("Error: ", error);
      setError("An error occurred");
      setResponseMessage("");
    }
  };

  // form
  return (
    <div>
      <h1>Welcome Admin</h1>
      <Link to="/admin">Create/Update records or advanced queries</Link>
      <div className="formContainer">
        <form className="tableForm" onSubmit={handleSubmit}>
          <h3>Product Table</h3>

          <label>Product ID:</label>
          <input
            type="text"
            onChange={(e) => setProductid(e.target.value)}
            value={productid}
          />

          <label>Product Type:</label>
          <input
            type="text"
            onChange={(e) => setProducttype(e.target.value)}
            value={producttype}
          />

          <label>Rating:</label>
          <input
            type="text"
            onChange={(e) => setRating(e.target.value)}
            value={rating}
          />

          <label>Price:</label>
          <input
            type="text"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />

          <label>Vendor ID:</label>
          <input
            type="text"
            onChange={(e) => setVendorid(e.target.value)}
            value={vendorid}
          />

          <button type="submit">Submit</button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default AdminHomePage;
