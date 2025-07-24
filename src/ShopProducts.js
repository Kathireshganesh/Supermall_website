import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Navbar from "./Navbar";

function ShopProducts() {
  const { shopId } = useParams();
  const [shopName, setShopName] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const shopDoc = await getDoc(doc(db, "shops", shopId));
      setShopName(shopDoc.exists() ? shopDoc.data().shopName : "Unknown Shop");

      const q = query(collection(db, "products"), where("shopId", "==", shopId));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    })();
  }, [shopId]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>🛒 Products in {shopName}</h3>
        {products.length === 0 ? (
          <p>No products found in this shop.</p>
        ) : (
          <div className="row">
            {products.map(product => (
              <div className="col-md-4 mb-3" key={product.id}>
                <div className="card h-100 shadow-sm">
                  {product.imageURL && (
                    <img
                      src={product.imageURL}
                      alt={product.productName}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h6 className="card-title">{product.productName}</h6>
                    <p><strong>₹{product.price}</strong></p>
                    <p className="text-muted">{product.features}</p>
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

export default ShopProducts;
