import React, { useState } from "react";

function ReviewTableForm() {
  const [action, setAction] = useState("CREATE");
  const [reviewId, setReviewId] = useState("");
  const [productId, setProductId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
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
          onChange={(e) => setReviewId(e.target.value)}
          value={reviewId}
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

        <label>Creation Date:</label>
        <input
          type="date"
          onChange={(e) => setCreationDate(e.target.value)}
          value={creationDate}
        />

        <label>User Review:</label>
        <textarea
          onChange={(e) => setUserReview(e.target.value)}
          value={userReview}
        />

        <label>User Rating:</label>
        <input
          type="number"
          step="0.1"
          onChange={(e) => setUserRating(e.target.value)}
          value={userRating}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ReviewTableForm;
