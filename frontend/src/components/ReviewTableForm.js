import React, { useState } from "react";

function ReviewTableForm() {
  const [action, setAction] = useState("CREATE");
  const [review_id, setReview_id] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [customer_id, setCustomer_id] = useState("");
  const [creation_date, setCreation_date] = useState("");
  const [user_review, setUser_review] = useState("");
  const [user_rating, setUser_rating] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      review_id: parseInt(review_id, 10),
      product_id: parseInt(product_id, 10),
      customer_id: parseInt(customer_id, 10),
      creation_date,
      user_review,
      user_rating: parseFloat(user_rating),
    };
    console.log(JSON.stringify(payload));
    const method = action === "CREATE" ? "POST" : "PUT"; // Set method based on action

    try {
      const response = await fetch(`/${action.toLowerCase()}/review`, {
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
        <h3>Review Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Review ID:</label>
        <input
          type="text"
          onChange={(e) => setReview_id(e.target.value)}
          value={review_id}
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

        <label>Creation Date:</label>
        <input
          type="date"
          onChange={(e) => setCreation_date(e.target.value)}
          value={creation_date}
        />

        <label>User Review:</label>
        <textarea
          onChange={(e) => setUser_review(e.target.value)}
          value={user_review}
        />

        <label>User Rating:</label>
        <input
          type="number"
          step="0.1"
          onChange={(e) => setUser_rating(e.target.value)}
          value={user_rating}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ReviewTableForm;
