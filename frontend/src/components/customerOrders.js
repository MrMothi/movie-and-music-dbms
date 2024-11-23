import React, { useState, useEffect } from "react";

const CustomerOrders = () => {
  const [headers, setHeaders] = useState([]); // Store column headers
  const [purchases, setPurchases] = useState([]); // Store rows of data
  const [error, setError] = useState(null);
  const customerId = 1; // Hardcoded customer ID

  //Send info to the backend on mount and catch any errors
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch(`/get/purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHeaders(data.headers); // Set column headers from backend
        setPurchases(data.rows); // Set rows of data
      } catch (err) {
        setError(err.message || "Error fetching purchases");
      }
    };

    fetchPurchases();
  }, []); // Runs once when the component mounts

  //retrieve values and then display and style
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {purchases.length > 0 && headers.length > 0 ? (
        <div>
          <h2>Purchases for Customer ID {customerId}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {purchases.map((row, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                }}
              >
                {headers.map((header, colIndex) => (
                  <p key={colIndex} style={{ margin: "8px 0", wordWrap: "break-word" }}>
                    <strong>{header}:</strong> {row[colIndex]}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No purchases found for Customer ID {customerId}.</p>
      )}
    </div>
  );
};

export default CustomerOrders;
