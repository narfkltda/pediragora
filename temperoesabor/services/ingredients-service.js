/**
 * Ingredients Service - Firebase Firestore Operations
 * Gerencia todas as operações CRUD de ingredientes
 */

import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase-config.js';

const INGREDIENTS_COLLECTION = 'ingredients';

/**
 * Buscar todos os ingredientes
 * @returns {Promise<Array>} Array de ingredientes
 */
export async function getIngredients() {
  try {
    const q = query(
      collection(db, INGREDIENTS_COLLECTION), 
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar ingredientes:', error);
    throw error;
  }
}

/**
 * Buscar ingredientes ativos
 * @returns {Promise<Array>} Array de ingredientes ativos
 */
export async function getActiveIngredients() {
  try {
    const q = query(
      collection(db, INGREDIENTS_COLLECTION),
      where('active', '==', true),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar ingredientes ativos:', error);
    // Fallback: buscar todos e filtrar
    if (error.code === 'failed-precondition') {
      const allIngredients = await getIngredients();
      return allIngredients
        .filter(ing => ing.active !== false)
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    throw error;
  }
}

/**
 * Buscar ingrediente por ID
 * @param {string} id - ID do ingrediente
 * @returns {Promise<Object|null>} Ingrediente ou null
 */
export async function getIngredientById(id) {
  try {
    const docRef = doc(db, INGREDIENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar ingrediente:', error);
    throw error;
  }
}

/**
 * Adicionar novo ingrediente
 * @param {Object} ingredient - Dados do ingrediente
 * @returns {Promise<string>} ID do ingrediente criado
 */
export async function addIngredient(ingredient) {
  try {
    const ingredientData = {
      name: ingredient.name.trim(),
      price: parseFloat(ingredient.price),
      active: ingredient.active !== undefined ? ingredient.active : true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, INGREDIENTS_COLLECTION), ingredientData);
    console.log('Ingrediente adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar ingrediente:', error);
    throw error;
  }
}

/**
 * Atualizar ingrediente existente
 * @param {string} id - ID do ingrediente
 * @param {Object} ingredient - Dados atualizados do ingrediente
 */
export async function updateIngredient(id, ingredient) {
  try {
    const docRef = doc(db, INGREDIENTS_COLLECTION, id);
    const updateData = {
      name: ingredient.name.trim(),
      price: parseFloat(ingredient.price),
      active: ingredient.active !== undefined ? ingredient.active : true,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    console.log('Ingrediente atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar ingrediente:', error);
    throw error;
  }
}

/**
 * Deletar ingrediente
 * @param {string} id - ID do ingrediente
 */
export async function deleteIngredient(id) {
  try {
    const docRef = doc(db, INGREDIENTS_COLLECTION, id);
    await deleteDoc(docRef);
    console.log('Ingrediente deletado:', id);
  } catch (error) {
    console.error('Erro ao deletar ingrediente:', error);
    throw error;
  }
}


