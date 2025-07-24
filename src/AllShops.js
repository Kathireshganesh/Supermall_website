// src/AllShops.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function AllShops() {
  const [shops, setShops] = useState([]);
  const [merchantNames, setMerchantNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      const snap = await getDocs(collection(db, "shops"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShops(list);

      const names = {};
      for (const shop of list) {
        const uid = shop.merchantId;
        if (!names[uid]) {
          const merchantDoc = await getDoc(doc(db, "users", uid));
          if (merchantDoc.exists()) {
            names[uid] = merchantDoc.data().email;
          }
        }
      }
      setMerchantNames(names);
    };

    fetchShops();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          🔙 Back to Dashboard
        </button>
        <h3 className="mb-4">🏬 All Registered Shops</h3>
        {shops.length === 0 ? (
          <div className="alert alert-info">No shops found.</div>
        ) : (
          <div className="row">
            {shops.map((shop) => (
              <div key={shop.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  {shop.shopImageURL && (
                    <img
                      src={shop.shopImageURL}
                      className="card-img-top"
                      alt={shop.shopName}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{shop.shopName}</h5>
                    <p className="card-text">📍 {shop.shopAddress}</p>
                    <p className="card-text">
                      📧 Merchant: {merchantNames[shop.merchantId] || "Unknown"}
                    </p>
                    {shop.shopCategory && (
                      <span className="badge bg-primary mb-2">
                        {shop.shopCategory}
                      </span>
                    )}
                    <button
                      className="btn btn-outline-primary mt-2"
                      onClick={() => navigate(`/shop/${shop.id}/products`)}
                    >
                      🛍️ View Products
                    </button>
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
