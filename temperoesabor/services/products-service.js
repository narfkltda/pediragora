/**
 * Products Service - Firebase Firestore Operations
 * Gerencia todas as operações CRUD de produtos
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

const PRODUCTS_COLLECTION = 'products';

/**
 * Buscar todos os produtos
 * @returns {Promise<Array>} Array de produtos
 */
export async function getProducts() {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION), 
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

/**
 * Buscar produtos disponíveis (para o cardápio público)
 * @returns {Promise<Array>} Array de produtos disponíveis
 */
export async function getAvailableProducts() {
  try {
    // Tentar query com índices compostos primeiro
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('available', '==', true),
        orderBy('category'),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (products.length > 0) {
        return products;
      }
    } catch (indexError) {
      console.warn('Índice composto não disponível, usando fallback:', indexError.code);
    }
    
    // Fallback: buscar todos e filtrar
    const allProducts = await getProducts();
    const availableProducts = allProducts
      .filter(p => p.available !== false && p.available !== undefined)
      .sort((a, b) => {
        if (a.category !== b.category) {
          return (a.category || '').localeCompare(b.category || '');
        }
        return (a.name || '').localeCompare(b.name || '');
      });
    
    return availableProducts;
  } catch (error) {
    console.error('Erro ao buscar produtos disponíveis:', error);
    throw error;
  }
}

/**
 * Buscar produto por ID
 * @param {string} id - ID do produto
 * @returns {Promise<Object|null>} Produto ou null
 */
export async function getProductById(id) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw error;
  }
}

/**
 * Adicionar novo produto
 * @param {Object} product - Dados do produto
 * @returns {Promise<string>} ID do produto criado
 */
export async function addProduct(product) {
  try {
    const productData = {
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price),
      category: product.category,
      image: product.image || '',
      available: product.available !== undefined ? product.available : true,
      defaultIngredients: product.defaultIngredients || [], // Array de IDs de ingredientes padrão
      availableIngredients: product.availableIngredients || [], // Array de IDs de ingredientes disponíveis
      number: product.number || null, // Número do produto para numeração (preservado da importação)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    console.log('Produto adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    throw error;
  }
}

/**
 * Atualizar produto existente
 * @param {string} id - ID do produto
 * @param {Object} product - Dados atualizados do produto
 */
export async function updateProduct(id, product) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const updateData = {
      ...product,
      price: parseFloat(product.price),
      defaultIngredients: product.defaultIngredients || [], // Array de IDs de ingredientes padrão
      availableIngredients: product.availableIngredients || [], // Array de IDs de ingredientes disponíveis
      number: product.number !== undefined ? product.number : null, // Preservar número se fornecido
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    console.log('Produto atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

/**
 * Deletar produto
 * @param {string} id - ID do produto
 */
export async function deleteProduct(id) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
    console.log('Produto deletado:', id);
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}

/**
 * Buscar produtos por categoria
 * @param {string} category - Nome da categoria
 * @returns {Promise<Array>} Array de produtos da categoria
 */
export async function getProductsByCategory(category) {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      where('available', '==', true),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    // Fallback: buscar todos e filtrar
    if (error.code === 'failed-precondition') {
      const allProducts = await getAvailableProducts();
      return allProducts.filter(p => p.category === category);
    }
    throw error;
  }
}

