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
      .filter(p => p.available === true) // Apenas produtos explicitamente disponíveis
      .sort((a, b) => {
        // Primeiro, ordenar por categoria
        if (a.category !== b.category) {
          return (a.category || '').localeCompare(b.category || '');
        }
        
        // Para Bebidas, ordenar apenas por nome
        if (a.category === 'Bebidas') {
          return (a.name || '').localeCompare(b.name || '');
        }
        
        // Para outras categorias, ordenar por número se disponível
        const aNumber = a.number !== null && a.number !== undefined ? Number(a.number) : null;
        const bNumber = b.number !== null && b.number !== undefined ? Number(b.number) : null;
        
        // Se ambos têm número, ordenar por número
        if (aNumber !== null && bNumber !== null) {
          return aNumber - bNumber;
        }
        
        // Se apenas um tem número, o que tem número vem primeiro
        if (aNumber !== null && bNumber === null) {
          return -1;
        }
        if (aNumber === null && bNumber !== null) {
          return 1;
        }
        
        // Se nenhum tem número, ordenar por nome
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
    // Validar e converter preço
    let productPrice = product.price;
    if (productPrice === null || productPrice === undefined) {
      console.warn('⚠️ Preço não fornecido para produto:', product.name);
      productPrice = 0;
    } else {
      productPrice = typeof productPrice === 'number' ? productPrice : parseFloat(productPrice);
      if (isNaN(productPrice) || productPrice < 0) {
        console.warn('⚠️ Preço inválido para produto:', product.name, 'valor:', product.price);
        productPrice = 0;
      }
    }
    
    const productData = {
      name: product.name,
      description: product.description || '',
      price: productPrice,
      category: product.category,
      image: product.image || '',
      available: product.available !== undefined ? product.available : true,
      defaultIngredients: product.defaultIngredients || [], // Array de IDs de ingredientes padrão
      availableIngredients: product.availableIngredients || [], // Array de IDs de ingredientes disponíveis
      number: product.number || null, // Número do produto para numeração (preservado da importação)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Log detalhado do que está sendo salvo no Firebase
    console.log('═══════════════════════════════════════════════════════════');
    console.log('💾 [addProduct] DADOS SENDO SALVOS NO FIREBASE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📦 productData completo:', {
      name: productData.name,
      description: productData.description,
      descriptionLength: productData.description ? productData.description.length : 0,
      price: productData.price,
      category: productData.category,
      image: productData.image ? 'URL presente' : 'Sem imagem',
      available: productData.available,
      number: productData.number,
      numberType: typeof productData.number,
      defaultIngredients: productData.defaultIngredients,
      defaultIngredientsLength: productData.defaultIngredients.length,
      defaultIngredientsArray: productData.defaultIngredients,
      availableIngredients: productData.availableIngredients,
      availableIngredientsLength: productData.availableIngredients.length,
      availableIngredientsArray: productData.availableIngredients
    });
    console.log('🔍 Dados recebidos (product):', {
      defaultIngredients: product.defaultIngredients,
      defaultIngredientsType: typeof product.defaultIngredients,
      defaultIngredientsIsArray: Array.isArray(product.defaultIngredients),
      availableIngredients: product.availableIngredients,
      availableIngredientsType: typeof product.availableIngredients,
      availableIngredientsIsArray: Array.isArray(product.availableIngredients),
      number: product.number
    });
    console.log('═══════════════════════════════════════════════════════════');
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    console.log('✅ [addProduct] Produto adicionado no Firebase com ID:', docRef.id);
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
    // Validar e converter preço se fornecido
    let productPrice = product.price;
    if (product.price !== undefined) {
      if (productPrice === null || productPrice === undefined) {
        console.warn('⚠️ Preço não fornecido para atualização do produto:', id);
        productPrice = 0;
      } else {
        productPrice = typeof productPrice === 'number' ? productPrice : parseFloat(productPrice);
        if (isNaN(productPrice) || productPrice < 0) {
          console.warn('⚠️ Preço inválido para atualização do produto:', id, 'valor:', product.price);
          productPrice = 0;
        }
      }
    }
    
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const updateData = {
      ...product,
      price: product.price !== undefined ? productPrice : undefined, // Só atualizar se fornecido
      defaultIngredients: product.defaultIngredients || [], // Array de IDs de ingredientes padrão
      availableIngredients: product.availableIngredients || [], // Array de IDs de ingredientes disponíveis
      number: product.number !== undefined ? product.number : null, // Preservar número se fornecido
      updatedAt: serverTimestamp()
    };
    
    // Remover price se não foi fornecido (não atualizar)
    if (product.price === undefined) {
      delete updateData.price;
    }
    
    // Log detalhado do que está sendo salvo no Firebase
    console.log('═══════════════════════════════════════════════════════════');
    console.log('💾 [updateProduct] DADOS SENDO SALVOS NO FIREBASE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📦 updateData completo:', {
      name: updateData.name,
      description: updateData.description,
      descriptionLength: updateData.description ? updateData.description.length : 0,
      price: updateData.price,
      category: updateData.category,
      image: updateData.image ? 'URL presente' : 'Sem imagem',
      available: updateData.available,
      number: updateData.number,
      numberType: typeof updateData.number,
      defaultIngredients: updateData.defaultIngredients,
      defaultIngredientsLength: updateData.defaultIngredients.length,
      defaultIngredientsArray: updateData.defaultIngredients,
      availableIngredients: updateData.availableIngredients,
      availableIngredientsLength: updateData.availableIngredients.length,
      availableIngredientsArray: updateData.availableIngredients
    });
    console.log('🔍 Dados recebidos (product):', {
      defaultIngredients: product.defaultIngredients,
      defaultIngredientsType: typeof product.defaultIngredients,
      defaultIngredientsIsArray: Array.isArray(product.defaultIngredients),
      availableIngredients: product.availableIngredients,
      availableIngredientsType: typeof product.availableIngredients,
      availableIngredientsIsArray: Array.isArray(product.availableIngredients),
      number: product.number
    });
    console.log('═══════════════════════════════════════════════════════════');
    
    await updateDoc(docRef, updateData);
    console.log('✅ [updateProduct] Produto atualizado no Firebase:', id);
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

