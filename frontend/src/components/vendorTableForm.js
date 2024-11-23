import React, { useState } from "react";

function VendorTableForm() {
  const [action, setAction] = useState("CREATE");
  const [vendorid, setVendorid] = useState("");
  const [vendorname, setVendorname] = useState("");
  const [vendornumber, setVendornumber] = useState("");
  const [contactemail, setContactemail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      vendorid: parseInt(vendorid, 10),
      vendorname,
      vendornumber,
      contactemail,
    };
    console.log(JSON.stringify(payload));
    const method = action === "CREATE" ? "POST" : "PUT"; // Set method based on action

    try {
      const response = await fetch(`/${action.toLowerCase()}/external-vendor`, {
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
        <h3>External Vendor Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Vendor ID:</label>
        <input
          type="text"
          onChange={(e) => setVendorid(e.target.value)}
          value={vendorid}
        />

        <label>Vendor Name:</label>
        <input
          type="text"
          onChange={(e) => setVendorname(e.target.value)}
          value={vendorname}
        />

        <label>Vendor Number:</label>
        <input
          type="text"
          onChange={(e) => setVendornumber(e.target.value)}
          value={vendornumber}
        />

        <label>Contact Email:</label>
        <input
          type="email"
          onChange={(e) => setContactemail(e.target.value)}
          value={contactemail}
        />

        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default VendorTableForm;
