import React, { useState } from "react";

function MusicTableForm() {
  const [action, setAction] = useState("CREATE");
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [features, setFeatures] = useState("");
  const [album, setAlbum] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="formContainer">
      <form className="tableForm" onSubmit={handleSubmit}>
        <h3>Music Table</h3>

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

        <label>Artist:</label>
        <input
          type="text"
          onChange={(e) => setArtist(e.target.value)}
          value={artist}
        />

        <label>Features:</label>
        <input
          type="text"
          onChange={(e) => setFeatures(e.target.value)}
          value={features}
        />

        <label>Album:</label>
        <input
          type="text"
          onChange={(e) => setAlbum(e.target.value)}
          value={album}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default MusicTableForm;
