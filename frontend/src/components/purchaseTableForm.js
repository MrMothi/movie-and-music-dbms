import React, { useState } from "react";

function PurchaseTableForm() {
  const [action, setAction] = useState("CREATE");
  const [purchaseId, setPurchaseId] = useState("");
  const [productId, setProductId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="formContainer">
      <form className="tableForm" onSubmit={handleSubmit}>
        <h3>Purchase Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Purchase ID:</label>
        <input
          type="text"
          onChange={(e) => setPurchaseId(e.target.value)}
          value={purchaseId}
        />

        <label>Product ID:</label>
        <input
          type="text"
          onChange={(e) => setProductId(e.target.value)}
          value={productId}
        />

        <label>Customer ID:</label>
        <input
          type="text"
          onChange={(e) => setCustomerId(e.target.value)}
          value={customerId}
        />

        <label>Purchase Date:</label>
        <input
          type="date"
          onChange={(e) => setPurchaseDate(e.target.value)}
          value={purchaseDate}
        />

        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PurchaseTableForm;
