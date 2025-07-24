// src/AddProductWithImage.js
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "./firebase";
import Navbar from "./Navbar";
import Papa from "papaparse";

function AddProductWithImage() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");
  const [isOffer, setIsOffer] = useState(false);
  const [shopId, setShopId] = useState("");
  const [shopOptions, setShopOptions] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      const uid = auth.currentUser?.uid;
      const q = query(collection(db, "shops"), where("merchantId", "==", uid));
      const snap = await getDocs(q);
      const shops = snap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().shopName
      }));
      setShopOptions(shops);
    };

    fetchShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;

    try {
      await addDoc(collection(db, "products"), {
        productName,
        price: parseFloat(price),
        features,
        isOffer,
        shopId,
        merchantId: uid,
        createdAt: new Date()
      });
      alert("✅ Product added!");
      setProductName("");
      setPrice("");
      setFeatures("");
      setIsOffer(false);
      setShopId("");
    } catch (err) {
      alert("❌ Error: " + err.message);
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

        for (const item of data) {
          if (item.productName && item.price && item.shopId) {
            await addDoc(collection(db, "products"), {
              productName: item.productName,
              price: parseFloat(item.price),
              features: item.features || "",
              isOffer: item.isOffer === "true",
              shopId: item.shopId,
              merchantId: uid,
              createdAt: new Date()
            });
            successCount++;
          }
        }

        alert(`✅ ${successCount} products uploaded.`);
        setCsvFile(null);
      },
      error: (err) => {
        alert("❌ CSV Error: " + err.message);
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>➕ Add Product to Shop</h3>
        <form onSubmit={handleSubmit} className="mt-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <textarea
            className="form-control mb-2"
            placeholder="Features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isOffer}
              onChange={(e) => setIsOffer(e.target.checked)}
            />
            <label className="form-check-label">🔥 Is on Offer?</label>
          </div>

          <select
            className="form-select mb-3"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            required
          >
            <option value="">Select Shop</option>
            {shopOptions.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn-success">Add Product</button>
        </form>

        <hr className="my-4" />

        <h5>📥 Bulk Upload Products (CSV)</h5>
        <p className="text-muted mb-2">Format: productName, price, features, isOffer, shopId</p>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          className="form-control mb-2"
        />
        <button onClick={handleCSVUpload} className="btn btn-outline-primary">
          Upload Products CSV
        </button>
      </div>
    </>
  );
}

export default AddProductWithImage;
