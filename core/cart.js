/**
 * Cart Module - Cart Management Logic
 * 
 * This module handles all cart operations using localStorage for persistence.
 * Cart data persists across page reloads.
 * 
 * Functions:
 * - addItem(item): Add an item to the cart
 * - removeItem(id): Remove an item from the cart by ID
 * - getCart(): Get all items in the cart
 * - clearCart(): Remove all items from the cart
 * - getTotal(): Calculate the total price of all items in the cart
 * - saveCart(): Save cart to localStorage
 * - loadCartFromStorage(): Load cart from localStorage
 * - saveCustomerData(name, notes): Save customer name and notes
 * - loadCustomerData(): Load customer name and notes
 */

// Storage keys
const STORAGE_KEYS = {
    CART: 'pediragora_cart',
    CUSTOMER_NAME: 'pediragora_customer_name',
    CUSTOMER_NOTES: 'pediragora_customer_notes',
    PAYMENT_METHOD: 'pediragora_payment_method',
    CHANGE_AMOUNT: 'pediragora_change_amount'
};

// In-memory cart storage
let cart = [];

/**
 * Load cart from localStorage on module initialization
 */
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Cart loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        cart = [];
    }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        console.log('Cart saved to localStorage');
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

/**
 * Save customer data (name and notes) to localStorage
 * 
 * @param {string} name - Customer name
 * @param {string} notes - Customer notes/observations
 */
function saveCustomerData(name, notes) {
    try {
        if (name) {
            localStorage.setItem(STORAGE_KEYS.CUSTOMER_NAME, name);
        } else {
            localStorage.removeItem(STORAGE_KEYS.CUSTOMER_NAME);
        }
        
        if (notes) {
            localStorage.setItem(STORAGE_KEYS.CUSTOMER_NOTES, notes);
        } else {
            localStorage.removeItem(STORAGE_KEYS.CUSTOMER_NOTES);
        }
        
        console.log('Customer data saved to localStorage');
    } catch (error) {
        console.error('Error saving customer data to localStorage:', error);
    }
}

/**
 * Load customer data from localStorage
 * 
 * @returns {Object} Object with name and notes properties
 */
function loadCustomerData() {
    try {
        return {
            name: localStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME) || '',
            notes: localStorage.getItem(STORAGE_KEYS.CUSTOMER_NOTES) || ''
        };
    } catch (error) {
        console.error('Error loading customer data from localStorage:', error);
        return { name: '', notes: '' };
    }
}

/**
 * Save payment method to localStorage
 * 
 * @param {string} method - Payment method (PIX, Dinheiro, Cartão)
 */
function savePaymentMethod(method) {
    try {
        if (method) {
            localStorage.setItem(STORAGE_KEYS.PAYMENT_METHOD, method);
        } else {
            localStorage.removeItem(STORAGE_KEYS.PAYMENT_METHOD);
        }
        console.log('Payment method saved to localStorage');
    } catch (error) {
        console.error('Error saving payment method to localStorage:', error);
    }
}

/**
 * Load payment method from localStorage
 * 
 * @returns {string} Payment method or empty string
 */
function loadPaymentMethod() {
    try {
        return localStorage.getItem(STORAGE_KEYS.PAYMENT_METHOD) || '';
    } catch (error) {
        console.error('Error loading payment method from localStorage:', error);
        return '';
    }
}

/**
 * Save change amount (valor pago) to localStorage
 * 
 * @param {string} amount - Amount paid (valor pago)
 */
function saveChangeAmount(amount) {
    try {
        if (amount) {
            localStorage.setItem(STORAGE_KEYS.CHANGE_AMOUNT, amount);
        } else {
            localStorage.removeItem(STORAGE_KEYS.CHANGE_AMOUNT);
        }
        console.log('Change amount saved to localStorage');
    } catch (error) {
        console.error('Error saving change amount to localStorage:', error);
    }
}

