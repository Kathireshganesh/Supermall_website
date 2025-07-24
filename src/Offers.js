// src/Offers.js
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      const q = query(collection(db, "products"), where("isOffer", "==", true));
      const docs = await getDocs(q);
      const list = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOffers(list);
    };
    fetchOffers();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Today's Offers</h3>
      {offers.map((p) => (
        <div key={p.id} className="card mb-2 p-2">
          <h5>{p.productName}</h5>
          <p>Price: ₹{p.price}</p>
          <p>{p.features}</p>
        </div>
      ))}
    </div>
  );
}

export default Offers;
