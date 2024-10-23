// firebase.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJvYvds_GqpazpDmskJhKtCXRBWqLJ3t8",
  authDomain: "next-ecommerce-admin-d58ab.firebaseapp.com",
  projectId: "next-ecommerce-admin-d58ab",
  storageBucket: "next-ecommerce-admin-d58ab.appspot.com",
  messagingSenderId: "765123822334",
  appId: "1:765123822334:web:44f924e37625ff54945baf",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);