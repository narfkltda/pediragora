/**
 * Serviço para buscar configurações do Firestore
 */

const { getFirestore } = require('firebase-admin/firestore');

/**
 * Busca configuração do bridge server do Firestore
 * @param {string} configId - ID da configuração (padrão: 'default')
 * @returns {Promise<Object|null>} Configuração do bridge (url, apiKey)
 */
async function getBridgeConfig(configId = 'default') {
    try {
        const db = getFirestore();
        const docRef = db.collection('bridgeConfig').doc(configId);
        const docSnap = await docRef.get();
        
        if (!docSnap.exists) {
            console.warn(`⚠️ Configuração bridgeConfig/${configId} não encontrada no Firestore`);
            return null;
        }
        
        const data = docSnap.data();
        return {
            id: docSnap.id,
            url: data.url,
            apiKey: data.apiKey,
            enabled: data.enabled !== false
        };
    } catch (error) {
        console.error('❌ Erro ao buscar bridgeConfig do Firestore:', error);
        console.error('❌ Detalhes do erro:', {
            code: error.code,
            message: error.message,
            details: error.details
        });
        throw error;
    }
}

/**
 * Busca configuração da impressora do Firestore
 * @param {string} configId - ID da configuração (padrão: 'default')
 * @returns {Promise<Object|null>} Configuração da impressora (ip, subnetMask, gateway)
 */
async function getPrinterConfig(configId = 'default') {
    try {
        const db = getFirestore();
        const docRef = db.collection('printerConfig').doc(configId);
        const docSnap = await docRef.get();
        
        if (!docSnap.exists) {
            return null;
        }
        
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ip: data.ip,
            subnetMask: data.subnetMask,
            gateway: data.gateway,
            port: data.port || 9100,
            enabled: data.enabled !== false
        };
    } catch (error) {
        console.error('❌ Erro ao buscar printerConfig do Firestore:', error);
        throw error;
    }
}

module.exports = {
    getBridgeConfig,
    getPrinterConfig
};

