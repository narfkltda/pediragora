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
    // Fallback: buscar todos e filtrar se houver erro de índice
    // Firebase pode retornar diferentes códigos de erro para índices faltantes
    const isIndexError = error.code === 'failed-precondition' || 
                        error.code === 'unavailable' || 
                        error.message?.includes('index') ||
                        error.message?.includes('The query requires an index');
    
    if (isIndexError) {
      // Não mostrar erro no console se for apenas falta de índice (fallback funcionará)
      console.log('ℹ️ Índice composto não disponível, usando fallback para buscar ingredientes ativos');
      try {
        const allIngredients = await getIngredients();
        const activeIngredients = allIngredients
          .filter(ing => ing.active === true) // Filtrar apenas os que são explicitamente true
          .sort((a, b) => a.name.localeCompare(b.name));
        console.log(`✅ Fallback: ${activeIngredients.length} ingredientes ativos encontrados`);
        return activeIngredients;
      } catch (fallbackError) {
        console.error('❌ Erro no fallback ao buscar ingredientes ativos:', fallbackError);
        throw fallbackError;
      }
    }
    // Se não for erro de índice, mostrar erro e relançar
    console.error('❌ Erro ao buscar ingredientes ativos:', error);
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
      category: ingredient.category || null, // Campo de categoria (opcional)
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
      category: ingredient.category !== undefined ? ingredient.category : null, // Campo de categoria
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
 * Buscar ingredientes por categoria
 * @param {string} categoryId - ID da categoria
 * @returns {Promise<Array>} Array de ingredientes da categoria
 */
export async function getIngredientsByCategory(categoryId) {
  try {
    const q = query(
      collection(db, INGREDIENTS_COLLECTION),
      where('category', '==', categoryId),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar ingredientes por categoria:', error);
    // Fallback: buscar todos e filtrar
    if (error.code === 'failed-precondition') {
      const allIngredients = await getIngredients();
      return allIngredients
        .filter(ing => ing.category === categoryId)
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    throw error;
  }
}

/**
 * Verificar se há ingredientes usando uma categoria
 * @param {string} categoryId - ID da categoria
 * @returns {Promise<boolean>} True se há ingredientes usando a categoria
 */
export async function hasIngredientsUsingCategory(categoryId) {
  try {
    const q = query(
      collection(db, INGREDIENTS_COLLECTION),
      where('category', '==', categoryId),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar ingredientes usando categoria:', error);
    // Fallback: buscar todos e filtrar
    if (error.code === 'failed-precondition') {
      const allIngredients = await getIngredients();
      return allIngredients.some(ing => ing.category === categoryId);
    }
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


