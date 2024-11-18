import React, { useState } from "react";

function CustomerTableForm() {
  const [action, setAction] = useState("CREATE");
  const [custId, setCustId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="formContainer">
      <form className="customerForm" onSubmit={handleSubmit}>
        <h3>Customer Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Customer ID:</label>
        <input
          type="text"
          onChange={(e) => setCustId(e.target.value)}
          value={custId}
        />

        <label>First Name:</label>
        <input
          type="text"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />

        <label>Last Name:</label>
        <input
          type="text"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />

        <label>Email:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <label>Phone Number:</label>
        <input
          type="text"
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
        />

        <label>Address:</label>
        <input
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CustomerTableForm;
