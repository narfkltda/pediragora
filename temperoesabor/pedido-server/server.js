/**
 * Servidor local para impressão direta de pedidos via TCP/IP
 * Conecta diretamente com impressora térmica Bematech MP-4200 HS
 */

const express = require('express');
const net = require('net');
const { generateESCPOS } = require('./escpos-generator');

const app = express();
const PORT = 3002; // Mudado para 3002 para evitar conflito com bridge server

// Configuração da impressora (hardcoded para teste local)
const PRINTER_IP = '192.168.68.101';
const PRINTER_PORT = 9100;
const CONNECTION_TIMEOUT = 5000; // 5 segundos

// Middleware para parsing JSON
app.use(express.json());

// CORS - permitir requisições do localhost
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

/**
 * Envia dados para impressora via TCP/IP socket
 */
function sendToPrinter(escposBuffer) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        let isResolved = false;
        let dataSent = false;
        
        // Timeout geral (maior que o timeout de conexão)
        const generalTimeout = setTimeout(() => {
            if (!isResolved) {
                isResolved = true;
                console.log('⚠️ Timeout geral - fechando conexão');
                socket.destroy();
                reject(new Error('Timeout ao processar impressão'));
            }
        }, CONNECTION_TIMEOUT + 3000); // 8 segundos total
        
        // Timeout de conexão
        const connectionTimeout = setTimeout(() => {
            if (!isResolved && !dataSent) {
                isResolved = true;
                clearTimeout(generalTimeout);
                socket.destroy();
                reject(new Error('Timeout ao conectar com impressora'));
            }
        }, CONNECTION_TIMEOUT);
        
        // Função para finalizar com sucesso
        const finishSuccess = () => {
            if (!isResolved) {
                isResolved = true;
                clearTimeout(connectionTimeout);
                clearTimeout(generalTimeout);
                console.log('✅ Impressão concluída - fechando conexão');
                socket.destroy();
                resolve();
            }
        };
        
        // Função para finalizar com erro
        const finishError = (error) => {
            if (!isResolved) {
                isResolved = true;
                clearTimeout(connectionTimeout);
                clearTimeout(generalTimeout);
                socket.destroy();
                reject(error);
            }
        };
        
        // Evento de conexão estabelecida
        socket.on('connect', () => {
            console.log(`✅ Conectado à impressora ${PRINTER_IP}:${PRINTER_PORT}`);
            clearTimeout(connectionTimeout);
            
            // Enviar dados
            socket.write(escposBuffer, (err) => {
                if (err) {
                    console.error('❌ Erro ao escrever dados:', err);
                    finishError(new Error(`Erro ao enviar dados: ${err.message}`));
                } else {
                    console.log(`✅ Dados enviados para impressora (${escposBuffer.length} bytes)`);
                    dataSent = true;
                    
                    // Aguardar um pouco para garantir que os dados foram processados
                    // e então fechar a conexão
                    setTimeout(() => {
                        finishSuccess();
                    }, 500); // 500ms deve ser suficiente para a impressora processar
                }
            });
        });
        
        // Evento de erro
        socket.on('error', (err) => {
            console.error('❌ Erro no socket:', err);
            finishError(new Error(`Erro de conexão: ${err.message}`));
        });
        
        // Evento de fechamento (pode ser chamado antes ou depois do nosso fechamento)
        socket.on('close', (hadError) => {
            if (hadError && !isResolved) {
                console.error('❌ Socket fechado com erro');
                finishError(new Error('Conexão fechada com erro'));
            } else if (!isResolved && dataSent) {
                // Se os dados foram enviados e o socket foi fechado, considerar sucesso
                finishSuccess();
            }
        });
        
        // Configurar socket para não manter conexão aberta
        socket.setNoDelay(true);
        socket.setKeepAlive(false);
        
        // Conectar à impressora
        try {
            socket.connect(PRINTER_PORT, PRINTER_IP);
        } catch (err) {
            finishError(new Error(`Erro ao iniciar conexão: ${err.message}`));
        }
    });
}

/**
 * Endpoint POST /print
 * Recebe dados do pedido e envia para impressora
 */
app.post('/print', async (req, res) => {
    const requestId = Date.now();
    console.log(`\n📥 [${requestId}] Nova requisição de impressão recebida`);
    
    try {
        const orderData = req.body;
        
        console.log(`📋 [${requestId}] Dados do pedido:`, {
            customer: orderData.customerName,
            itemsCount: orderData.items?.length || 0,
            total: orderData.total
        });
        
        // Validar dados básicos
        if (!orderData) {
            console.error(`❌ [${requestId}] Dados do pedido não fornecidos`);
            return res.status(400).json({
                success: false,
                error: 'Dados do pedido não fornecidos'
            });
        }
        
        // Gerar comandos ESC/POS
        let escposBuffer;
        try {
            console.log(`🔄 [${requestId}] Gerando comandos ESC/POS...`);
            escposBuffer = generateESCPOS(orderData);
            console.log(`✅ [${requestId}] Comandos ESC/POS gerados: ${escposBuffer.length} bytes`);
        } catch (error) {
            console.error(`❌ [${requestId}] Erro ao gerar comandos ESC/POS:`, error);
            return res.status(500).json({
                success: false,
                error: `Erro ao gerar comandos de impressão: ${error.message}`
            });
        }
        
        // Enviar para impressora
        try {
            console.log(`🖨️  [${requestId}] Enviando para impressora ${PRINTER_IP}:${PRINTER_PORT}...`);
            await sendToPrinter(escposBuffer);
            console.log(`✅ [${requestId}] Pedido impresso com sucesso!`);
            
            res.json({
                success: true,
                message: 'Pedido enviado para impressora com sucesso!'
            });
        } catch (error) {
            console.error(`❌ [${requestId}] Erro ao enviar para impressora:`, error.message);
            res.status(500).json({
                success: false,
                error: error.message || 'Erro ao enviar para impressora'
            });
        }
        
    } catch (error) {
        console.error(`❌ [${requestId}] Erro no endpoint /print:`, error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
    
    console.log(`🏁 [${requestId}] Requisição finalizada\n`);
});

/**
 * Endpoint GET /health
 * Verifica se o servidor está rodando
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Servidor de impressão está rodando',
        printer: {
            ip: PRINTER_IP,
            port: PRINTER_PORT
        }
    });
});

// Middleware de tratamento de erros - garantir que sempre retorne JSON
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Erro interno do servidor'
    });
});

// Middleware para rotas não encontradas - retornar JSON em vez de HTML
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Rota não encontrada: ${req.method} ${req.path}`
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 Servidor de impressão iniciado');
    console.log(`📡 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🖨️  Impressora configurada: ${PRINTER_IP}:${PRINTER_PORT}`);
    console.log(`📋 Endpoint: POST http://localhost:${PORT}/print`);
    console.log(`💚 Health check: GET http://localhost:${PORT}/health`);
    console.log(`\n⚠️  NOTA: Porta ${PORT} configurada para evitar conflito com bridge server na porta 3001`);
});
