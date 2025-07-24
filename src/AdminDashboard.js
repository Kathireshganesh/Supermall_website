// src/AdminDashboard.js
import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Welcome to Admin Dashboard</h2>
        <div className="d-grid gap-2 col-6 mx-auto mt-4">
          <button className="btn btn-outline-primary" onClick={() => navigate("/all-users")}>
            👥 Manage Users
          </button>
          <button className="btn btn-outline-success" onClick={() => navigate("/all-shops")}>
            🏬 View All Shops
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
