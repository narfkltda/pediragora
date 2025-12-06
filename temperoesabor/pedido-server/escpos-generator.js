/**
 * Gerador de comandos ESC/POS para impressora térmica
 * Compatível com Bematech MP-4200 HS e outras impressoras ESC/POS
 */

// Constantes ESC/POS
const ESC = 0x1B;
const GS = 0x1D;
const LF = 0x0A;

/**
 * Comandos ESC/POS básicos
 */
const Commands = {
    // Inicializar impressora
    INIT: Buffer.from([ESC, 0x40]),
    
    // Alinhamento
    ALIGN_LEFT: Buffer.from([ESC, 0x61, 0x00]),
    ALIGN_CENTER: Buffer.from([ESC, 0x61, 0x01]),
    ALIGN_RIGHT: Buffer.from([ESC, 0x61, 0x02]),
    
    // Negrito
    BOLD_ON: Buffer.from([ESC, 0x45, 0x01]),
    BOLD_OFF: Buffer.from([ESC, 0x45, 0x00]),
    
    // Quebra de linha
    LINE_FEED: Buffer.from([LF]),
    
    // Cortar papel
    CUT_FULL: Buffer.from([GS, 0x56, 0x00]),
    
    // Tamanho de fonte (normal)
    FONT_NORMAL: Buffer.from([ESC, 0x4D, 0x00]),
    
    // Espaçamento entre linhas
    LINE_SPACING: (n) => Buffer.from([ESC, 0x33, n]),
};

/**
 * Converte texto para Buffer com encoding correto
 */
function textToBuffer(text) {
    return Buffer.from(text, 'utf8');
}

/**
 * Adiciona quebra de linha
 */
function addLineFeed(buffer) {
    return Buffer.concat([buffer, Commands.LINE_FEED]);
}

/**
 * Adiciona múltiplas quebras de linha
 */
function addLineFeeds(buffer, count = 1) {
    let result = buffer;
    for (let i = 0; i < count; i++) {
        result = Buffer.concat([result, Commands.LINE_FEED]);
    }
    return result;
}

/**
 * Gera comandos ESC/POS para impressão do pedido
 * @param {Object} orderData - Dados do pedido parseado
 * @returns {Buffer} Buffer com comandos ESC/POS prontos para envio
 */
