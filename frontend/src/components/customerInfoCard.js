import React, { useState, useEffect } from "react";

const CustomerInfoCard = () => {
  const [headers, setHeaders] = useState([]); // Store column headers
  const [customerInfo, setCustomerInfo] = useState([]); // Store customer data
  const [error, setError] = useState(null);
  const customerId = 1; // Hardcoded customer ID

  //Send in the info to the backend when the program launches
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await fetch(`/get/customer`, {
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
        setHeaders(data.headers); // Set column headers
        setCustomerInfo(data.rows); // Set customer info (single row)
      } catch (err) {
        setError(err.message || "Error fetching customer information");
      }
    };

    fetchCustomerInfo();
  }, []); // Runs once when the component mounts

  //Retrieving the values and then styling and displaying it
  return (
    <div>
      <h1>Customer Information</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {customerInfo.length > 0 && headers.length > 0 ? (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            maxWidth: "400px",
            margin: "auto",
          }}
        >
          <h2>Customer ID: {customerId}</h2>
          {headers.map((header, index) => (
            <p key={index} style={{ margin: "8px 0", wordWrap: "break-word" }}>
              <strong>{header}:</strong> {customerInfo[index]}
            </p>
          ))}
        </div>
      ) : (
        <p>No customer information found for Customer ID {customerId}.</p>
      )}
    </div>
  );
};

export default CustomerInfoCard;
