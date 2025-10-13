// import Firebase modules dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// konfigurasi firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQJB4mtmGfXg5hZDHvm5GPnvJsAjztIlM",
  authDomain: "searching-sorting.firebaseapp.com",
  projectId: "searching-sorting",
  storageBucket: "searching-sorting.firebasestorage.app",
  messagingSenderId: "996476007253",
  appId: "1:996476007253:web:d6168a70da0760625435dc",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
