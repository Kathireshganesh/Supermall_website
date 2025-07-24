// src/BrowseShops.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Navbar from "./Navbar"; // ✅ Include if you want top navigation

function BrowseShops() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const snap = await getDocs(collection(db, "shops"));
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setShops(list);
      } catch (err) {
        alert("Error fetching shops: " + err.message);
      }
    };

    fetchShops();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>🛍️ Available Shops</h3>
        {shops.length === 0 ? (
          <p>No shops available yet.</p>
        ) : (
          <div className="row">
            {shops.map((shop) => (
              <div className="col-md-4" key={shop.id}>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{shop.shopName}</h5>
                    <p className="card-text">
                      <strong>📍 Address:</strong> {shop.address}<br />
                      <strong>📞 Contact:</strong> {shop.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default BrowseShops;
