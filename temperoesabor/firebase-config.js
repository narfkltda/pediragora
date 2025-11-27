/**
 * Firebase Configuration for Tempero & Sabor
 * 
 * Configuração do Firebase com credenciais do projeto
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQO4VKTn9zLQ681JaoD_0Q7V1TrrTg3B8",
  authDomain: "temperoesabor-57382.firebaseapp.com",
  projectId: "temperoesabor-57382",
  storageBucket: "temperoesabor-57382.firebasestorage.app",
  messagingSenderId: "827430491530",
  appId: "1:827430491530:web:2cf7925a8d847eed726473",
  measurementId: "G-JBWX1VYV4K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log('Firebase inicializado com sucesso!');

