// src/RegisterShop.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import Navbar from "./Navbar";
import Papa from "papaparse";

function RegisterShop() {
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [floor, setFloor] = useState("");
  const [location, setLocation] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uid = auth.currentUser.uid;
      await addDoc(collection(db, "shops"), {
        shopName,
        description,
        category,
        floor,
        location,
        merchantId: uid,
        createdAt: new Date()
      });
      alert("✅ Shop registered successfully.");
      setShopName("");
      setDescription("");
      setCategory("");
      setFloor("");
      setLocation("");
    } catch (err) {
      alert("❌ Error adding shop: " + err.message);
    }
  };

  const handleCSVUpload = () => {
    if (!csvFile) return alert("Please select a CSV file.");

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const uid = auth.currentUser?.uid;
        const data = results.data;
        let successCount = 0;

        for (const row of data) {
          if (row.shopName && row.description && row.category && row.floor && row.location) {
            await addDoc(collection(db, "shops"), {
              shopName: row.shopName,
              description: row.description,
              category: row.category,
              floor: row.floor,
              location: row.location,
              merchantId: uid,
              createdAt: new Date(),
            });
            successCount++;
          }
        }

        alert(`✅ ${successCount} shops uploaded successfully.`);
        setCsvFile(null);
      },
      error: (err) => {
        alert("❌ CSV parsing error: " + err.message);
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>🏬 Register a New Shop</h3>
        <form onSubmit={handleSubmit} className="mt-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success">➕ Register Shop</button>
        </form>

        <hr className="my-4" />

        <h5>📦 Bulk Upload Shops (CSV)</h5>
        <p className="text-muted mb-2">Format: shopName, description, category, floor, location</p>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          className="form-control mb-2"
        />
        <button onClick={handleCSVUpload} className="btn btn-outline-primary">
          Upload CSV
        </button>
      </div>
    </>
  );
}

export default RegisterShop;
