// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "trendsphere-bae0f.firebaseapp.com",
  projectId: "trendsphere-bae0f",
  storageBucket: "trendsphere-bae0f.firebasestorage.app",
  messagingSenderId: "28041668472",
  appId: "1:28041668472:web:918d905fe3467a19ee0a8d",
  measurementId: "G-SEBDQGZGK6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
