// src/BulkProductUpload.js
import React, { useEffect, useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import Papa from "papaparse";
import Navbar from "./Navbar";

function BulkProductUpload() {
  const [validShopIds, setValidShopIds] = useState([]);

  useEffect(() => {
    const fetchMerchantShops = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "shops"), where("merchantId", "==", user.uid));
      const snap = await getDocs(q);
      const ids = snap.docs.map((doc) => doc.id);
      setValidShopIds(ids);
    };

    fetchMerchantShops();
  }, []);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        const user = auth.currentUser;

        let successCount = 0;
        let skipped = 0;

        for (let item of data) {
          const shopId = item.shopId?.trim();
          if (!validShopIds.includes(shopId)) {
            console.warn(`⛔ Skipping product: invalid shopId "${shopId}"`);
            skipped++;
            continue;
          }

          try {
            await addDoc(collection(db, "products"), {
              productName: item.productName,
              price: parseFloat(item.price),
              features: item.features,
              isOffer: item.isOffer === "true",
              shopId: shopId,
              merchantId: user.uid,
              createdAt: new Date(),
            });
            successCount++;
          } catch (err) {
            console.error("❌ Upload failed:", err);
          }
        }

        alert(`✅ ${successCount} products added.\n⚠️ ${skipped} skipped due to invalid shopId.`);
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>📦 Bulk Upload Products (CSV)</h3>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="form-control mt-3"
        />
        <p className="mt-3 text-muted">
          CSV columns: <code>productName, price, features, isOffer, shopId</code>
        </p>
        {validShopIds.length > 0 && (
          <div className="mt-3">
            <strong>✅ Your Shop IDs:</strong>
            <ul>
              {validShopIds.map((id) => (
                <li key={id}><code>{id}</code></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default BulkProductUpload;
