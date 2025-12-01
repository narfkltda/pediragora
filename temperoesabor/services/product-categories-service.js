/**
 * Product Categories Service - Firebase Firestore Operations
 * Gerencia todas as operações CRUD de categorias de produtos
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

const PRODUCT_CATEGORIES_COLLECTION = 'productCategories';

/**
 * Buscar todas as categorias de produtos
 * @returns {Promise<Array>} Array de categorias de produtos
 */
export async function getProductCategories() {
  try {
    const q = query(
      collection(db, PRODUCT_CATEGORIES_COLLECTION), 
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias de produtos:', error);
    throw error;
  }
}

/**
 * Buscar categoria de produto por ID
 * @param {string} id - ID da categoria
 * @returns {Promise<Object|null>} Categoria ou null
 */
export async function getProductCategoryById(id) {
  try {
    const docRef = doc(db, PRODUCT_CATEGORIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar categoria de produto:', error);
    throw error;
  }
}

/**
 * Adicionar nova categoria de produto
 * @param {string} name - Nome da categoria
 * @returns {Promise<string>} ID da categoria criada
 */
export async function addProductCategory(name) {
  try {
    if (!name || !name.trim()) {
      throw new Error('Nome da categoria é obrigatório');
    }

    // Verificar se já existe categoria com o mesmo nome (case-insensitive)
    const existingCategories = await getProductCategories();
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
    
    const docRef = await addDoc(collection(db, PRODUCT_CATEGORIES_COLLECTION), categoryData);
    console.log('Categoria de produto adicionada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar categoria de produto:', error);
    throw error;
  }
}

/**
 * Atualizar categoria de produto existente
 * @param {string} id - ID da categoria
 * @param {string} name - Novo nome da categoria
 */
export async function updateProductCategory(id, name) {
  try {
    if (!name || !name.trim()) {
      throw new Error('Nome da categoria é obrigatório');
    }

    // Verificar se já existe outra categoria com o mesmo nome (case-insensitive)
    const existingCategories = await getProductCategories();
    const normalizedName = name.trim().toLowerCase();
    const duplicate = existingCategories.find(
      cat => cat.id !== id && cat.name.toLowerCase() === normalizedName
    );
    
    if (duplicate) {
      throw new Error('Já existe uma categoria com este nome');
    }

    const docRef = doc(db, PRODUCT_CATEGORIES_COLLECTION, id);
    const updateData = {
      name: name.trim(),
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    console.log('Categoria de produto atualizada:', id);
  } catch (error) {
    console.error('Erro ao atualizar categoria de produto:', error);
    throw error;
  }
}

/**
 * Deletar categoria de produto
 * @param {string} id - ID da categoria
 * @param {Function} checkProductsInUse - Função para verificar se há produtos usando a categoria
 */
export async function deleteProductCategory(id, checkProductsInUse = null) {
  try {
    // Verificar se há produtos usando esta categoria
    if (checkProductsInUse) {
      const inUse = await checkProductsInUse(id);
      if (inUse) {
        throw new Error('Não é possível excluir categoria que está sendo usada por produtos');
      }
    }

    const docRef = doc(db, PRODUCT_CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
    console.log('Categoria de produto deletada:', id);
  } catch (error) {
    console.error('Erro ao deletar categoria de produto:', error);
    throw error;
  }
}

/**
 * Buscar ou criar categoria padrão de produtos
 * @returns {Promise<string>} ID da categoria padrão
 */
export async function getOrCreateDefaultProductCategory() {
  try {
    const categories = await getProductCategories();
    const defaultCategory = categories.find(cat => cat.name.toLowerCase() === 'geral');
    
    if (defaultCategory) {
      return defaultCategory.id;
    }
    
    // Criar categoria padrão se não existir
    const categoryId = await addProductCategory('Geral');
    return categoryId;
  } catch (error) {
    console.error('Erro ao buscar/criar categoria padrão de produtos:', error);
    throw error;
  }
}

