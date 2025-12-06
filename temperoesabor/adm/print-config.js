/**
 * Print Config - Gerenciar configurações de impressora no admin
 */

import { getPrinterConfig, savePrinterConfig } from '../services/printer-config-service.js';
import { showToast } from './utils/ui.js';

/**
 * Inicializar configuração de impressora
 */
export async function initPrintConfig() {
    console.log('🔧 Inicializando configuração de impressora...');
    
    // Carregar configurações existentes
    await loadPrinterConfig();
    
    // Adicionar event listeners
    setupEventListeners();
}

/**
 * Carregar configurações da impressora do Firestore
 */
async function loadPrinterConfig() {
    try {
        const config = await getPrinterConfig('default');
        
        if (config) {
            document.getElementById('printer-ip').value = config.ip || '';
            document.getElementById('printer-subnet-mask').value = config.subnetMask || '';
            document.getElementById('printer-gateway').value = config.gateway || '';
            console.log('✅ Configuração da impressora carregada:', config);
        } else {
            console.log('ℹ️ Nenhuma configuração encontrada. Use os valores padrão.');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar configuração da impressora:', error);
        showToast('Erro ao carregar configuração da impressora', 'error');
    }
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    const form = document.getElementById('printer-config-form');
    const testBtn = document.getElementById('test-printer-btn');
    
    if (form) {
        form.addEventListener('submit', handleSavePrinterConfig);
    }
    
    if (testBtn) {
        testBtn.addEventListener('click', handleTestPrinterConnection);
    }
}

/**
 * Salvar configuração da impressora
 */
async function handleSavePrinterConfig(e) {
    e.preventDefault();
    console.log('💾 Salvando configuração da impressora...');
    
    const ip = document.getElementById('printer-ip').value.trim();
    const subnetMask = document.getElementById('printer-subnet-mask').value.trim();
    const gateway = document.getElementById('printer-gateway').value.trim();
    
    // Validação básica
    if (!ip || !subnetMask || !gateway) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    // Validar formato de IP
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip) || !ipRegex.test(subnetMask) || !ipRegex.test(gateway)) {
        showToast('Formato de IP inválido. Use o formato: 192.168.1.1', 'error');
        return;
    }
    
    try {
        await savePrinterConfig({
            ip: ip,
            subnetMask: subnetMask,
            gateway: gateway,
            port: 9100, // Porta padrão para impressoras térmicas
            enabled: true
        }, 'default');
        
        showToast('Configuração da impressora salva com sucesso!', 'success');
        console.log('✅ Configuração salva');
    } catch (error) {
        console.error('❌ Erro ao salvar configuração:', error);
        showToast('Erro ao salvar configuração da impressora', 'error');
    }
}

/**
 * Testar conexão com impressora
 */
async function handleTestPrinterConnection() {
    const ip = document.getElementById('printer-ip').value.trim();
    
    if (!ip) {
        showToast('Digite o IP da impressora primeiro', 'error');
        return;
    }
    
    showToast('Testando conexão com impressora...', 'info');
    
    // Validação básica de formato
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
        showToast('Formato de IP inválido', 'error');
        return;
    }
    
    // TODO: Implementar teste real de conexão TCP/IP
    // Por enquanto, apenas validação de formato
    showToast('Formato de IP válido. Teste completo será implementado em breve.', 'success');
    console.log('🔍 Teste de conexão com impressora:', ip);
}

