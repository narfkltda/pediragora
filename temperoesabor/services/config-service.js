/**
 * Config Service - Gerencia configurações do restaurante
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase-config.js';

const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'restaurant';

/**
 * Retorna configuração padrão
 * @returns {Object} Configuração padrão
 */
function getDefaultConfig() {
  return {
    restaurantName: 'Tempero & Sabor',
    whatsappNumber: '67982077085',
    logoPath: '../assets/images/TemperoESaborLogo.png',
    restaurantLatitude: -20.367082707152765,
    restaurantLongitude: -51.42205139592757,
    openingHours: {
      segunda: null,
      terca: { open: '19:00', close: '22:45' },
      quarta: { open: '19:00', close: '22:45' },
      quinta: { open: '19:00', close: '22:45' },
      sexta: { open: '19:00', close: '22:45' },
      sabado: { open: '19:00', close: '22:45' },
      domingo: { open: '19:00', close: '22:45' }
    }
  };
}

/**
 * Buscar configurações do restaurante
 * @returns {Promise<Object>} Configurações do restaurante
 */
export async function getRestaurantConfig() {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Merge com configuração padrão para garantir que todos os campos existam
      return { ...getDefaultConfig(), ...data };
    }
    
    // Retornar configuração padrão se não existir
    return getDefaultConfig();
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return getDefaultConfig();
  }
}

/**
 * Salvar/Atualizar configurações do restaurante
 * @param {Object} config - Configurações do restaurante
 */
export async function saveRestaurantConfig(config) {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    const configData = {
      ...config,
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, configData, { merge: true });
    console.log('Configurações salvas com sucesso');
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    throw error;
  }
}

