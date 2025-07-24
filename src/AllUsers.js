// src/AllShops.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function AllShops() {
  const [shops, setShops] = useState([]);
  const [merchantMap, setMerchantMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      const snap = await getDocs(collection(db, "shops"));
      const shopList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShops(shopList);

      // fetch all merchant names
      const merchantIds = [...new Set(shopList.map(s => s.merchantId))];
      const map = {};
      for (const id of merchantIds) {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          map[id] = userDoc.data().email;
        }
      }
      setMerchantMap(map);
    };

    fetchShops();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          🔙 Back
        </button>
        <h3>🏬 All Registered Shops</h3>

        {shops.length === 0 ? (
          <div className="alert alert-info mt-3">No shops found.</div>
        ) : (
          <div className="row mt-3">
            {shops.map(shop => (
              <div key={shop.id} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">🏪 {shop.shopName}</h5>
                    <p className="card-text">{shop.address}</p>
                    <p className="card-text">
                      <strong>Merchant:</strong>{" "}
                      {merchantMap[shop.merchantId] || "Unknown"}
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

export default AllShops;
