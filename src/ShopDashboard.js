// src/ShopDashboard.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import Navbar from "./Navbar";
import Papa from "papaparse";
import { addDoc } from "firebase/firestore";

function ShopDashboard() {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [shopName, setShopName] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const productQuery = query(collection(db, "products"), where("shopId", "==", shopId));
      const productSnap = await getDocs(productQuery);
      const productList = productSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    const fetchShopName = async () => {
      const shopSnap = await getDocs(query(collection(db, "shops"), where("__name__", "==", shopId)));
      if (!shopSnap.empty) {
        setShopName(shopSnap.docs[0].data().shopName);
      }
    };

    fetchProducts();
    fetchShopName();
  }, [shopId]);

  const handleCSVChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCSVUpload = () => {
    if (!csvFile) return alert("Please select a CSV file first.");

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        let success = 0;

        for (let item of data) {
          if (item.productName && item.price) {
            await addDoc(collection(db, "products"), {
              productName: item.productName,
              price: parseFloat(item.price),
              features: item.features || "",
              isOffer: item.isOffer === "true",
              shopId: shopId,
              createdAt: new Date(),
            });
            success++;
          }
        }

        alert(`✅ ${success} products uploaded successfully`);
        window.location.reload();
      },
      error: (err) => alert("CSV parsing error: " + err.message),
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          🔙 Back
        </button>
        <h3>🏪 Shop Dashboard: {shopName || shopId}</h3>

        <div className="mt-4 mb-4">
          <h5>📤 Bulk Upload Products</h5>
          <p className="text-muted">CSV Format: productName, price, features, isOffer</p>
          <input type="file" accept=".csv" onChange={handleCSVChange} className="form-control mb-2" />
          <button className="btn btn-primary" onClick={handleCSVUpload}>
            Upload CSV
          </button>
        </div>

        <h5 className="mt-5">📦 Products in this Shop</h5>
        {products.length === 0 ? (
          <div className="alert alert-info mt-3">No products found for this shop.</div>
        ) : (
          <div className="row">
            {products.map((prod) => (
              <div className="col-md-4 mb-4" key={prod.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{prod.productName}</h5>
                    <p className="card-text">₹{prod.price}</p>
                    <p className="text-muted">{prod.features}</p>
                    {prod.isOffer && <span className="badge bg-success">🔥 On Offer</span>}
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

export default ShopDashboard;
