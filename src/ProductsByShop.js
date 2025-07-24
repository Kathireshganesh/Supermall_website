// src/ProductsByShop.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import Navbar from "./Navbar";

function ProductsByShop() {
  const { shopId } = useParams();
  const [shopName, setShopName] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      // Get shop name
      const shopRef = doc(db, "shops", shopId);
      const shopSnap = await getDoc(shopRef);
      if (shopSnap.exists()) {
        setShopName(shopSnap.data().shopName || "Shop");
      }

      // Fetch products with that shopId
      const q = query(collection(db, "products"), where("shopId", "==", shopId));
      const snap = await getDocs(q);
      const prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
    };

    fetchProducts();
  }, [shopId]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          🔙 Back
        </button>
        <h3>🛍️ Products in {shopName}</h3>

        {products.length === 0 ? (
          <div className="alert alert-info mt-3">No products available in this shop.</div>
        ) : (
          <div className="row mt-3">
            {products.map((prod) => (
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

export default ProductsByShop;
