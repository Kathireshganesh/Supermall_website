// src/FilterShops.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function FilterShops() {
  const [shops, setShops] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFloor, setFilterFloor] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      const docs = await getDocs(collection(db, "shops"));
      const list = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setShops(list);
    };
    fetchShops();
  }, []);

  const filtered = shops.filter(
    (s) =>
      (!filterCategory || s.category === filterCategory) &&
      (!filterFloor || s.floor === filterFloor)
  );

  return (
    <div className="container mt-4">
      <h3>Explore Shops</h3>
      <div className="row mb-3">
        <div className="col">
          <select className="form-control" onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option>Fashion</option>
            <option>Electronics</option>
            <option>Grocery</option>
            <option>Furniture</option>
          </select>
        </div>
        <div className="col">
          <select className="form-control" onChange={(e) => setFilterFloor(e.target.value)}>
            <option value="">All Floors</option>
            <option>Ground</option>
            <option>First</option>
            <option>Second</option>
            <option>Third</option>
          </select>
        </div>
      </div>

      {filtered.map((s) => (
        <div key={s.id} className="card p-3 mb-2">
          <h5>{s.shopName}</h5>
          <p>{s.description}</p>
          <small>{s.category} | {s.floor}</small>
        </div>
      ))}
    </div>
  );
}

export default FilterShops;
