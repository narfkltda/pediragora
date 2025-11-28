/**
 * Módulo de comunicação Web Bluetooth para impressora térmica
 * Suporta impressoras que usam BLE (Bluetooth Low Energy)
 */

class BluetoothPrinter {
    constructor() {
        this.device = null;
        this.server = null;
        this.service = null;
        this.characteristic = null;
        this.isConnected = false;
        
        // UUIDs comuns para impressoras térmicas
        this.SERVICE_UUID = '00001101-0000-1000-8000-00805f9b34fb'; // Serial Port Profile
        this.CHARACTERISTIC_UUID = '00001101-0000-1000-8000-00805f9b34fb';
    }

    /**
     * Verifica se o navegador suporta Web Bluetooth API
     */
    isSupported() {
        if (!navigator.bluetooth) {
            return false;
        }
        return true;
    }

    /**
     * Verifica se está em contexto seguro (HTTPS ou localhost)
     */
    isSecureContext() {
        return window.isSecureContext || 
               window.location.protocol === 'https:' || 
               window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1';
    }

    /**
     * Busca e conecta à impressora Bluetooth
     */
    async connect() {
        try {
            // Verificar suporte
            if (!this.isSupported()) {
                throw new Error('Web Bluetooth não é suportado neste navegador. Use Chrome, Edge ou Opera.');
            }

            if (!this.isSecureContext()) {
                throw new Error('Web Bluetooth requer HTTPS ou localhost para funcionar.');
            }

            // Opções de busca
            const options = {
                acceptAllDevices: false,
                optionalServices: [this.SERVICE_UUID],
                filters: [
                    // Tentar buscar por nome comum de impressoras
                    { namePrefix: 'GSZJ' },
                    { namePrefix: 'Goldensky' },
                    { namePrefix: 'Printer' },
                    { services: [this.SERVICE_UUID] }
                ]
            };

            // Tentar buscar dispositivo
            console.log('Buscando dispositivos Bluetooth...');
            this.device = await navigator.bluetooth.requestDevice(options);

            // Adicionar listener para desconexão
            this.device.addEventListener('gattserverdisconnected', () => {
                this.handleDisconnection();
            });

            // Conectar ao servidor GATT
            console.log('Conectando ao servidor GATT...');
            this.server = await this.device.gatt.connect();

            // Tentar obter o serviço
            console.log('Buscando serviço...');
            try {
                this.service = await this.server.getPrimaryService(this.SERVICE_UUID);
            } catch (error) {
                // Tentar buscar todos os serviços disponíveis
                console.log('Serviço padrão não encontrado, buscando todos os serviços...');
                const services = await this.server.getPrimaryServices();
                if (services.length > 0) {
                    this.service = services[0];
                    console.log('Usando serviço:', this.service.uuid);
                } else {
                    throw new Error('Nenhum serviço Bluetooth encontrado na impressora.');
                }
            }

            // Tentar obter a característica de escrita
            console.log('Buscando característica...');
            try {
                const characteristics = await this.service.getCharacteristics();
                // Procurar característica com permissão de escrita
                for (const char of characteristics) {
                    const properties = char.properties;
                    if (properties.write || properties.writeWithoutResponse) {
                        this.characteristic = char;
                        break;
                    }
                }
                
                if (!this.characteristic && characteristics.length > 0) {
                    // Usar a primeira característica disponível
                    this.characteristic = characteristics[0];
                }

                if (!this.characteristic) {
                    throw new Error('Nenhuma característica de escrita encontrada.');
                }

                console.log('Característica encontrada:', this.characteristic.uuid);
            } catch (error) {
                throw new Error('Erro ao obter característica: ' + error.message);
            }

            this.isConnected = true;
            console.log('Conectado com sucesso!');
            return true;

        } catch (error) {
            console.error('Erro ao conectar:', error);
            this.isConnected = false;
            
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
     * Desconecta da impressora
     */
    async disconnect() {
        try {
            if (this.device && this.device.gatt.connected) {
                await this.device.gatt.disconnect();
            }
            this.handleDisconnection();
            return true;
        } catch (error) {
            console.error('Erro ao desconectar:', error);
            this.handleDisconnection();
            return false;
        }
    }

    /**
     * Trata desconexão
     */
    handleDisconnection() {
        this.isConnected = false;
        this.device = null;
        this.server = null;
        this.service = null;
        this.characteristic = null;
        console.log('Desconectado da impressora');
    }

    /**
     * Envia dados para a impressora
     * @param {Uint8Array|ArrayBuffer|string} data - Dados para enviar
     */
    async sendData(data) {
        if (!this.isConnected || !this.characteristic) {
            throw new Error('Impressora não está conectada.');
        }

        try {
            // Converter string para Uint8Array se necessário
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
            const properties = this.characteristic.properties;
            
            // Dividir em chunks se necessário (algumas características têm limite de tamanho)
            const maxChunkSize = 20; // Tamanho seguro para BLE
            const chunks = [];
            
            for (let i = 0; i < buffer.length; i += maxChunkSize) {
                chunks.push(buffer.slice(i, i + maxChunkSize));
            }

            // Enviar cada chunk
            for (const chunk of chunks) {
                if (properties.writeWithoutResponse) {
                    await this.characteristic.writeValueWithoutResponse(chunk);
                } else if (properties.write) {
                    await this.characteristic.writeValue(chunk);
                } else {
                    throw new Error('Característica não suporta escrita');
                }
                
                // Pequeno delay entre chunks para evitar sobrecarga
                if (chunks.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }

            return true;
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            if (error.name === 'NetworkError') {
                this.handleDisconnection();
                throw new Error('Conexão perdida com a impressora.');
            }
            throw error;
        }
    }

    /**
     * Obtém o nome do dispositivo conectado
     */
    getDeviceName() {
        return this.device ? this.device.name : null;
    }

    /**
     * Verifica status da conexão
     */
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            deviceName: this.getDeviceName(),
            supported: this.isSupported(),
            secureContext: this.isSecureContext()
        };
    }
}

// Exportar instância singleton
const bluetoothPrinter = new BluetoothPrinter();

