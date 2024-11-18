import React, { useState } from "react";

function ProductTableForm() {
  const [action, setAction] = useState("CREATE");
  const [productId, setProductId] = useState("");
  const [productType, setProductType] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [vendorId, setVendorId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="formContainer">
      <form className="productForm" onSubmit={handleSubmit}>
        <h3>Product Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Product_ID:</label>
        <input
          type="text"
          onChange={(e) => setProductId(e.target.value)}
          value={productId}
        />

        <label>Product_Type:</label>
        <input
          type="text"
          onChange={(e) => setProductType(e.target.value)}
          value={productType}
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

        <label>Vendor_ID:</label>
        <input
          type="text"
          onChange={(e) => setVendorId(e.target.value)}
          value={vendorId}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ProductTableForm;
