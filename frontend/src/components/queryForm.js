import React, { useState } from "react";

const QueryForm = () => {
  const [query, setQuery] = useState("");
  const [queryJson, setQueryJson] = useState(null); // State to store the query as JSON

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a JSON object with the query
    const queryObject = { query: query.trim() }; // Trim spaces to clean up the query

    // Save the JSON object in state
    setQueryJson(queryObject);

    // Log the JSON object
    console.log("Query submitted as JSON:", JSON.stringify(queryObject));

    // Add additional logic to handle the JSON object, e.g., sending it to a backend
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="queryInput">Enter your query:</label>
        <textarea
          className="queryInput"
          id="queryInput"
          value={query}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          rows="4"
        />
        <button type="submit">Submit</button>
      </form>
      <p>Your query: {query}</p>
      {queryJson && (
        <div>
          <h4>Query JSON:</h4>
          <code>{JSON.stringify(queryJson)}</code>
        </div>
      )}
    </div>
  );
};

export default QueryForm;
