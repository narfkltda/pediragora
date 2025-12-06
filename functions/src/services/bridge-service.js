/**
 * Serviço para comunicação com o bridge server local
 */

const axios = require('axios');

/**
 * Envia pedido para o bridge server local
 * @param {Object} orderData - Dados do pedido
 * @param {string} bridgeUrl - URL do bridge server (via ngrok ou túnel)
 * @param {string} apiKey - API Key para autenticação
 * @returns {Promise<Object>} Resultado da impressão
 */
async function sendToBridge(orderData, bridgeUrl, apiKey) {
    try {
        // Garantir que a URL termina sem barra
        const cleanUrl = bridgeUrl.replace(/\/$/, '');
        const printUrl = `${cleanUrl}/print`;
        
        console.log(`📡 Enviando para bridge: ${printUrl}`);
        
        const response = await axios.post(printUrl, orderData, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            timeout: 30000 // 30 segundos
        });
        
        return response.data;
        
    } catch (error) {
        console.error('❌ Erro ao chamar bridge server:', error.message);
        
        if (error.response) {
            // Resposta do servidor com erro
            return {
                success: false,
                error: error.response.data?.error || `Erro HTTP ${error.response.status}`
            };
        } else if (error.request) {
            // Requisição feita mas sem resposta
            return {
                success: false,
                error: 'Bridge server não respondeu. Verifique se está rodando e acessível.'
            };
        } else {
            // Erro na configuração da requisição
            return {
                success: false,
                error: `Erro ao configurar requisição: ${error.message}`
            };
        }
    }
}

module.exports = {
    sendToBridge
};

