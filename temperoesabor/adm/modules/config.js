/**
 * Config Module
 * Gerencia configurações do restaurante
 */

import { getRestaurantConfig, saveRestaurantConfig } from '../../services/config-service.js';
import { showToast } from '../utils/ui.js';

// Elementos DOM
let configForm;
let configNameInput;
let configWhatsappInput;
let configLatitudeInput;
let configLongitudeInput;

/**
 * Inicializar módulo de configurações
 */
export function initConfig() {
    // Obter elementos DOM
    configForm = document.getElementById('config-form');
    configNameInput = document.getElementById('config-name');
    configWhatsappInput = document.getElementById('config-whatsapp');
    configLatitudeInput = document.getElementById('config-latitude');
    configLongitudeInput = document.getElementById('config-longitude');
    
    // Configurar event listeners
    setupConfigEventListeners();
    
    // Carregar configurações
    loadConfig();
}

/**
 * Configurar event listeners de configurações
 */
function setupConfigEventListeners() {
    if (configForm) {
        configForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveConfig();
        });
    }
}

/**
 * Carregar configurações
 */
export async function loadConfig() {
    try {
        const config = await getRestaurantConfig();
        
        if (configNameInput) configNameInput.value = config.restaurantName || '';
        if (configWhatsappInput) configWhatsappInput.value = config.whatsappNumber || '';
        if (configLatitudeInput) configLatitudeInput.value = config.restaurantLatitude || '';
        if (configLongitudeInput) configLongitudeInput.value = config.restaurantLongitude || '';
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

/**
 * Salvar configurações
 */
async function saveConfig() {
    if (!configNameInput || !configWhatsappInput) return;
    
    const configData = {
        restaurantName: configNameInput.value.trim(),
        whatsappNumber: configWhatsappInput.value.trim(),
        restaurantLatitude: configLatitudeInput ? parseFloat(configLatitudeInput.value) : null,
        restaurantLongitude: configLongitudeInput ? parseFloat(configLongitudeInput.value) : null
    };

    try {
        await saveRestaurantConfig(configData);
        showToast('Configurações salvas com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showToast('Erro ao salvar configurações: ' + error.message, 'error');
    }
}