function generateESCPOS(orderData) {
    let buffer = Buffer.alloc(0);
    
    // 1. Inicializar impressora
    buffer = Buffer.concat([buffer, Commands.INIT]);
    buffer = addLineFeeds(buffer, 2);
    
    // 2. Logo/Título centralizado (negrito)
    buffer = Buffer.concat([buffer, Commands.ALIGN_CENTER]);
    buffer = Buffer.concat([buffer, Commands.BOLD_ON]);
    buffer = Buffer.concat([buffer, textToBuffer('TEMPERO & SABOR')]);
    buffer = Buffer.concat([buffer, Commands.BOLD_OFF]);
    buffer = addLineFeeds(buffer, 2);
    
    // 3. "PEDIDO" centralizado
    buffer = Buffer.concat([buffer, Commands.ALIGN_CENTER]);
    buffer = Buffer.concat([buffer, Commands.BOLD_ON]);
    buffer = Buffer.concat([buffer, textToBuffer('PEDIDO')]);
    buffer = Buffer.concat([buffer, Commands.BOLD_OFF]);
    buffer = addLineFeeds(buffer, 2);
    
    // 4. Informações do pedido (alinhado à esquerda)
    buffer = Buffer.concat([buffer, Commands.ALIGN_LEFT]);
    
    if (orderData.date) {
        buffer = Buffer.concat([buffer, textToBuffer(`Data: ${orderData.date} às ${orderData.time || ''}`)]);
        buffer = addLineFeed(buffer);
    }
    
    if (orderData.customerName) {
        buffer = Buffer.concat([buffer, textToBuffer(`Cliente: ${orderData.customerName}`)]);
        buffer = addLineFeed(buffer);
    }
    
    if (orderData.customerPhone) {
        buffer = Buffer.concat([buffer, textToBuffer(`Telefone: ${orderData.customerPhone}`)]);
        buffer = addLineFeed(buffer);
    }
    
    buffer = addLineFeeds(buffer, 1);
    
    // 5. ITENS (negrito)
    buffer = Buffer.concat([buffer, Commands.BOLD_ON]);
    buffer = Buffer.concat([buffer, textToBuffer('ITENS')]);
    buffer = Buffer.concat([buffer, Commands.BOLD_OFF]);
    buffer = addLineFeeds(buffer, 1);
    
    // 6. Lista de itens
    if (orderData.items && orderData.items.length > 0) {
        orderData.items.forEach((item, index) => {
            // Número e nome do item
            buffer = Buffer.concat([buffer, textToBuffer(`${index + 1}. ${item.name}`)]);
            buffer = addLineFeed(buffer);
            
            // Quantidade, preço e total
            const priceStr = item.price ? item.price.toFixed(2).replace('.', ',') : '0,00';
            const totalStr = item.total ? item.total.toFixed(2).replace('.', ',') : '0,00';
            buffer = Buffer.concat([buffer, textToBuffer(`   Qtd: ${item.quantity} x R$ ${priceStr} = R$ ${totalStr}`)]);
            buffer = addLineFeed(buffer);
            
            // Customizações - Remover
            if (item.customizations && item.customizations.removed && item.customizations.removed.length > 0) {
                buffer = Buffer.concat([buffer, textToBuffer(`   Remover: ${item.customizations.removed.join(', ')}`)]);
                buffer = addLineFeed(buffer);
            }
            
            // Customizações - Adicionar
            if (item.customizations && item.customizations.added && item.customizations.added.length > 0) {
                buffer = Buffer.concat([buffer, textToBuffer(`   Adicionar: ${item.customizations.added.join(', ')}`)]);
                buffer = addLineFeed(buffer);
            }
            
            buffer = addLineFeeds(buffer, 1);
        });
    }
    
    // 7. Taxa de entrega (se houver)
    const deliveryFee = typeof orderData.deliveryFee === 'number' ? orderData.deliveryFee : parseFloat(orderData.deliveryFee) || 0;
    if (deliveryFee > 0) {
        const feeStr = deliveryFee.toFixed(2).replace('.', ',');
        buffer = Buffer.concat([buffer, textToBuffer(`Taxa de entrega: R$ ${feeStr}`)]);
        buffer = addLineFeeds(buffer, 1);
    }
    
    // 8. TOTAL (negrito, centralizado)
    buffer = addLineFeeds(buffer, 1);
    buffer = Buffer.concat([buffer, Commands.ALIGN_CENTER]);
    buffer = Buffer.concat([buffer, Commands.BOLD_ON]);
    buffer = Buffer.concat([buffer, textToBuffer('TOTAL')]);
    buffer = Buffer.concat([buffer, Commands.BOLD_OFF]);
    buffer = addLineFeed(buffer);
    
    if (orderData.total) {
        buffer = Buffer.concat([buffer, textToBuffer(`R$ ${orderData.total}`)]);
    }
    buffer = addLineFeeds(buffer, 2);
    
    // 9. Observações (se houver)
    if (orderData.notes) {
        buffer = Buffer.concat([buffer, Commands.ALIGN_LEFT]);
        buffer = Buffer.concat([buffer, Commands.BOLD_ON]);
        buffer = Buffer.concat([buffer, textToBuffer('OBSERVAÇÕES:')]);
        buffer = Buffer.concat([buffer, Commands.BOLD_OFF]);
        buffer = addLineFeed(buffer);
        buffer = Buffer.concat([buffer, textToBuffer(orderData.notes)]);
        buffer = addLineFeeds(buffer, 1);
    }
    
    // 10. Forma de pagamento
    if (orderData.paymentMethod) {
        buffer = Buffer.concat([buffer, Commands.ALIGN_LEFT]);
        buffer = Buffer.concat([buffer, Commands.BOLD_ON]);
        buffer = Buffer.concat([buffer, textToBuffer('FORMA DE PAGAMENTO:')]);
        buffer = Buffer.concat([buffer, Commands.BOLD_OFF]);
        buffer = addLineFeed(buffer);
        buffer = Buffer.concat([buffer, textToBuffer(orderData.paymentMethod)]);
        buffer = addLineFeed(buffer);
        
        if (orderData.changeAmount) {
            buffer = Buffer.concat([buffer, textToBuffer(`Valor pago: R$ ${orderData.changeAmount}`)]);
            buffer = addLineFeed(buffer);
        }
        
        if (orderData.change) {
            buffer = Buffer.concat([buffer, textToBuffer(`Troco: R$ ${orderData.change}`)]);
            buffer = addLineFeed(buffer);
        }
        
        buffer = addLineFeeds(buffer, 1);
    }
    
    // 11. Forma de entrega
    if (orderData.deliveryMethod) {
        buffer = Buffer.concat([buffer, Commands.ALIGN_LEFT]);
        buffer = Buffer.concat([buffer, Commands.BOLD_ON]);
        buffer = Buffer.concat([buffer, textToBuffer('FORMA DE ENTREGA:')]);
        buffer = Buffer.concat([buffer, Commands.BOLD_OFF]);
        buffer = addLineFeed(buffer);
        buffer = Buffer.concat([buffer, textToBuffer(orderData.deliveryMethod)]);
        buffer = addLineFeed(buffer);
        
        if (orderData.deliveryAddress) {
            buffer = Buffer.concat([buffer, textToBuffer(`Endereço: ${orderData.deliveryAddress}`)]);
            buffer = addLineFeed(buffer);
        }
        
        if (orderData.deliveryComplement) {
            buffer = Buffer.concat([buffer, textToBuffer(`Complemento: ${orderData.deliveryComplement}`)]);
            buffer = addLineFeed(buffer);
        }
        
        buffer = addLineFeeds(buffer, 1);
    }
    
    // 12. Rodapé
    buffer = addLineFeeds(buffer, 2);
    buffer = Buffer.concat([buffer, Commands.ALIGN_CENTER]);
    buffer = Buffer.concat([buffer, textToBuffer('Obrigado Pela Preferência!')]);
    buffer = addLineFeeds(buffer, 3);
    
    // 13. Cortar papel
    buffer = Buffer.concat([buffer, Commands.CUT_FULL]);
    
    return buffer;
}

module.exports = {
    generateESCPOS,
    Commands
};

