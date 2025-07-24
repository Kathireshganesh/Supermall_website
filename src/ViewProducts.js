import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import Navbar from "./Navbar";

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState({});
  const [isMerchant, setIsMerchant] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      const uid = user?.uid;

      if (!uid) return;

      const userDoc = await getDoc(doc(db, "users", uid));
      const role = userDoc?.data()?.role || "user";
      setIsMerchant(role === "merchant");
      setIsUser(role === "user");

      // Real-time listener for shops
      onSnapshot(collection(db, "shops"), (shopSnap) => {
        const shopMap = {};
        const shopIds = [];

        shopSnap.docs.forEach((doc) => {
          const data = doc.data();
          shopMap[doc.id] = data.shopName;

          if (role === "merchant" && data.merchantId === uid) {
            shopIds.push(doc.id);
          }
        });

        setShops(shopMap);

        // Real-time listener for products
        const prodRef = collection(db, "products");

        onSnapshot(prodRef, (prodSnap) => {
          const allProducts = prodSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const filtered = role === "merchant"
            ? allProducts.filter(
                (prod) =>
                  shopIds.includes(prod.shopId) && prod.merchantId === uid
              )
            : allProducts;

          setProducts(filtered);
        });
      });
    };

    fetchData();
  }, []);

  const handleAddToWishlist = async (productId) => {
    try {
      const uid = auth.currentUser.uid;
      await addDoc(collection(db, "wishlist"), {
        userId: uid,
        productId: productId,
      });
      alert("❤️ Added to Wishlist");
    } catch (err) {
      alert("Error adding to wishlist");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>
          {isMerchant ? "🛒 My Shop Products" : "🛍️ All Products"}{" "}
          <span className="badge bg-secondary">{products.length}</span>
        </h3>

        {products.length === 0 ? (
          <div className="alert alert-warning mt-3">No products found.</div>
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
                    <p className="card-text fw-bold">
                      🏪 {shops[prod.shopId] || "Unknown Shop"}
                    </p>
                    {prod.isOffer && (
                      <span className="badge bg-success">🔥 On Offer</span>
                    )}
                    {isUser && (
                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => handleAddToWishlist(prod.id)}
                      >
                        ❤️ Add to Wishlist
                      </button>
                    )}
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

export default ViewProducts;
