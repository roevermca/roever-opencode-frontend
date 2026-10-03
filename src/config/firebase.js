import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDDJeMwYUza4OsupxBVzYXkp4-bN_IFqag",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "roever-ams.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "roever-ams",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "roever-ams.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1039632518495",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1039632518495:web:e9a2a16086d188e2c77aea",
};

// Determines if valid Firebase configuration credentials have been supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "your_api_key_here" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "your_project_id"
);

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
}

export { app, auth, googleProvider };
