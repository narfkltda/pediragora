/**
 * WhatsApp Integration Module
 * 
 * This module handles the integration with WhatsApp for order checkout.
 * It formats the order message and generates a WhatsApp URL with the encoded message.
 * 
 * Function:
 * - sendToWhatsApp(phoneNumber, orderObject): Format order and redirect to WhatsApp
 */

/**
 * Send order to WhatsApp
 * 
 * Formats the order information into a readable message, encodes it, and redirects
 * to WhatsApp Web/App with the pre-filled message.
 * 
 * @param {string} phoneNumber - Phone number in format: DDD + number (e.g., "11999999999")
 * @param {Object} orderObject - Order object containing order details
 * @param {Array} orderObject.items - Array of items with name, quantity, and price
 * @param {number} orderObject.total - Total price of the order
 * @param {string} orderObject.customerName - Customer name (optional)
 * @param {string} orderObject.customerPhone - Customer phone (optional)
 * @param {string} orderObject.notes - Additional notes/observations (optional)
 * @param {string} orderObject.deliveryMethod - Delivery method (Retirar no local / Entrega) (optional)
 * @param {string} orderObject.deliveryAddress - Delivery address (if Entrega) (optional)
 * @param {string} orderObject.deliveryComplement - Delivery address complement (optional)
 * @param {string} orderObject.paymentMethod - Payment method (optional)
 * @param {string} orderObject.changeAmount - Amount paid for change calculation (optional)
 * @param {number} orderObject.change - Change amount (troco) (optional)
 */
function sendToWhatsApp(phoneNumber, orderObject) {
    if (!phoneNumber) {
        console.error('Phone number is required');
        alert('Número de WhatsApp não configurado!');
        return;
    }
    
    if (!orderObject || !orderObject.items || orderObject.items.length === 0) {
        console.error('Invalid order: order must have items');
        alert('Carrinho vazio!');
        return;
    }
    
    // Build the message
    let message = '🍽️ *NOVO PEDIDO*\n\n';
    
    // Add date and time
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR');
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    message += `📅 Data: ${date} às ${time}\n\n`;
    
    // Add customer information if provided
    if (orderObject.customerName) {
        message += `👤 *Cliente:* ${String(orderObject.customerName).toUpperCase()}\n`;
    }
    if (orderObject.customerPhone) {
        message += `📱 *Telefone:* ${orderObject.customerPhone}\n`;
    }
    if (orderObject.customerName || orderObject.customerPhone) {
        message += '\n';
    }
    
    // Add items list
    message += '📋 *ITENS:*\n';
    message += '─'.repeat(30) + '\n';
    
    orderObject.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. ${String(item.name).toUpperCase()}\n`;
        message += `   Qtd: ${item.quantity} x R$ ${item.price.toFixed(2)} = R$ ${itemTotal.toFixed(2)}\n`;
    });
    
    message += '─'.repeat(30) + '\n';
    
    // Add total
    message += `💰 *TOTAL: R$ ${orderObject.total.toFixed(2)}*\n\n`;
    
    // Add delivery method if provided
    if (orderObject.deliveryMethod && orderObject.deliveryMethod.trim()) {
        message += '🚚 *FORMA DE ENTREGA:*\n';
        message += `${String(orderObject.deliveryMethod).toUpperCase()}\n`;
        
        if (orderObject.deliveryMethod === 'Entrega' && orderObject.deliveryAddress) {
            message += `📍 *Endereço:* ${String(orderObject.deliveryAddress).toUpperCase()}\n`;
            if (orderObject.deliveryComplement && orderObject.deliveryComplement.trim()) {
                message += `   Complemento: ${String(orderObject.deliveryComplement).toUpperCase()}\n`;
            }
        }
        message += '\n';
    }
    
    // Add notes if provided
    if (orderObject.notes && orderObject.notes.trim()) {
        message += '📝 *OBSERVAÇÕES:*\n';
        message += `${String(orderObject.notes).toUpperCase()}\n\n`;
    }
    
    // Add payment method if provided
    if (orderObject.paymentMethod && orderObject.paymentMethod.trim()) {
        message += '💳 *FORMA DE PAGAMENTO:*\n';
        message += `${String(orderObject.paymentMethod).toUpperCase()}\n\n`;
        
        // Add change information if payment is cash
        if (orderObject.paymentMethod === 'Dinheiro' && orderObject.changeAmount) {
            const amountPaid = parseFloat(orderObject.changeAmount.replace(',', '.'));
            if (!isNaN(amountPaid) && amountPaid > 0) {
                message += `💵 *Valor pago: R$ ${amountPaid.toFixed(2)}*\n`;
                if (orderObject.change && orderObject.change > 0) {
                    message += `💰 *Troco: R$ ${orderObject.change.toFixed(2)}*\n\n`;
                } else if (amountPaid < orderObject.total) {
                    message += `⚠️ Valor insuficiente\n\n`;
                } else {
                    message += `💰 *Troco: R$ 0,00*\n\n`;
                }
            }
        }
    }
    
    // Add footer
    message += '─'.repeat(30) + '\n';
    message += 'Aguarde confirmação do pedido por favor!';
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Format phone number (ensure it starts with country code)
    // If phone number doesn't start with country code, add Brazil's code (55)
    let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    
    // If phone doesn't start with country code, assume it's Brazilian and add 55
    if (!formattedPhone.startsWith('55')) {
        formattedPhone = '55' + formattedPhone;
    }
    
    // Build WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab/window
    window.open(whatsappUrl, '_blank');
    
    console.log('WhatsApp URL generated:', whatsappUrl);
    console.log('Order message:', message);
}


