import React, { useState } from "react";

function VendorTableForm() {
  const [action, setAction] = useState("CREATE");
  const [vendorId, setVendorId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="formContainer">
      <form className="vendorForm" onSubmit={handleSubmit}>
        <h3>External Vendor Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Vendor_ID:</label>
        <input
          type="text"
          onChange={(e) => setVendorId(e.target.value)}
          value={vendorId}
        />

        <label>Vendor_Name:</label>
        <input
          type="text"
          onChange={(e) => setVendorName(e.target.value)}
          value={vendorName}
        />

        <label>Phone_Number:</label>
        <input
          type="text"
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
        />

        <label>Contact_Email:</label>
        <input
          type="email"
          onChange={(e) => setContactEmail(e.target.value)}
          value={contactEmail}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default VendorTableForm;
