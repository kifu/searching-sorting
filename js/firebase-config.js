// import Firebase modules dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// konfigurasi firebase
const firebaseConfig = {
  apiKey: "AIzaSyCcGYZWzdtjDJ9RnGuFoHJnX7YjqhTtJ8Y",
  authDomain: "searching-sorting-lab-745c6.firebaseapp.com",
  projectId: "searching-sorting-lab-745c6",
  storageBucket: "searching-sorting-lab-745c6.firebasestorage.app",
  messagingSenderId: "414945976243",
  appId: "1:414945976243:web:b7f46f40acfe58363f75c6",
  measurementId: "G-51T01TSQN9",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
