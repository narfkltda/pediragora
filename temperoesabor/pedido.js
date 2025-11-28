/**
 * Parser e formatador de pedidos do WhatsApp
 * Converte a mensagem do WhatsApp em HTML formatado para impressão
 */

document.addEventListener('DOMContentLoaded', function() {
    const orderInput = document.getElementById('order-input');
    const formatBtn = document.getElementById('format-btn');
    const clearBtn = document.getElementById('clear-btn');
    const printBtn = document.getElementById('print-btn');
    const backBtn = document.getElementById('back-btn');
    const previewSection = document.getElementById('preview-section');
    const orderPreview = document.getElementById('order-preview');
    
    // Elementos Bluetooth
    const connectBtn = document.getElementById('connect-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const bluetoothMessage = document.getElementById('bluetooth-message');

    // Botão formatar
    formatBtn.addEventListener('click', function() {
        const text = orderInput.value.trim();
        if (!text) {
            alert('Por favor, cole o pedido do WhatsApp primeiro!');
            return;
        }

        const formatted = parseOrder(text);
        if (formatted) {
            orderPreview.innerHTML = formatted;
            previewSection.style.display = 'block';
            orderInput.style.display = 'none';
            document.querySelector('.input-section h1').style.display = 'none';
            document.querySelector('.instructions').style.display = 'none';
            document.querySelector('.button-group').style.display = 'none';
        } else {
            alert('Não foi possível formatar o pedido. Verifique se o texto está completo.');
        }
    });

    // Botão limpar
    clearBtn.addEventListener('click', function() {
        orderInput.value = '';
        orderInput.focus();
    });

    // Botão voltar
    backBtn.addEventListener('click', function() {
        previewSection.style.display = 'none';
        orderInput.style.display = 'block';
        document.querySelector('.input-section h1').style.display = 'block';
        document.querySelector('.instructions').style.display = 'block';
        document.querySelector('.button-group').style.display = 'flex';
    });

    // Botão imprimir
    printBtn.addEventListener('click', async function() {
        await handlePrint();
    });

    // Botão conectar Bluetooth
    connectBtn.addEventListener('click', async function() {
        await handleBluetoothConnect();
    });

    // Botão desconectar Bluetooth
    disconnectBtn.addEventListener('click', async function() {
        await handleBluetoothDisconnect();
    });

    // Inicializar status Bluetooth
    updateBluetoothStatus();

    /**
     * Atualiza o status da conexão Bluetooth na interface
     */
    function updateBluetoothStatus() {
        const status = bluetoothPrinter.getConnectionStatus();
        
        if (status.connected) {
            statusIndicator.className = 'status-indicator connected';
            statusIndicator.textContent = '●';
            statusText.textContent = `Conectado: ${status.deviceName || 'Impressora'}`;
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'inline-block';
            bluetoothMessage.textContent = '';
            bluetoothMessage.className = 'bluetooth-message';
        } else {
            statusIndicator.className = 'status-indicator disconnected';
            statusIndicator.textContent = '●';
            
            if (!status.supported) {
                statusText.textContent = 'Web Bluetooth não suportado';
                connectBtn.disabled = true;
                bluetoothMessage.textContent = 'Use Chrome, Edge ou Opera para conectar via Bluetooth.';
                bluetoothMessage.className = 'bluetooth-message warning';
            } else if (!status.secureContext) {
                statusText.textContent = 'Requer HTTPS';
                connectBtn.disabled = true;
                bluetoothMessage.textContent = 'Web Bluetooth requer HTTPS ou localhost para funcionar.';
                bluetoothMessage.className = 'bluetooth-message warning';
            } else {
                statusText.textContent = 'Não conectado';
                connectBtn.disabled = false;
                bluetoothMessage.textContent = '';
                bluetoothMessage.className = 'bluetooth-message';
            }
            
            connectBtn.style.display = 'inline-block';
            disconnectBtn.style.display = 'none';
        }
    }

    /**
     * Trata conexão Bluetooth
     */
    async function handleBluetoothConnect() {
        try {
            connectBtn.disabled = true;
            connectBtn.textContent = 'Conectando...';
            bluetoothMessage.textContent = 'Buscando impressora...';
            bluetoothMessage.className = 'bluetooth-message info';

            await bluetoothPrinter.connect();
            
            updateBluetoothStatus();
            bluetoothMessage.textContent = 'Conectado com sucesso!';
            bluetoothMessage.className = 'bluetooth-message success';
            
        } catch (error) {
            console.error('Erro ao conectar:', error);
            bluetoothMessage.textContent = error.message || 'Erro ao conectar à impressora.';
            bluetoothMessage.className = 'bluetooth-message error';
            updateBluetoothStatus();
        } finally {
            connectBtn.disabled = false;
            connectBtn.textContent = '📱 Conectar Impressora Bluetooth';
        }
    }

    /**
     * Trata desconexão Bluetooth
     */
    async function handleBluetoothDisconnect() {
        try {
            disconnectBtn.disabled = true;
            disconnectBtn.textContent = 'Desconectando...';
            
            await bluetoothPrinter.disconnect();
            
            updateBluetoothStatus();
            bluetoothMessage.textContent = 'Desconectado com sucesso.';
            bluetoothMessage.className = 'bluetooth-message info';
            
        } catch (error) {
            console.error('Erro ao desconectar:', error);
            bluetoothMessage.textContent = 'Erro ao desconectar.';
            bluetoothMessage.className = 'bluetooth-message error';
        } finally {
            disconnectBtn.disabled = false;
            disconnectBtn.textContent = 'Desconectar';
        }
    }

    /**
     * Trata impressão (Bluetooth ou tradicional)
     */
    async function handlePrint() {
        const status = bluetoothPrinter.getConnectionStatus();
        
        if (status.connected) {
            // Imprimir via Bluetooth
            try {
                printBtn.disabled = true;
                printBtn.textContent = 'Imprimindo...';
                bluetoothMessage.textContent = 'Enviando para impressora...';
                bluetoothMessage.className = 'bluetooth-message info';

                // Obter HTML do pedido
                const orderHTML = orderPreview.innerHTML;
                
                // Converter para ESC/POS
                const escposData = escposConverter.convertHTMLToESCPOS(orderHTML);
                
                // Enviar para impressora
                await bluetoothPrinter.sendData(escposData);
                
                bluetoothMessage.textContent = 'Pedido enviado para impressora com sucesso!';
                bluetoothMessage.className = 'bluetooth-message success';
                
                // Limpar mensagem após 3 segundos
                setTimeout(() => {
                    bluetoothMessage.textContent = '';
                    bluetoothMessage.className = 'bluetooth-message';
                }, 3000);
                
            } catch (error) {
                console.error('Erro ao imprimir:', error);
                bluetoothMessage.textContent = error.message || 'Erro ao imprimir. Tente novamente ou use impressão tradicional.';
                bluetoothMessage.className = 'bluetooth-message error';
                
                // Oferecer fallback
                const useTraditional = confirm('Erro ao imprimir via Bluetooth. Deseja usar impressão tradicional?');
                if (useTraditional) {
                    window.print();
                }
            } finally {
                printBtn.disabled = false;
                printBtn.textContent = '🖨️ Imprimir Pedido';
            }
        } else {
            // Usar impressão tradicional
            window.print();
        }
    }

    /**
     * Parse do pedido do WhatsApp
     */
    function parseOrder(text) {
        try {
            const order = {
                date: '',
                time: '',
                customerName: '',
                customerPhone: '',
                items: [],
                total: '',
                notes: '',
                paymentMethod: '',
                changeAmount: '',
                change: '',
                deliveryMethod: '',
                deliveryAddress: '',
                deliveryComplement: '',
                deliveryFee: 0
            };

            const lines = text.split('\n').map(l => l.trim()).filter(l => l);

            let currentSection = 'header';
            let currentItem = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Pular separadores
                if (line.match(/^[=\-]+$/)) continue;

                // Data e hora
                if (line.startsWith('Data:')) {
                    const match = line.match(/Data:\s*(.+?)\s*às\s*(.+)/);
                    if (match) {
                        order.date = match[1].trim();
                        order.time = match[2].trim();
                    }
                    continue;
                }

                // Cliente
                if (line.match(/^\*?Cliente:\*?\s*(.+)/i)) {
                    order.customerName = line.replace(/^\*?Cliente:\*?\s*/i, '').trim();
                    continue;
                }

                // Telefone
                if (line.match(/^\*?Telefone:\*?\s*(.+)/i)) {
                    order.customerPhone = line.replace(/^\*?Telefone:\*?\s*/i, '').trim();
                    continue;
                }

                // ITENS
                if (line.match(/^\*?ITENS:\*?/i)) {
                    currentSection = 'items';
                    continue;
                }

                // Item do pedido
                if (currentSection === 'items' && line.match(/^\d+\.\s+(.+)/)) {
                    if (currentItem) {
                        order.items.push(currentItem);
                    }
                    const itemName = line.replace(/^\d+\.\s+/, '').trim();
                    currentItem = {
                        name: itemName,
                        quantity: 1,
                        price: 0,
                        total: 0,
                        customizations: {
                            removed: [],
                            added: []
                        }
                    };
                    continue;
                }

                // Quantidade e preço do item
                if (currentItem && line.match(/Qtd:\s*(\d+)\s*x\s*R\$\s*([\d,\.]+)\s*=\s*R\$\s*([\d,\.]+)/)) {
                    const match = line.match(/Qtd:\s*(\d+)\s*x\s*R\$\s*([\d,\.]+)\s*=\s*R\$\s*([\d,\.]+)/);
                    currentItem.quantity = parseInt(match[1]);
                    currentItem.price = parseFloat(match[2].replace(',', '.'));
                    currentItem.total = parseFloat(match[3].replace(',', '.'));
                    continue;
                }

                // Customizações - Remover
                if (currentItem && line.match(/Remover:\s*(.+)/i)) {
                    const removed = line.replace(/Remover:\s*/i, '').split(',').map(s => s.trim());
                    currentItem.customizations.removed = removed;
                    continue;
                }

                // Customizações - Adicionar
                if (currentItem && line.match(/Adicionar:\s*(.+)/i)) {
                    const added = line.replace(/Adicionar:\s*/i, '').split(',').map(s => s.trim());
                    currentItem.customizations.added = added;
                    continue;
                }

                // Taxa de entrega
                if (line.match(/Taxa de entrega:\s*R\$\s*([\d,\.]+)/i)) {
                    const match = line.match(/Taxa de entrega:\s*R\$\s*([\d,\.]+)/i);
                    order.deliveryFee = parseFloat(match[1].replace(',', '.'));
                    continue;
                }

                // TOTAL
                if (line.match(/^\*?TOTAL:\*?\s*R\$\s*([\d,\.]+)/i)) {
                    const match = line.match(/^\*?TOTAL:\*?\s*R\$\s*([\d,\.]+)/i);
                    order.total = match[1].replace('.', ',');
                    currentSection = 'footer';
                    continue;
                }

                // Observações
                if (line.match(/^\*?OBSERVAÇÕES:\*?/i)) {
                    currentSection = 'notes';
                    continue;
                }

                if (currentSection === 'notes' && order.notes === '') {
                    if (!line.match(/^\*?FORMA/i) && !line.match(/^\*?FORMA/i)) {
                        order.notes = line;
                        continue;
                    }
                }

                // Forma de pagamento
                if (line.match(/^\*?FORMA DE PAGAMENTO:\*?/i)) {
                    currentSection = 'payment';
                    continue;
                }

                if (currentSection === 'payment' && !order.paymentMethod) {
                    if (!line.match(/^\*?Valor pago/i) && !line.match(/^\*?Troco/i)) {
                        order.paymentMethod = line;
                        continue;
                    }
                }

                // Valor pago
                if (line.match(/^\*?Valor pago:\*?\s*R\$\s*([\d,\.]+)/i)) {
                    const match = line.match(/^\*?Valor pago:\*?\s*R\$\s*([\d,\.]+)/i);
                    order.changeAmount = match[1].replace('.', ',');
                    continue;
                }

                // Troco
                if (line.match(/^\*?Troco:\*?\s*R\$\s*([\d,\.]+)/i)) {
                    const match = line.match(/^\*?Troco:\*?\s*R\$\s*([\d,\.]+)/i);
                    order.change = match[1].replace('.', ',');
                    continue;
                }

                // Forma de entrega
                if (line.match(/^\*?FORMA DE ENTREGA:\*?/i)) {
                    currentSection = 'delivery';
                    continue;
                }

                if (currentSection === 'delivery' && !order.deliveryMethod) {
                    if (!line.match(/^\*?Endereço/i) && !line.match(/^\*?LOCAL/i)) {
                        order.deliveryMethod = line;
                        continue;
                    }
                }

                // Endereço
                if (line.match(/^\*?Endereço:\*?\s*(.+)/i)) {
                    order.deliveryAddress = line.replace(/^\*?Endereço:\*?\s*/i, '').trim();
                    continue;
                }

                // Complemento
                if (line.match(/Complemento:\s*(.+)/i)) {
                    order.deliveryComplement = line.replace(/Complemento:\s*/i, '').trim();
                    continue;
                }
            }

            // Adicionar último item se houver
            if (currentItem) {
                order.items.push(currentItem);
            }

            // Gerar HTML formatado
            return formatOrderHTML(order);

        } catch (error) {
            console.error('Erro ao fazer parse do pedido:', error);
            return null;
        }
    }

    /**
     * Formata o pedido em HTML
     */
    function formatOrderHTML(order) {
        let html = `
            <div class="order-header">
                <div class="logo-container">
                    <img src="../assets/images/TemperoESaborSemFundo.png" alt="Tempero & Sabor" onerror="this.style.display='none';">
                </div>
                <div class="order-title">PEDIDO</div>
            </div>

            <div class="order-info">
                ${order.date ? `<p><strong>Data:</strong> ${order.date} às ${order.time}</p>` : ''}
                ${order.customerName ? `<p><strong>Cliente:</strong> ${order.customerName}</p>` : ''}
                ${order.customerPhone ? `<p><strong>Telefone:</strong> ${order.customerPhone}</p>` : ''}
            </div>

            <div class="items-section">
                <div class="items-title">ITENS</div>
                ${order.items.map((item, index) => `
                    <div class="order-item">
                        <div class="item-name">${index + 1}. ${item.name}</div>
                        <div class="item-details">
                            Qtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')} = R$ ${item.total.toFixed(2).replace('.', ',')}
                        </div>
                        ${(item.customizations.removed.length > 0 || item.customizations.added.length > 0) ? `
                            <div class="item-customizations">
                                ${item.customizations.removed.length > 0 ? `<div><strong>Remover:</strong> ${item.customizations.removed.join(', ')}</div>` : ''}
                                ${item.customizations.added.length > 0 ? `<div><strong>Adicionar:</strong> ${item.customizations.added.join(', ')}</div>` : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>

            ${order.deliveryFee > 0 ? `
                <div class="order-info">
                    <p><strong>Taxa de entrega:</strong> R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}</p>
                </div>
            ` : ''}

            <div class="total-section">
                <div class="total-label">TOTAL</div>
                <div class="total-value">R$ ${order.total}</div>
            </div>

            ${order.notes ? `
                <div class="order-info">
                    <p><strong>OBSERVAÇÕES:</strong></p>
                    <p>${order.notes}</p>
                </div>
            ` : ''}

            ${order.paymentMethod ? `
                <div class="order-info">
                    <p><strong>FORMA DE PAGAMENTO:</strong> ${order.paymentMethod}</p>
                    ${order.changeAmount ? `<p><strong>Valor pago:</strong> R$ ${order.changeAmount}</p>` : ''}
                    ${order.change ? `<p><strong>Troco:</strong> R$ ${order.change}</p>` : ''}
                </div>
            ` : ''}

            ${order.deliveryMethod ? `
                <div class="order-info">
                    <p><strong>FORMA DE ENTREGA:</strong> ${order.deliveryMethod}</p>
                    ${order.deliveryAddress ? `<p><strong>Endereço:</strong> ${order.deliveryAddress}</p>` : ''}
                    ${order.deliveryComplement ? `<p><strong>Complemento:</strong> ${order.deliveryComplement}</p>` : ''}
                </div>
            ` : ''}

            <div class="order-footer">
                Obrigado Pela Preferência!
            </div>
        `;

        return html;
    }
});

