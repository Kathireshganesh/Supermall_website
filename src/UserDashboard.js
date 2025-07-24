// src/UserDashboard.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [shopNames, setShopNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndShops = async () => {
      const productSnap = await getDocs(collection(db, "products"));
      const productList = productSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);

      const names = {};
      for (const product of productList) {
        const shopId = product.shopId;
        if (shopId && !names[shopId]) {
          const shopDoc = await getDoc(doc(db, "shops", shopId));
          if (shopDoc.exists()) {
            names[shopId] = shopDoc.data().shopName;
          }
        }
      }
      setShopNames(names);
    };

    fetchProductsAndShops();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>🏪 Welcome to SuperMall</h2>
        <div className="d-flex justify-content-center gap-3 my-4">
          <button className="btn btn-outline-primary" onClick={() => navigate("/view-products")}>
            🛍️ View All Products
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/all-shops")}>
            🏬 View All Shops
          </button>
        </div>

        <h4 className="mb-3">Featured Products</h4>
        <div className="row">
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map((prod) => (
              <div key={prod.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  {prod.imageURL && (
                    <img
                      src={prod.imageURL}
                      className="card-img-top"
                      alt={prod.productName}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{prod.productName}</h5>
                    <p className="card-text">₹{prod.price}</p>
                    <p className="card-text text-muted">{prod.features}</p>
                    <p className="card-text fw-bold">
                      🏪 {shopNames[prod.shopId] || "Unknown Shop"}
                    </p>
                    {prod.isOffer && (
                      <span className="badge bg-success">🔥 On Offer</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
