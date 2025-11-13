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
 * @param {string} orderObject.notes - Additional notes/observations (optional)
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
    
    // Add customer name if provided
    if (orderObject.customerName) {
        message += `👤 Cliente: ${orderObject.customerName}\n\n`;
    }
    
    // Add items list
    message += '📋 *ITENS:*\n';
    message += '─'.repeat(30) + '\n';
    
    orderObject.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name}\n`;
        message += `   Qtd: ${item.quantity} x R$ ${item.price.toFixed(2)} = R$ ${itemTotal.toFixed(2)}\n`;
    });
    
    message += '─'.repeat(30) + '\n';
    
    // Add total
    message += `💰 *TOTAL: R$ ${orderObject.total.toFixed(2)}*\n\n`;
    
    // Add notes if provided
    if (orderObject.notes && orderObject.notes.trim()) {
        message += '📝 *OBSERVAÇÕES:*\n';
        message += `${orderObject.notes}\n\n`;
    }
    
    // Add footer
    message += '─'.repeat(30) + '\n';
    message += 'Obrigado pelo pedido! 🎉';
    
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


