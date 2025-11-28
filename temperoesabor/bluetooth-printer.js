/**
 * Funções simples de comunicação Web Bluetooth para impressora térmica
 * Implementação simplificada sem classes
 */

// Estado global da conexão
let bluetoothDevice = null;
let bluetoothServer = null;
let bluetoothService = null;
let bluetoothCharacteristic = null;
let isBluetoothConnected = false;

// UUIDs para impressoras térmicas
const SERVICE_UUID = '00001101-0000-1000-8000-00805f9b34fb'; // Serial Port Profile

/**
 * Verifica se o navegador suporta Web Bluetooth API
 */
function isBluetoothSupported() {
    return !!navigator.bluetooth;
}

/**
 * Verifica se está em contexto seguro (HTTPS ou localhost)
 */
function isSecureContext() {
    return window.isSecureContext || 
           window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
}

/**
 * Busca e conecta à impressora Bluetooth
 */
async function connectBluetoothPrinter() {
    try {
        // Verificar suporte
        if (!isBluetoothSupported()) {
            throw new Error('Web Bluetooth não é suportado neste navegador. Use Chrome, Edge ou Opera.');
        }

        if (!isSecureContext()) {
            throw new Error('Web Bluetooth requer HTTPS ou localhost para funcionar.');
        }

        // Opções de busca
        const options = {
            acceptAllDevices: false,
            optionalServices: [SERVICE_UUID],
            filters: [
                { namePrefix: 'GSZJ' },
                { namePrefix: 'Goldensky' },
                { namePrefix: 'Printer' },
                { services: [SERVICE_UUID] }
            ]
        };

        // Buscar dispositivo
        console.log('Buscando dispositivos Bluetooth...');
        bluetoothDevice = await navigator.bluetooth.requestDevice(options);

        // Listener para desconexão
        bluetoothDevice.addEventListener('gattserverdisconnected', handleBluetoothDisconnection);

        // Conectar ao servidor GATT
        console.log('Conectando ao servidor GATT...');
        bluetoothServer = await bluetoothDevice.gatt.connect();

        // Obter serviço
        console.log('Buscando serviço...');
        try {
            bluetoothService = await bluetoothServer.getPrimaryService(SERVICE_UUID);
        } catch (error) {
            // Tentar buscar todos os serviços disponíveis
            console.log('Serviço padrão não encontrado, buscando todos os serviços...');
            const services = await bluetoothServer.getPrimaryServices();
            if (services.length > 0) {
                bluetoothService = services[0];
                console.log('Usando serviço:', bluetoothService.uuid);
            } else {
                throw new Error('Nenhum serviço Bluetooth encontrado na impressora.');
            }
        }

        // Obter característica de escrita
        console.log('Buscando característica...');
        const characteristics = await bluetoothService.getCharacteristics();
        
        // Procurar característica com permissão de escrita
        for (const char of characteristics) {
            const properties = char.properties;
            if (properties.write || properties.writeWithoutResponse) {
                bluetoothCharacteristic = char;
                break;
            }
        }
        
        if (!bluetoothCharacteristic && characteristics.length > 0) {
            bluetoothCharacteristic = characteristics[0];
        }

        if (!bluetoothCharacteristic) {
            throw new Error('Nenhuma característica de escrita encontrada.');
        }

        console.log('Característica encontrada:', bluetoothCharacteristic.uuid);
        isBluetoothConnected = true;
        console.log('Conectado com sucesso!');
        
        return true;

    } catch (error) {
        console.error('Erro ao conectar:', error);
        isBluetoothConnected = false;
        
        if (error.name === 'NotFoundError') {
            throw new Error('Nenhuma impressora Bluetooth encontrada. Certifique-se de que a impressora está ligada e pareada.');
        } else if (error.name === 'SecurityError') {
            throw new Error('Erro de segurança. Verifique as permissões do navegador.');
        } else if (error.message) {
            throw error;
        } else {
            throw new Error('Erro ao conectar à impressora: ' + error.name);
        }
    }
}

/**
 * Desconecta da impressora Bluetooth
 */
async function disconnectBluetoothPrinter() {
    try {
        if (bluetoothDevice && bluetoothDevice.gatt.connected) {
            await bluetoothDevice.gatt.disconnect();
        }
        handleBluetoothDisconnection();
        return true;
    } catch (error) {
        console.error('Erro ao desconectar:', error);
        handleBluetoothDisconnection();
        return false;
    }
}

/**
 * Trata desconexão Bluetooth
 */
function handleBluetoothDisconnection() {
    isBluetoothConnected = false;
    bluetoothDevice = null;
    bluetoothServer = null;
    bluetoothService = null;
    bluetoothCharacteristic = null;
    console.log('Desconectado da impressora');
}

/**
 * Envia dados para a impressora Bluetooth
 * @param {Uint8Array|ArrayBuffer|string} data - Dados para enviar
 */
async function sendBluetoothData(data) {
    if (!isBluetoothConnected || !bluetoothCharacteristic) {
        throw new Error('Impressora não está conectada.');
    }

    try {
        // Converter para Uint8Array
        let buffer;
        if (typeof data === 'string') {
            const encoder = new TextEncoder();
            buffer = encoder.encode(data);
        } else if (data instanceof Uint8Array) {
            buffer = data;
        } else if (data instanceof ArrayBuffer) {
            buffer = new Uint8Array(data);
        } else {
            throw new Error('Formato de dados inválido');
        }

        // Verificar propriedades da característica
        const properties = bluetoothCharacteristic.properties;
        
        // Dividir em chunks (tamanho seguro para BLE)
        const maxChunkSize = 20;
        const chunks = [];
        
        for (let i = 0; i < buffer.length; i += maxChunkSize) {
            chunks.push(buffer.slice(i, i + maxChunkSize));
        }

        // Enviar cada chunk
        for (const chunk of chunks) {
            if (properties.writeWithoutResponse) {
                await bluetoothCharacteristic.writeValueWithoutResponse(chunk);
            } else if (properties.write) {
                await bluetoothCharacteristic.writeValue(chunk);
            } else {
                throw new Error('Característica não suporta escrita');
            }
            
            // Delay entre chunks
            if (chunks.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }

        return true;
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        if (error.name === 'NetworkError') {
            handleBluetoothDisconnection();
            throw new Error('Conexão perdida com a impressora.');
        }
        throw error;
    }
}

/**
 * Obtém o nome do dispositivo conectado
 */
function getBluetoothDeviceName() {
    return bluetoothDevice ? bluetoothDevice.name : null;
}

/**
 * Verifica status da conexão Bluetooth
 */
function getBluetoothConnectionStatus() {
    return {
        connected: isBluetoothConnected,
        deviceName: getBluetoothDeviceName(),
        supported: isBluetoothSupported(),
        secureContext: isSecureContext()
    };
}
