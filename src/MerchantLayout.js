// src/MerchantLayout.js
import React from "react";
import { Link } from "react-router-dom";

function MerchantLayout({ children }) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/merchant-dashboard">SuperMall</Link>
          <div>
            <Link to="/register-shop" className="btn btn-outline-light me-2">Register Shop</Link>
            <Link to="/my-shops" className="btn btn-outline-light me-2">My Shops</Link>
            <Link to="/add-product" className="btn btn-outline-light me-2">Add Product</Link>
            <Link to="/view-products" className="btn btn-outline-light">View Products</Link>
          </div>
        </div>
      </nav>
      <main className="container mt-4">
        {children}
      </main>
    </>
  );
}

export default MerchantLayout;
