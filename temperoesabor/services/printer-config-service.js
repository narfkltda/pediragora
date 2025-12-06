/**
 * Printer Config Service - Gerenciar configurações de impressora no Firestore
 */

import { 
  collection, 
  getDoc,
  setDoc, 
  doc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase-config.js';

const PRINTER_CONFIG_COLLECTION = 'printerConfig';
const BRIDGE_CONFIG_COLLECTION = 'bridgeConfig';
const FUNCTION_CONFIG_COLLECTION = 'functionConfig';

/**
 * Buscar configuração da impressora
 * @param {string} configId - ID da configuração (padrão: 'default')
 * @returns {Promise<Object>} Configuração da impressora
 */
export async function getPrinterConfig(configId = 'default') {
  try {
    const docRef = doc(db, PRINTER_CONFIG_COLLECTION, configId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Erro ao buscar printer config:', error);
    throw error;
  }
}

/**
 * Salvar/atualizar configuração da impressora
 * @param {Object} config - Configuração da impressora
 * @param {string} configId - ID da configuração (padrão: 'default')
 * @returns {Promise<void>}
 */
export async function savePrinterConfig(config, configId = 'default') {
  try {
    const configData = {
      ip: config.ip,
      subnetMask: config.subnetMask,
      gateway: config.gateway,
      port: config.port || 9100,
      enabled: config.enabled !== undefined ? config.enabled : true,
      updatedAt: serverTimestamp()
    };
    
    // Se não existe, adicionar createdAt
    const existing = await getPrinterConfig(configId);
    if (!existing) {
      configData.createdAt = serverTimestamp();
    }
    
    const docRef = doc(db, PRINTER_CONFIG_COLLECTION, configId);
    await setDoc(docRef, configData, { merge: true });
    
    console.log('Configuração da impressora salva com sucesso');
  } catch (error) {
    console.error('Erro ao salvar printer config:', error);
    throw error;
  }
}

/**
 * Buscar configuração do bridge
 * @param {string} configId - ID da configuração (padrão: 'default')
 * @returns {Promise<Object>} Configuração do bridge
 */
export async function getBridgeConfig(configId = 'default') {
  try {
    const docRef = doc(db, BRIDGE_CONFIG_COLLECTION, configId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Erro ao buscar bridge config:', error);
    throw error;
  }
}

/**
 * Salvar/atualizar configuração do bridge
 * @param {Object} config - Configuração do bridge
 * @param {string} configId - ID da configuração (padrão: 'default')
 * @returns {Promise<void>}
 */
export async function saveBridgeConfig(config, configId = 'default') {
  try {
    const configData = {
      url: config.url,
      apiKey: config.apiKey,
      enabled: config.enabled !== undefined ? config.enabled : true,
      updatedAt: serverTimestamp()
    };
    
    // Se não existe, adicionar createdAt
    const existing = await getBridgeConfig(configId);
    if (!existing) {
      configData.createdAt = serverTimestamp();
    }
    
    const docRef = doc(db, BRIDGE_CONFIG_COLLECTION, configId);
    await setDoc(docRef, configData, { merge: true });
    
    console.log('Configuração do bridge salva com sucesso');
  } catch (error) {
    console.error('Erro ao salvar bridge config:', error);
    throw error;
  }
}

/**
 * Buscar configuração da Cloud Function
 * @param {string} configId - ID da configuração (padrão: 'default')
 * @returns {Promise<Object>} Configuração da Cloud Function
 */
export async function getFunctionConfig(configId = 'default') {
  try {
    const docRef = doc(db, FUNCTION_CONFIG_COLLECTION, configId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Erro ao buscar function config:', error);
    throw error;
  }
}

/**
 * Salvar/atualizar configuração da Cloud Function
 * @param {Object} config - Configuração da Cloud Function
 * @param {string} configId - ID da configuração (padrão: 'default')
 * @returns {Promise<void>}
 */
export async function saveFunctionConfig(config, configId = 'default') {
  try {
    const configData = {
      url: config.url,
      enabled: config.enabled !== undefined ? config.enabled : true,
      updatedAt: serverTimestamp()
    };
    
    // Se não existe, adicionar createdAt
    const existing = await getFunctionConfig(configId);
    if (!existing) {
      configData.createdAt = serverTimestamp();
    }
    
    const docRef = doc(db, FUNCTION_CONFIG_COLLECTION, configId);
    await setDoc(docRef, configData, { merge: true });
    
    console.log('Configuração da Cloud Function salva com sucesso');
  } catch (error) {
    console.error('Erro ao salvar function config:', error);
    throw error;
  }
}

