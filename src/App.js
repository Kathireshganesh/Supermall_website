// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import Signup from "./Signup";
import Login from "./Login";

// Dashboards
import AdminDashboard from "./AdminDashboard";
import MerchantDashboard from "./MerchantDashboard";
import UserDashboard from "./UserDashboard";
import ShopDashboard from "./ShopDashboard";

// Add inside <Routes>:

// Merchant features
import RegisterShop from "./RegisterShop";
import MyShops from "./MyShops";
import AddProductWithImage from "./AddProductWithImage";
import ViewProducts from "./ViewProducts";
import UploadShopsFromCSV from "./UploadShopsFromCSV";
import BulkProductUpload from "./BulkProductUpload";

// User/Admin features
import AllShops from "./AllShops";
import Wishlist from "./WishList";
import AllUsers from "./AllUsers";
import ProductsByShop from "./ProductsByShop";
import BrowseShops from "./BrowseShops";

// Route protection
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboards */}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/merchant-dashboard" element={<ProtectedRoute><MerchantDashboard /></ProtectedRoute>} />
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

        {/* Merchant Routes */}
        <Route path="/register-shop" element={<ProtectedRoute><RegisterShop /></ProtectedRoute>} />
        <Route path="/my-shops" element={<ProtectedRoute><MyShops /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddProductWithImage /></ProtectedRoute>} />
        <Route path="/view-products" element={<ProtectedRoute><ViewProducts /></ProtectedRoute>} />
        <Route path="/bulk-upload-shops" element={<ProtectedRoute><UploadShopsFromCSV /></ProtectedRoute>} />
        <Route path="/bulk-upload-products" element={<ProtectedRoute><BulkProductUpload /></ProtectedRoute>} />
        <Route path="/shop/:shopId/dashboard" element={<ProtectedRoute><ShopDashboard /></ProtectedRoute>} />

        {/* User/Admin Routes */}
        <Route path="/all-shops" element={<ProtectedRoute><AllShops /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/browse-shops" element={<ProtectedRoute><BrowseShops /></ProtectedRoute>} />
        <Route path="/shop/:shopId/products" element={<ProtectedRoute><ProductsByShop /></ProtectedRoute>} />

        {/* Admin Only */}
        <Route path="/all-users" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
