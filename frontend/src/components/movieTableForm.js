import React, { useState } from "react";

function MovieTableForm() {
  const [action, setAction] = useState("CREATE");
  const [product_id, setProduct_id] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [director, setDirector] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      product_id: parseInt(product_id, 10),
      title,
      genre,
      director,
    };
    console.log(JSON.stringify(payload));
    const method = action === "CREATE" ? "POST" : "PUT"; // Set method based on action

    try {
      const response = await fetch(`/${action.toLowerCase()}/movie`, {
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
        <h3>Movie Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Product ID:</label>
        <input
          type="text"
          onChange={(e) => setProduct_id(e.target.value)}
          value={product_id}
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
