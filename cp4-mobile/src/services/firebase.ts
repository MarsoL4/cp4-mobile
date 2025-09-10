import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCcW2Cn7ank9kNeHsBdWcAJdPfOJxVEMVU",
  authDomain: "cp4-mobile-9a8a8.firebaseapp.com",
  projectId: "cp4-mobile-9a8a8",
  storageBucket: "cp4-mobile-9a8a8.firebaseapp.com", // Corrigido!
  messagingSenderId: "628764041483",
  appId: "1:628764041483:web:1715a4c5ccfd4da858420e"
};

// Inicializa o Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Exporta os módulos para uso em outros arquivos
export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);