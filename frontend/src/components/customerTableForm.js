import React, { useState } from "react";

function CustomerTableForm() {
  const [action, setAction] = useState("CREATE");
  const [custid, setCustid] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");
  // response and error message for feedback once
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);

  // fetch our backend when user submits
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      custid: parseInt(custid, 10),
      firstname,
      lastname,
      email,
      phonenumber,
      address,
    };
    console.log(JSON.stringify(payload));
    const method = action === "CREATE" ? "POST" : "PUT"; // Set method based on action

    try {
      const response = await fetch(`/${action.toLowerCase()}/customer`, {
        method: method, // Use the dynamic method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // set response/error
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

  // user form for creating or updating a record in customer table
  return (
    <div className="formContainer">
      <form className="tableForm" onSubmit={handleSubmit}>
        <h3>Customer Table</h3>

        <label>Action: </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
        </select>

        <label>Customer ID:</label>
        <input
          type="text"
          onChange={(e) => setCustid(e.target.value)}
          value={custid}
        />

        <label>First Name:</label>
        <input
          type="text"
          onChange={(e) => setFirstname(e.target.value)}
          value={firstname}
        />

        <label>Last Name:</label>
        <input
          type="text"
          onChange={(e) => setLastname(e.target.value)}
          value={lastname}
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
          onChange={(e) => setPhonenumber(e.target.value)}
          value={phonenumber}
        />

        <label>Address:</label>
        <input
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />

        <button type="submit">Submit</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default CustomerTableForm;
