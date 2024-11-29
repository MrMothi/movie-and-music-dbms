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
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/admin" element={<AdminHome />}></Route>
          <Route path="/user" element={<UserHome />}></Route>
          <Route path="/search" element={<SearchPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
