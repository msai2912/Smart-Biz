// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBd7r5pFYxktvgOAw_3AaCEJul1X-hvGVc",
  authDomain: "tv25-1facd.firebaseapp.com",
  projectId: "tv25-1facd",
  storageBucket: "tv25-1facd.firebasestorage.app",
  messagingSenderId: "220199621762",
  appId: "1:220199621762:web:2457388f8ca2d12694d09b"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export { auth, db };
export default app;
