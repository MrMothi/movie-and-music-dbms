import React, { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminHome from "./pages/AdminHomePage";
import UserHome from "./pages/UserHomePage";
import Navbar from "./components/Navbar";

function App() {
  //testing backend frontend connection with temp function to grab product table
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/get/product");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result); //if valid response then set the use state
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        console.log("successfully fetched the backend text");
      }
    };

    fetchData();
  }, []);

  /*
      <div>
      <p>{data.message}abc</p>
    </div>
  */

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/admin" element={<AdminHome />}></Route>
          <Route path="/user" element={<UserHome />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
