// src/WishList.js
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [shopNames, setShopNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const uid = auth.currentUser.uid;

      // Get wishlist entries for user
      const wishSnap = await getDocs(
        query(collection(db, "wishlist"), where("userId", "==", uid))
      );

      const productIds = wishSnap.docs.map(doc => doc.data().productId);

      if (productIds.length === 0) {
        setWishlistProducts([]);
        return;
      }

      // Fetch product details
      const allProductsSnap = await getDocs(collection(db, "products"));
      const allProducts = allProductsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const filtered = allProducts.filter(p => productIds.includes(p.id));
      setWishlistProducts(filtered);

      // Get related shop names
      const shopMap = {};
      for (const prod of filtered) {
        const shopDoc = await getDoc(doc(db, "shops", prod.shopId));
        if (shopDoc.exists()) {
          shopMap[prod.shopId] = shopDoc.data().shopName;
        }
      }
      setShopNames(shopMap);
    };

    fetchWishlist();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          🔙 Back
        </button>
        <h3>❤️ My Wishlist</h3>
        {wishlistProducts.length === 0 ? (
          <p className="text-muted mt-3">No items in wishlist.</p>
        ) : (
          <div className="row mt-3">
            {wishlistProducts.map(prod => (
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
                    <p className="card-text">{prod.features}</p>
                    <p className="text-muted fw-bold">
                      🏪 {shopNames[prod.shopId] || "Unknown Shop"}
                    </p>
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

export default Wishlist;
