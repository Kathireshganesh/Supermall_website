// src/MerchantDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Navbar from "./Navbar";

function MerchantDashboard() {
  const navigate = useNavigate();
  const [shopCount, setShopCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [latestShop, setLatestShop] = useState(null);

  const fetchStats = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const shopQuery = query(collection(db, "shops"), where("merchantId", "==", uid));
    const shopSnap = await getDocs(shopQuery);
    const shops = shopSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setShopCount(shops.length);

    const sorted = shops.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    setLatestShop(sorted[0]);

    const productQuery = query(collection(db, "products"), where("merchantId", "==", uid));
    const productSnap = await getDocs(productQuery);
    setProductCount(productSnap.size);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">👨‍💼 Merchant Dashboard</h2>
          <p className="text-muted">Welcome back! Here’s an overview of your business.</p>
        </div>

        {/* Stats Grid */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100 text-center">
              <div className="card-body">
                <h5 className="text-primary">Total Shops</h5>
                <h1 className="display-5 fw-bold">{shopCount}</h1>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100 text-center">
              <div className="card-body">
                <h5 className="text-success">Total Products</h5>
                <h1 className="display-5 fw-bold">{productCount}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Shop */}
        {latestShop && (
          <div className="alert alert-info text-center">
            🆕 Last Registered Shop: <strong>{latestShop.shopName}</strong> ({latestShop.shopCategory})
          </div>
        )}

        {/* Action Grid */}
        <h4 className="mb-3">Quick Actions</h4>
        <div className="row g-3">
          {[
            { label: "➕ Register Shop", path: "/register-shop", color: "primary" },
            { label: "📋 View My Shops", path: "/my-shops", color: "secondary" },
            { label: "➕ Add Product", path: "/add-product", color: "success" },
            { label: "🧾 Bulk Upload Shops", path: "/bulk-upload-shops", color: "dark" },
            { label: "📦 Bulk Upload Products", path: "/bulk-upload-products", color: "info" },
            { label: "🛍️ View Products", path: "/view-products", color: "warning" },
          ].map((action, index) => (
            <div key={index} className="col-md-4">
              <div
                className={`card border-0 shadow h-100 bg-${action.color} text-white`}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(action.path)}
              >
                <div className="card-body text-center d-flex align-items-center justify-content-center">
                  <h5 className="mb-0">{action.label}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-5 text-muted small">
          💡 Tip: Use CSV upload for quick bulk entries. <br />
          🔄 <span onClick={fetchStats} style={{ cursor: "pointer", textDecoration: "underline" }}>Refresh stats</span> anytime.
        </div>
      </div>
    </>
  );
}

export default MerchantDashboard;
