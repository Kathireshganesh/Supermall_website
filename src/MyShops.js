// src/MyShops.js
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { CSVLink } from "react-csv";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function MyShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = auth.currentUser.uid;
    const q = query(collection(db, "shops"), where("merchantId", "==", uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShops(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (shopId) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;
    try {
      await deleteDoc(doc(db, "shops", shopId));
      alert("Shop deleted successfully.");
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleEdit = async (shop) => {
    const newName = prompt("Enter new shop name:", shop.shopName);
    if (!newName) return;

    try {
      await updateDoc(doc(db, "shops", shop.id), { shopName: newName });
      alert("Shop name updated.");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3 className="mb-4">My Registered Shops</h3>
        {loading ? (
          <p>Loading...</p>
        ) : shops.length === 0 ? (
          <p>No shops registered yet.</p>
        ) : (
          <>
            <CSVLink data={shops} filename="my-shops.csv" className="btn btn-outline-dark mb-3">
              Export CSV
            </CSVLink>
            <div className="row">
              {shops.map((shop) => (
                <div className="col-md-4 mb-4" key={shop.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{shop.shopName}</h5>
                      <p className="card-text">{shop.description}</p>
                      <ul className="list-unstyled text-muted">
                        <li><strong>Category:</strong> {shop.category}</li>
                        <li><strong>Floor:</strong> {shop.floor}</li>
                        <li><strong>Location:</strong> {shop.location}</li>
                      </ul>
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(shop)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(shop.id)}
                        >
                          🗑️ Delete
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => navigate(`/shop/${shop.id}/dashboard`)}
                        >
                          🧭 Go to Shop Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MyShops;
