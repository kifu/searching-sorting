// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBE5HaSCVt01usNRRD4kanIiyodTUoxtdU",
  authDomain: "searching-sorting-lab-847fa.firebaseapp.com",
  projectId: "searching-sorting-lab-847fa",
  storageBucket: "searching-sorting-lab-847fa.firebasestorage.app",
  messagingSenderId: "467231667781",
  appId: "1:467231667781:web:8a07736305c5e71561d52c",
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// export for use in other files
window.auth = auth;
window.db = db;
