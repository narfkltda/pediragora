/**
 * Categories Service - Firebase Firestore Operations
 * Gerencia todas as operações CRUD de categorias de ingredientes
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

const CATEGORIES_COLLECTION = 'ingredientCategories';

/**
 * Buscar todas as categorias
 * @returns {Promise<Array>} Array de categorias
 */
export async function getCategories() {
  try {
    const q = query(
      collection(db, CATEGORIES_COLLECTION), 
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
}

/**
 * Buscar categoria por ID
 * @param {string} id - ID da categoria
 * @returns {Promise<Object|null>} Categoria ou null
 */
export async function getCategoryById(id) {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    throw error;
  }
}

/**
 * Adicionar nova categoria
 * @param {string} name - Nome da categoria
 * @returns {Promise<string>} ID da categoria criada
 */
export async function addCategory(name) {
  try {
    if (!name || !name.trim()) {
      throw new Error('Nome da categoria é obrigatório');
    }

    // Verificar se já existe categoria com o mesmo nome (case-insensitive)
    const existingCategories = await getCategories();
    const normalizedName = name.trim().toLowerCase();
    const duplicate = existingCategories.find(
      cat => cat.name.toLowerCase() === normalizedName
    );
    
    if (duplicate) {
      throw new Error('Já existe uma categoria com este nome');
    }

    const categoryData = {
      name: name.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), categoryData);
    console.log('Categoria adicionada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }
}

/**
 * Atualizar categoria existente
 * @param {string} id - ID da categoria
 * @param {string} name - Novo nome da categoria
 */
export async function updateCategory(id, name) {
  try {
    if (!name || !name.trim()) {
      throw new Error('Nome da categoria é obrigatório');
    }

    // Verificar se já existe outra categoria com o mesmo nome (case-insensitive)
    const existingCategories = await getCategories();
    const normalizedName = name.trim().toLowerCase();
    const duplicate = existingCategories.find(
      cat => cat.id !== id && cat.name.toLowerCase() === normalizedName
    );
    
    if (duplicate) {
      throw new Error('Já existe uma categoria com este nome');
    }

    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    const updateData = {
      name: name.trim(),
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    console.log('Categoria atualizada:', id);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
}

/**
 * Deletar categoria
 * @param {string} id - ID da categoria
 * @param {Function} checkIngredientsInUse - Função para verificar se há ingredientes usando a categoria
 */
export async function deleteCategory(id, checkIngredientsInUse = null) {
  try {
    // Verificar se há ingredientes usando esta categoria
    if (checkIngredientsInUse) {
      const inUse = await checkIngredientsInUse(id);
      if (inUse) {
        throw new Error('Não é possível excluir categoria que está sendo usada por ingredientes');
      }
    }

    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
    console.log('Categoria deletada:', id);
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error;
  }
}

/**
 * Buscar ou criar categoria padrão "Geral"
 * @returns {Promise<string>} ID da categoria "Geral"
 */
export async function getOrCreateDefaultCategory() {
  try {
    const categories = await getCategories();
    const defaultCategory = categories.find(cat => cat.name.toLowerCase() === 'geral');
    
    if (defaultCategory) {
      return defaultCategory.id;
    }
    
    // Criar categoria "Geral" se não existir
    const categoryId = await addCategory('Geral');
    return categoryId;
  } catch (error) {
    console.error('Erro ao buscar/criar categoria padrão:', error);
    throw error;
  }
}




