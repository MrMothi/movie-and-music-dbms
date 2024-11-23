import React, { useState } from "react";

function ProductTableForm() {
  const [action, setAction] = useState("CREATE");
  const [productid, setProductid] = useState("");
  const [producttype, setProducttype] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [vendorid, setVendorid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      productid: parseInt(productid, 10),
      producttype,
      rating,
      price,
      vendorid,
    };
    console.log(JSON.stringify(payload));
    const method = action === "CREATE" ? "POST" : "PUT"; // Set method based on action

    try {
      const response = await fetch(`/${action.toLowerCase()}/product`, {
        method: method, // Use the dynamic method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message);
        setError(null);
      } else {
        setError(`Failed to ${action}`);
        setResponseMessage("");
      }
    } catch (error) {
      console.log("Error: ", error);
      setError("An error occurred");
      setResponseMessage("");
    }
  };

  return (
    <div className="formContainer">
      <form className="tableForm" onSubmit={handleSubmit}>
        <h3>Product Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

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
    </div>
  );
}

export default ProductTableForm;
