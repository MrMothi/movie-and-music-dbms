import React, { useState } from "react";
import CustomerTableForm from "../components/customerTableForm";
import ProductTableForm from "../components/productTableForm";
import VendorTableForm from "../components/vendorTableForm";

function AdminHomePage() {
  const [selectedTable, setSelectedTable] = useState("");

  return (
    <div>
      <h1>Welcome Admin</h1>
      <div className="formsContainer">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">Select</option>
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="PRODUCT">PRODUCT</option>
          <option value="VENDOR">VENDOR</option>

          <option value="REVIEW">REVIEW</option>
          <option value="PURCHASE">PURCHASE</option>
          <option value="MUSIC">MUSIC</option>
          <option value="MOVIE">MOVIE</option>
        </select>

        {selectedTable === "CUSTOMER" && <CustomerTableForm />}
        {selectedTable === "PRODUCT" && <ProductTableForm />}
        {selectedTable === "VENDOR" && <VendorTableForm />}
      </div>
    </div>
  );
}

export default AdminHomePage;
