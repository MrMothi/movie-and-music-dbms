import React, { useState } from "react";

function PurchaseTableForm() {
  const [action, setAction] = useState("CREATE");
  const [purchase_id, setPurchase_id] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [customer_id, setCustomer_id] = useState("");
  const [purchase_date, setPurchase_date] = useState("");
  const [price, setPrice] = useState("");
  // error and response message for form feedback
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      purchase_id: parseInt(purchase_id, 10),
      product_id: parseInt(product_id, 10),
      customer_id: parseInt(customer_id, 10),
      purchase_date,
      price,
    };
    console.log(JSON.stringify(payload));
    const method = action === "CREATE" ? "POST" : "PUT"; // Set method based on action

    // fetch backend to create/update record
    try {
      const response = await fetch(`/${action.toLowerCase()}/purchase`, {
        method: method, // Use the dynamic method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // set reponse and error
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

  // form
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
          onChange={(e) => setPurchase_id(e.target.value)}
          value={purchase_id}
        />

        <label>Product ID:</label>
        <input
          type="text"
          onChange={(e) => setProduct_id(e.target.value)}
          value={product_id}
        />

        <label>Customer ID:</label>
        <input
          type="text"
          onChange={(e) => setCustomer_id(e.target.value)}
          value={customer_id}
        />

        <label>Purchase Date:</label>
        <input
          type="text"
          onChange={(e) => setPurchase_date(e.target.value)}
          value={purchase_date}
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
      {responseMessage && <p>{responseMessage}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default PurchaseTableForm;
