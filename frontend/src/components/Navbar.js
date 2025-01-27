import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Music And Movie Store</h1>
      <div className="links">
        <Link to="/">Logout/Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