/**
 * Load change amount from localStorage
 * 
 * @returns {string} Change amount or empty string
 */
function loadChangeAmount() {
    try {
        return localStorage.getItem(STORAGE_KEYS.CHANGE_AMOUNT) || '';
    } catch (error) {
        console.error('Error loading change amount from localStorage:', error);
        return '';
    }
}

/**
 * Clear all cart and customer data from localStorage
 */
function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_KEYS.CART);
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER_NAME);
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER_NOTES);
        localStorage.removeItem(STORAGE_KEYS.PAYMENT_METHOD);
        localStorage.removeItem(STORAGE_KEYS.CHANGE_AMOUNT);
        console.log('All cart data cleared from localStorage');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

// Initialize: Load cart from localStorage when module loads
loadCartFromStorage();

/**
 * Add an item to the cart
 * If the item already exists, increase its quantity
 * 
 * @param {Object} item - The item to add
 * @param {string} item.id - Unique item identifier
 * @param {string} item.name - Item name
 * @param {number} item.price - Item price
 * @param {string} item.image - Item image path
 * @param {string} item.description - Item description (optional)
 * @param {string} item.category - Item category (optional)
 */
function addItem(item) {
    if (!item || !item.id) {
        console.error('Invalid item: item must have an id');
        return;
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        // Increase quantity if item already exists
        existingItem.quantity += 1;
    } else {
        // Add new item with quantity 1
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    saveCart(); // Persist to localStorage
    console.log('Item added to cart:', item.name);
}

/**
 * Remove an item from the cart by ID
 * 
 * @param {string} id - The ID of the item to remove
 */
function removeItem(id) {
    if (!id) {
        console.error('Invalid id: id is required');
        return;
    }
    
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== id);
    
    if (cart.length < initialLength) {
        saveCart(); // Persist to localStorage
        console.log('Item removed from cart:', id);
    } else {
        console.warn('Item not found in cart:', id);
    }
}

/**
 * Get all items in the cart
 * 
 * @returns {Array} Array of cart items
 */
function getCart() {
    return [...cart]; // Return a copy to prevent direct mutation
}

/**
 * Clear all items from the cart
 */
function clearCart() {
    cart = [];
    saveCart(); // Persist to localStorage
    console.log('Cart cleared');
}

/**
 * Calculate the total price of all items in the cart
 * 
 * @returns {number} Total price (sum of price * quantity for all items)
 */
function getTotal() {
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

/**
 * Get the total number of items in the cart (sum of quantities)
 * 
 * @returns {number} Total number of items
 */
function getItemCount() {
    return cart.reduce((count, item) => {
        return count + item.quantity;
    }, 0);
}

/**
 * Update the quantity of an item in the cart
 * 
 * @param {string} id - The ID of the item to update
 * @param {number} quantity - The new quantity (must be > 0)
 */
function updateItemQuantity(id, quantity) {
    if (!id) {
        console.error('Invalid id: id is required');
        return;
    }
    
    if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        removeItem(id);
        return;
    }
    
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.quantity = quantity;
        saveCart(); // Persist to localStorage
        console.log('Item quantity updated:', id, quantity);
    } else {
        console.warn('Item not found in cart:', id);
    }
}

/**
 * Increase the quantity of an item by 1
 * 
 * @param {string} id - The ID of the item
 */
function increaseItemQuantity(id) {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.quantity += 1;
        saveCart(); // Persist to localStorage
        console.log('Item quantity increased:', id, item.quantity);
    } else {
        console.warn('Item not found in cart:', id);
    }
}

/**
 * Decrease the quantity of an item by 1
 * If quantity becomes 0, the item is removed
 * 
 * @param {string} id - The ID of the item
 */
function decreaseItemQuantity(id) {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart(); // Persist to localStorage
            console.log('Item quantity decreased:', id, item.quantity);
        } else {
            // Remove item if quantity would become 0
            removeItem(id);
        }
    } else {
        console.warn('Item not found in cart:', id);
    }
}

