import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

//Irá pegar o getReactNativePersistence sem a necessidade de tipagem
const {getReactNativePersistence} = require("firebase/auth") as any

const firebaseConfig = {
  apiKey: "AIzaSyCcW2Cn7ank9kNeHsBdWcAJdPfOJxVEMVU",
  authDomain: "cp4-mobile-9a8a8.firebaseapp.com",
  projectId: "cp4-mobile-9a8a8",
  storageBucket: "cp4-mobile-9a8a8.firebasestorage.app",
  messagingSenderId: "628764041483",
  appId: "1:628764041483:web:1715a4c5ccfd4da858420e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app,{
  persistence:getReactNativePersistence(AsyncStorage)
})

export {auth,db,collection,addDoc,getDocs,doc,updateDoc, deleteDoc, app};