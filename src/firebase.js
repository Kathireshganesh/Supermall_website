// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // ✅ Add this

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTClmx5AL9A2RiD-EcxTRk1i0iE2ex-kw",
  authDomain: "supermall-29106.firebaseapp.com",
  projectId: "supermall-29106",
  storageBucket: "supermall-29106.appspot.com", // ✅ Corrected domain
  messagingSenderId: "1001116966337",
  appId: "1:1001116966337:web:8bfe358100b7fc1ce0e340",
  measurementId: "G-SZQVFC33FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Add this
const analytics = getAnalytics(app);

// Export for use in components
export { auth, db, storage };
