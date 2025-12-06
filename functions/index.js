/**
 * Cloud Functions para impressão de pedidos
 * Chama o bridge server local via túnel (ngrok)
 */

const { onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Inicializar Firebase Admin
// Para Cloud Functions v2, o Firebase Admin SDK usa automaticamente as credenciais do ambiente
try {
    initializeApp();
    console.log('✅ Firebase Admin inicializado');
} catch (error) {
    // Se já estiver inicializado, ignore o erro
    if (error.code !== 'app/already-initialized') {
        console.error('❌ Erro ao inicializar Firebase Admin:', error);
    }
}

const { sendToBridge } = require('./src/services/bridge-service');
const { getBridgeConfig } = require('./src/services/config-service');

/**
 * Cloud Function: printOrder
 * Recebe pedido do frontend e envia para bridge server local
 */
exports.printOrder = onRequest({
    cors: true,
    invoker: 'public', // Permitir acesso público
    timeoutSeconds: 60,
    memory: '256MiB'
}, async (req, res) => {
    // Configurar CORS manualmente ANTES de qualquer processamento
    const origin = req.headers.origin;
    
    // Permitir todas as origens para desenvolvimento
    if (origin) {
        res.set('Access-Control-Allow-Origin', origin);
    } else {
        res.set('Access-Control-Allow-Origin', '*');
    }
    
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.set('Access-Control-Max-Age', '3600');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    // Responder a requisições OPTIONS (preflight) IMEDIATAMENTE
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }
    
    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método não permitido. Use POST.'
        });
    }

    try {
        const orderData = req.body;
        
        console.log('📥 Pedido recebido na Cloud Function:', {
            customer: orderData.customerName,
            itemsCount: orderData.items?.length || 0
        });

        // Validar dados
        if (!orderData) {
            return res.status(400).json({
                success: false,
                error: 'Dados do pedido não fornecidos'
            });
        }

        // Buscar configuração do bridge do Firestore
        const bridgeConfig = await getBridgeConfig('default');
        
        if (!bridgeConfig || !bridgeConfig.url) {
            console.error('❌ Configuração do bridge não encontrada no Firestore');
            return res.status(500).json({
                success: false,
                error: 'Configuração do bridge server não encontrada. Configure no Firestore (bridgeConfig).'
            });
        }

        if (!bridgeConfig.apiKey) {
            console.error('❌ API Key do bridge não configurada');
            return res.status(500).json({
                success: false,
                error: 'API Key do bridge não configurada. Configure no Firestore (bridgeConfig).'
            });
        }

        console.log('🔗 Chamando bridge server:', bridgeConfig.url);

        // Enviar para bridge server
        try {
            const result = await sendToBridge(
                orderData,
                bridgeConfig.url,
                bridgeConfig.apiKey
            );

            if (result.success) {
                console.log('✅ Pedido impresso com sucesso via bridge');
                return res.json({
                    success: true,
                    message: result.message || 'Pedido enviado para impressora com sucesso!'
                });
            } else {
                console.error('❌ Erro no bridge:', result.error);
                return res.status(500).json({
                    success: false,
                    error: result.error || 'Erro ao enviar para impressora'
                });
            }
        } catch (error) {
            console.error('❌ Erro ao chamar bridge server:', error);
            return res.status(500).json({
                success: false,
                error: `Erro ao conectar com bridge server: ${error.message}`
            });
        }

    } catch (error) {
        console.error('❌ Erro na Cloud Function:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

