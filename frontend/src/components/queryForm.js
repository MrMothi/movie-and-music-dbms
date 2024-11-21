import React, { useState } from "react";

const QueryForm = () => {
  const [query, setQuery] = useState("");
  const [queryJson, setQueryJson] = useState(null); // State to store the query results as JSON
  const [error, setError] = useState(null); // State to store any errors

  const handleInputChange = (event) => {
    setQuery(event.target.value); // Update query state as the user types
  };

  const handleSubmit = async (event) => {
    console.log('Query:', query);
    event.preventDefault(); // Prevent form reload
  
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }), // Send the query to the backend
      });

      if (response.ok) {
        const data = await response.json();
        setQueryJson(data); // Store the query result in state
        setError(null); // Clear any previous errors
      } else {
        setError(`Failed to execute query: ${response.statusText}`);
        setQueryJson(null); // Clear previous results on error
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while executing the query.');
      setQueryJson(null); // Clear previous results on error
    }

  };

  return (
    <div>
      {/* Query Input Form */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="queryInput">Enter your query:</label>
        <textarea
          id="queryInput"
          value={query}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          rows="4"
          required
        />
        <button type="submit">Submit</button>
      </form>

      {/* Display Submitted Query */}
      <p>Your query: {query}</p>

      {/* Display Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Query Results */}
      {queryJson && (
        <div>
        <h4>Query Results:</h4>

        {/* Render the table if headers and rows exist */}
        {queryJson.headers && queryJson.rows && (
          <table border="1">
            <thead>
              <tr>
                {queryJson.headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryJson.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {queryJson.headers.map((header, colIndex) => (
                    <td key={colIndex}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Optionally display the raw JSON */}
        <pre>{JSON.stringify(queryJson, null, 2)}</pre>
      </div>
      )}
    </div>
  );
};

export default QueryForm;
