import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

//Irá pegar o getReactNativePersistence sem a necessidade de tipagem
const {getReactNativePersistence} = require("firebase/auth") as any

const firebaseConfig = {
  apiKey: "AIzaSyA4CRzI39qB95rS1UX7cTh6PuNP1IHsldU",
  authDomain: "projetoaulaautenticacao.firebaseapp.com",
  projectId: "projetoaulaautenticacao",
  storageBucket: "projetoaulaautenticacao.firebasestorage.app",
  messagingSenderId: "530213090198",
  appId: "1:530213090198:web:0995d800497d02161823b7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app,{
  persistence:getReactNativePersistence(AsyncStorage)
})

export {auth,db,collection,addDoc,getDocs,doc,updateDoc, deleteDoc};