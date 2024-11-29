import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./searchPage.css";

function SearchPage() {
  // State variables for form inputs and data handling
  const [productid, setProductid] = useState("");
  const [producttype, setProducttype] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [vendorid, setVendorid] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [queryJson, setQueryJson] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ headers: [], rows: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    PRODUCT_ID: '',
    PRODUCT_TYPE: '',
    RATING: '',
    PRICE: '',
    VENDOR_ID: ''
  });

  // Fetch data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const query = "SELECT * FROM PRODUCT"; // Your specific query

      console.log('Query:', query);

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
          setData(data); // Store the query result in state
          setFilteredData(data.rows); // Initialize filtered data
          setError(null); // Clear any previous errors
        } else {
          setError(`Failed to execute query: ${response.statusText}`);
          setData({ headers: [], rows: [] }); // Clear previous results on error
          setFilteredData([]);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while executing the query.');
        setData({ headers: [], rows: [] }); // Clear previous results on error
        setFilteredData([]);
      }
    };

    fetchData();
  }, []);

  // Handle input changes for filters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Handle form submission for filtering data
  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = data.rows.filter(row => {
      return Object.keys(filters).every(key => {
        if (!filters[key]) return true;
        if (key === 'RATING' || key === 'PRICE') {
          return row[key] === parseFloat(filters[key]);
        }
        // Exact match for PRODUCT_ID
        if (key === 'PRODUCT_ID') {
          return row[key].toString() === filters[key];
        }
        return row[key].toString().toLowerCase().includes(filters[key].toLowerCase());
      });
    });
    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <h1>Welcome Admin</h1>
      <Link to="/admin" className="link">Create/Update records or advanced queries</Link>

      <div>
        <form onSubmit={handleSubmit}>
          {data.headers.map(header => (
            <div key={header}>
              <label>{header}</label>
              <input
                type="text"
                name={header}
                value={filters[header]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <button type="submit">Filter</button>
        </form>
        <div>
          <h2>Filtered Data</h2>
          {error && <p className="error">{error}</p>}
          {data.headers.length > 0 && data.rows.length > 0 && (
            <table border="1">
              <thead>
                <tr>
                  {data.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {data.headers.map((header, colIndex) => (
                      <td key={colIndex}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;