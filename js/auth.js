import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// --- Helper Functions ---
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.style.display = "none";
  }
}

function showLoading(elementId) {
  const loadingElement = document.getElementById(elementId);
  if (loadingElement) {
    loadingElement.style.display = "block";
  }
}

function hideLoading(elementId) {
  const loadingElement = document.getElementById(elementId);
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

// --- Register Handler ---
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    hideError("register-error");

    // Validasi
    if (password !== confirmPassword) {
      showError(
        "register-error",
        "Password dan konfirmasi password tidak cocok!"
      );
      return;
    }

    if (password.length < 6) {
      showError("register-error", "Password minimal 6 karakter!");
      return;
    }

    try {
      showLoading("register-loading");

      // Buat user di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Simpan data user ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp(),
      });

      alert("Registrasi berhasil! Silakan login.");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error registrasi:", error);

      // Handle error messages
      let errorMessage = "Terjadi kesalahan saat registrasi.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email sudah terdaftar!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid!";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah!";
      }

      showError("register-error", errorMessage);
    } finally {
      hideLoading("register-loading");
    }
  });
}

// --- Login Handler ---
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    hideError("login-error");

    try {
      showLoading("login-loading");

      // Login dengan Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update lastActive
      await setDoc(
        doc(db, "users", user.uid),
        {
          lastActive: serverTimestamp(),
        },
        { merge: true }
      );

      // Redirect ke main page
      window.location.href = "main-page.html";
    } catch (error) {
      console.error("Error login:", error);

      // Handle error messages
      let errorMessage = "Terjadi kesalahan saat login.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMessage = "Email atau password salah!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid!";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti.";
      }

      showError("login-error", errorMessage);
    } finally {
      hideLoading("login-loading");
    }
  });
}

// --- Auth State Observer (untuk proteksi halaman) ---
onAuthStateChanged(auth, async (user) => {
  const currentPath = window.location.pathname;
  const isMainPage = currentPath.includes("main-page.html");
  const isLoginPage = currentPath.includes("index.html");
  const isRegisterPage = currentPath.includes("register.html");

  if (user) {
    // User sudah login
    if (isLoginPage || isRegisterPage) {
      // Redirect ke main page jika sudah login
      window.location.href = "main-page.html";
    }
  } else {
    // User belum login
    if (isMainPage) {
      // Redirect ke login jika belum login
      window.location.href = "index.html";
    }
  }
});
