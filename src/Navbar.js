// src/Navbar.js
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      }
    };
    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const showBackButton = location.pathname !== "/merchant-dashboard" &&
                         location.pathname !== "/admin-dashboard" &&
                         location.pathname !== "/user-dashboard";

  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">
      <div className="d-flex align-items-center">
        <span className="navbar-brand mb-0 h1">SuperMall</span>
        {showBackButton && (
          <button
            className="btn btn-sm btn-outline-light ms-3"
            onClick={() => {
              if (role === "admin") navigate("/admin-dashboard");
              else if (role === "merchant") navigate("/merchant-dashboard");
              else navigate("/user-dashboard");
            }}
          >
            ⬅ Back to Dashboard
          </button>
        )}
      </div>

      <div className="d-flex align-items-center">
        {role === "merchant" && (
          <>
            <button className="btn btn-sm btn-outline-light me-2" onClick={() => navigate("/register-shop")}>
              Register Shop
            </button>
            <button className="btn btn-sm btn-outline-light me-2" onClick={() => navigate("/my-shops")}>
              My Shops
            </button>
            <button className="btn btn-sm btn-outline-light me-2" onClick={() => navigate("/add-product")}>
              Add Product
            </button>
            <button className="btn btn-sm btn-outline-light me-3" onClick={() => navigate("/view-products")}>
              View Products
            </button>
          </>
        )}

        {role === "user" && (
          <>
            <button className="btn btn-sm btn-outline-light me-2" onClick={() => navigate("/all-shops")}>
              Browse Shops
            </button>
            <button className="btn btn-sm btn-outline-light me-3" onClick={() => navigate("/wishlist")}>
              My Wishlist
            </button>
          </>
        )}

        {role === "admin" && (
          <>
            <button className="btn btn-sm btn-outline-light me-3" onClick={() => navigate("/all-users")}>
              Manage Users
            </button>
          </>
        )}

        <button className="btn btn-sm btn-danger" onClick={handleLogout}>
          🔓 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
