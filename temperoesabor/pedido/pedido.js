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
    
    // Elementos da modal - buscar dentro do DOMContentLoaded
    const printModal = document.getElementById('print-modal');
    const modalThermalBtn = document.getElementById('modal-thermal-btn');
    const modalBrowserBtn = document.getElementById('modal-browser-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    
    // Verificar se os elementos da modal existem
    if (!printModal || !modalThermalBtn || !modalBrowserBtn || !modalCancelBtn) {
        console.error('❌ Elementos da modal não encontrados!', {
            printModal: !!printModal,
            modalThermalBtn: !!modalThermalBtn,
            modalBrowserBtn: !!modalBrowserBtn,
            modalCancelBtn: !!modalCancelBtn
        });
    }
    
    // Armazenar dados do pedido parseado
    let currentOrderData = null;

    // Botão formatar
    formatBtn.addEventListener('click', function() {
        const text = orderInput.value.trim();
        if (!text) {
            alert('Por favor, cole o pedido do WhatsApp primeiro!');
            return;
        }

        const result = parseOrder(text);
        if (result && result.html) {
            orderPreview.innerHTML = result.html;
            currentOrderData = result.order; // Armazenar dados do pedido
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

    // Botão imprimir - oferece duas opções via modal
    printBtn.addEventListener('click', function() {
        if (!currentOrderData) {
            showToast('Nenhum pedido formatado. Formate o pedido primeiro.', 'error');
            return;
        }
        
        // Verificar se a modal existe antes de mostrar
        if (!printModal) {
            console.error('❌ Modal não encontrada! Verifique se o HTML da modal está presente.');
            // Fallback para confirm se modal não existir
            const choice = confirm('Escolha o tipo de impressão:\n\nOK = Enviar para Impressora Térmica\nCancelar = Imprimir no Navegador');
            if (choice) {
                sendToThermalPrinter(currentOrderData);
            } else {
                window.print();
            }
            return;
        }
        
        console.log('✅ Modal encontrada, exibindo...');
        // Mostrar modal de escolha
        printModal.style.display = 'flex';
    });

    // Botão Impressora Térmica na modal
    if (modalThermalBtn) {
        modalThermalBtn.addEventListener('click', function() {
            if (printModal) printModal.style.display = 'none';
            sendToThermalPrinter(currentOrderData);
        });
    }

    // Botão Navegador na modal
    if (modalBrowserBtn) {
        modalBrowserBtn.addEventListener('click', function() {
            if (printModal) printModal.style.display = 'none';
            window.print();
        });
    }

    // Botão Cancelar na modal
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', function() {
            if (printModal) printModal.style.display = 'none';
        });
    }

    // Fechar modal ao clicar fora
    if (printModal) {
        printModal.addEventListener('click', function(e) {
            if (e.target === printModal) {
                printModal.style.display = 'none';
            }
        });
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
            const html = formatOrderHTML(order);
            return {
                html: html,
                order: order
            };

        } catch (error) {
            console.error('Erro ao fazer parse do pedido:', error);
            return null;
        }
    }
    
    /**
     * Envia pedido para impressora térmica via Cloud Function ou servidor local
     */
    async function sendToThermalPrinter(orderData) {
        // Mostrar toast de carregamento
        showToast('Enviando para impressora...', 'info');
        
        try {
            // Tentar usar Cloud Function primeiro
            const functionConfig = await getCloudFunctionUrl();
            
            if (functionConfig && functionConfig.enabled && functionConfig.url) {
                // Verificar se a URL não é do emulador local
                if (functionConfig.url.includes('localhost') || functionConfig.url.includes('127.0.0.1')) {
                    console.warn('⚠️ URL do emulador detectada. Verifique se functionConfig está configurado corretamente no Firestore.');
                    console.log('📡 Usando servidor local (fallback)');
                    await sendToLocalServer(orderData);
                } else {
                    // Usar Cloud Function de produção
                    console.log('📡 Usando Cloud Function:', functionConfig.url);
                    await sendToCloudFunction(orderData, functionConfig.url);
                }
            } else {
                // Fallback para servidor local (desenvolvimento)
                console.log('📡 Usando servidor local (fallback)');
                if (!functionConfig) {
                    console.warn('⚠️ functionConfig não encontrado no Firestore. Configure em: functionConfig/default');
                } else if (!functionConfig.enabled) {
                    console.warn('⚠️ Cloud Function está desabilitada no Firestore');
                } else if (!functionConfig.url) {
                    console.warn('⚠️ URL da Cloud Function não configurada no Firestore');
                }
                await sendToLocalServer(orderData);
            }
        } catch (error) {
            console.error('Erro ao enviar para impressora:', error);
            showToast(error.message || 'Erro ao enviar para impressora', 'error');
        }
    }
    
    /**
     * Busca URL da Cloud Function do Firestore
     */
    async function getCloudFunctionUrl() {
        try {
            // Importar dinamicamente para evitar erro se não estiver disponível
            const { getFunctionConfig } = await import('../services/printer-config-service.js');
            const config = await getFunctionConfig('default');
            return config;
        } catch (error) {
            console.warn('⚠️ Erro ao buscar function config:', error);
            return null;
        }
    }
    
    /**
     * Envia para Cloud Function
     */
    async function sendToCloudFunction(orderData, functionUrl) {
        try {
            // Garantir que a URL não termina com barra
            const cleanUrl = functionUrl.replace(/\/$/, '');
            
            console.log('📡 Enviando para:', cleanUrl);
            
            const response = await fetch(cleanUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            // Verificar se a resposta é JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Resposta não é JSON:', text.substring(0, 200));
                throw new Error('Cloud Function retornou resposta inválida');
            }
            
            const result = await response.json();
            
            if (result.success) {
                showToast(result.message || 'Pedido enviado para impressora com sucesso!', 'success');
            } else {
                throw new Error(result.error || 'Erro ao enviar para impressora');
            }
        } catch (error) {
            console.error('Erro ao chamar Cloud Function:', error);
            throw new Error(`Erro na Cloud Function: ${error.message}`);
        }
    }
    
    /**
     * Envia para servidor local (fallback para desenvolvimento)
     */
    async function sendToLocalServer(orderData) {
        const PRINT_SERVER_URL = 'http://localhost:3002/print';
        
        try {
            const response = await fetch(PRINT_SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            // Verificar se a resposta é JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Resposta não é JSON:', text.substring(0, 200));
                
                if (response.status === 404) {
                    throw new Error('Servidor local não encontrado. Verifique se está rodando na porta 3002.');
                } else {
                    throw new Error('Servidor retornou resposta inválida');
                }
            }
            
            const result = await response.json();
            
            if (result.success) {
                showToast(result.message || 'Pedido enviado para impressora com sucesso!', 'success');
            } else {
                throw new Error(result.error || 'Erro ao enviar para impressora');
            }
        } catch (error) {
            console.error('Erro ao chamar servidor local:', error);
            
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Servidor local não está rodando. Inicie o servidor na porta 3002 ou configure a Cloud Function.');
            } else {
                throw error;
            }
        }
    }
    
    /**
     * Sistema de toast/notificação visual
     */
    function showToast(message, type = 'info') {
        // Remover toast existente se houver
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Criar elemento toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Adicionar ao body
        document.body.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remover após 3 segundos (ou 5 para erro)
        const duration = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
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

