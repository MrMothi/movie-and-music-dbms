import React, { useState } from "react";

function MovieTableForm() {
  const [action, setAction] = useState("CREATE");
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [director, setDirector] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="formContainer">
      <form className="tableForm" onSubmit={handleSubmit}>
        <h3>Movie Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Product ID:</label>
        <input
          type="text"
          onChange={(e) => setProductId(e.target.value)}
          value={productId}
        />

        <label>Title:</label>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <label>Genre:</label>
        <input
          type="text"
          onChange={(e) => setGenre(e.target.value)}
          value={genre}
        />

        <label>Director:</label>
        <input
          type="text"
          onChange={(e) => setDirector(e.target.value)}
          value={director}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default MovieTableForm;
