# 🛒 SuperMall Website

SuperMall is a multi-vendor e-commerce platform where users can browse shops, view products, and merchants can manage their shops and inventory.

---

## 🚀 Features

### 🧑‍💼 User Features
- Register/Login as a User or Merchant
- Browse available shops and products
- Add products to your wishlist
- View special offers

### 🛍️ Merchant Features
- Register/Login as a Merchant
- Create and manage your shop(s)
- Add/Edit/Delete products
- Bulk upload products via CSV
- View dashboard with product/shop stats

### 🛠️ Admin Features
- View all users
- View all merchants and shops
- Monitor total product count

---

## 📁 Folder Structure

```
supermall-app/
├── supermall-client/      # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   ├── firebase.js
│   │   └── App.js
│   └── public/
├── README.md
```

---

## 🧪 Tech Stack

- **Frontend:** React JS, Bootstrap
- **Backend/Database:** Firebase Firestore, Firebase Authentication
- **CSV Parsing:** PapaParse

---

## 📦 Bulk Product Upload (CSV)

You can upload products in bulk using a `.csv` file with the following column headers:

```
productName, price, features, isOffer, shopId
```

---

## 🛠️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/Kathireshganesh/Supermall_website.git

# 2. Go to the frontend project
cd supermall-client

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

> 🔐 Make sure to configure your `firebase.js` with your Firebase project credentials.

---

## 🔗 Live Demo (optional)

> Add link here if deployed on Netlify, Vercel, or Firebase Hosting

---

## 👤 Author

- [@Kathireshganesh](https://github.com/Kathireshganesh)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
