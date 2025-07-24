// src/UploadShopsFromCSV.js
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import Papa from "papaparse";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function UploadShopsFromCSV() {
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!csvFile) return alert("Please select a CSV file");

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const uid = auth.currentUser?.uid;
        const data = results.data;

        let successCount = 0;

        for (const row of data) {
          if (row.shopName && row.shopAddress && row.shopCategory) {
            await addDoc(collection(db, "shops"), {
              shopName: row.shopName,
              shopAddress: row.shopAddress,
              shopCategory: row.shopCategory,
              merchantId: uid,
              createdAt: new Date()
            });
            successCount++;
          }
        }

        alert(`✅ ${successCount} shops uploaded successfully`);
        navigate("/merchant-dashboard");
      },
      error: (err) => {
        alert("CSV parsing error: " + err.message);
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>📤 Bulk Upload Shops (CSV)</h3>
        <p className="text-muted">Format: shopName, shopAddress, shopCategory</p>

        <input type="file" className="form-control mb-3" accept=".csv" onChange={handleFileChange} />

        <button className="btn btn-success" onClick={handleUpload}>
          Upload Shops
        </button>

        <button className="btn btn-secondary ms-3" onClick={() => navigate(-1)}>
          🔙 Back
        </button>
      </div>
    </>
  );
}

export default UploadShopsFromCSV;
