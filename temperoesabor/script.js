/**
 * Tempero & Sabor - Client Page Script
 * 
 * Core functionality implementation:
 * - Dynamic item rendering
 * - Category filtering
 * - Real-time search
 * - Cart system integration
 * - Customer data persistence
 * - WhatsApp checkout
 * - Firebase integration for dynamic menu loading
 */

// Import Firebase services
import { getAvailableProducts } from './services/products-service.js';
import { getRestaurantConfig } from './services/config-service.js';
import { getActiveIngredients } from './services/ingredients-service.js';

// Configuration
const CONFIG = {
    restaurantName: 'Tempero & Sabor',
    whatsappNumber: '67982077085', // Format: DDD + number (no spaces or special chars)
    logoPath: '../assets/images/TemperoESaborLogo.png',
    restaurantLatitude: -20.367082707152765,
    restaurantLongitude: -51.42205139592757,
    openingHours: {
        segunda: null, // Fechado na segunda-feira
        terca: { open: '19:00', close: '22:45' },
        quarta: { open: '19:00', close: '22:45' },
        quinta: { open: '19:00', close: '22:45' },
        sexta: { open: '19:00', close: '22:45' },
        sabado: { open: '19:00', close: '22:45' },
        domingo: { open: '19:00', close: '22:45' }
    }
};

// Test Mode - Para testar horários diferentes
const TEST_MODE = {
    enabled: true, // Modo teste ativado
    simulatedTime: '20:00' // Horário simulado para teste (formato HH:MM)
};

// Menu data - será carregado do Firebase ou usado como fallback
let MENU_DATA = {
    categories: ['Todos', 'Burguers', 'Hot-Dogs', 'Porções', 'Bebidas'],
    items: [
        {
            id: '1',
            name: 'VÓ MIMA',
            description: 'Pão, hambúrguer de carne, queijo mussarela, bacon e molho mima',
            price: 22.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_01_voMima.png'
        },
        {
            id: '2',
            name: 'VÔ LELEU',
            description: 'Pão, hambúrguer de carne, queijo mussarela, bacon, ovo, calabresa, alface, tomate e molho mima',
            price: 28.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_02_voLeleu.png'
        },
        {
            id: '3',
            name: 'VÓ ANA',
            description: 'Pão, hambúrguer de carne, queijo mussarela, bacon, alface, tomate e molho de churrasco',
            price: 24.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_03_voAna.png'
        },
        {
            id: '4',
            name: 'TIA TÁ',
            description: 'Pão, hambúrguer de carne, queijo mussarela, queijo cheddar, bacon, alface, tomate e molho de churrasco',
            price: 27.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_04_tiaTa.png'
        },
        {
            id: '5',
            name: 'TIO JE',
            description: 'Pão, hambúrguer de frango, queijo cheddar, bacon, alface, tomate e molho mima',
            price: 24.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_05_tioJe.png'
        },
        {
            id: '6',
            name: 'TIO LAN',
            description: 'Pão, hambúrguer de picanha, queijo cheddar, bacon e molho mima',
            price: 38.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_06_tioLan.png'
        },
        {
            id: '7',
            name: 'TIA PRI',
            description: 'Pão, 3 hambúrgueres de carne, camadas de queijo mussarela, queijo cheddar, bacon e molho mima',
            price: 43.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_07_tiaPri.png'
        },
        {
            id: '8',
            name: 'TIA TAY',
            description: 'Pão, hambúrguer de pernil, queijo mussarela, bacon, alface, tomate e molho de churrasco',
            price: 25.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_08_tiaTay.png'
        },
        {
            id: '9',
            name: 'VÔ LIÓ',
            description: 'Pão, hambúrguer de carne, queijo mussarela, bacon, ovo, cebola caramelizada, alface, tomate e molho mima',
            price: 28.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_09_voLio.png'
        },
        {
            id: '10',
            name: 'NINI',
            description: 'Pão brioche, hambúrguer de carne, queijo mussarela e molho mima',
            price: 20.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_10_voNini.png'
        },
        {
            id: '11',
            name: 'VÓ SOLIS',
            description: 'Pão, hambúrguer de carne, queijo mussarela, tomate, alface, cebola roxa e molho mima',
            price: 25.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_11_voSolis.png'
        },
        {
            id: '12',
            name: 'VÔ NILTON',
            description: 'Pão, hambúrguer de carne, queijo mussarela, alface, tomate, cebola roxa, picles e molho mima',
            price: 27.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_12_voNilton.png'
        },
        {
            id: '13',
            name: 'GÊMEAS LELA',
            description: 'Pão, duplo hambúrguer de carne, duplo queijo mussarela, onion rings e molho barbecue',
            price: 33.00,
            category: 'Burguers',
            image: '../assets/images/Burgers_13_gemeasLela.png'
        },
        {
            id: '14',
            name: 'HOT CHEDDAR',
            description: 'Pão, duas salsichas, queijo mussarela, cheddar, bacon e molho de churrasco',
            price: 22.00,
            category: 'Hot-Dogs',
            image: '../assets/images/HotDog_01_Cheddar.png'
        },
        {
            id: '15',
            name: 'HOT CATUPIRY',
            description: 'Pão, duas salsichas, queijo mussarela, catupiry, bacon e molho de churrasco',
            price: 22.00,
            category: 'Hot-Dogs',
            image: '../assets/images/HotDog_02_Catupiry.png'
        },
        {
            id: '16',
            name: 'BATATA FRITA 150 GRAMAS',
            description: 'Batata frita crocante 150 gramas',
            price: 17.00,
            category: 'Porções',
            image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3EBatata Frita%3C/text%3E%3C/svg%3E'
        },
        {
            id: '17',
            name: 'BATATA FRITA 300 GRAMAS COM CHEDDAR OU MUSSARELA E BACON',
            description: 'Batata frita 300 gramas com cheddar ou mussarela e bacon',
            price: 37.00,
            category: 'Porções',
            image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3EBatata Frita%3C/text%3E%3C/svg%3E'
        },
        {
            id: '18',
            name: 'BATATA FRITA 500 GRAMAS COM CHEDDAR OU MUSSARELA E BACON',
            description: 'Batata frita 500 gramas com cheddar ou mussarela e bacon',
            price: 45.00,
            category: 'Porções',
            image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3EBatata Frita%3C/text%3E%3C/svg%3E'
        },
        {
            id: '19',
            name: 'ONION RINGS 10 UNIDADES',
            description: 'Onion rings crocantes 10 unidades',
            price: 15.00,
            category: 'Porções',
            image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3EOnion Rings%3C/text%3E%3C/svg%3E'
        },
        {
            id: '20',
            name: 'LATA 310ML',
            description: 'LATA 310ML',
            price: 6.00,
            category: 'Bebidas',
            image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ELata 310ml%3C/text%3E%3C/svg%3E'
        },
        {
            id: '21',
            name: 'COCA 1L',
            description: 'COCA 1L',
            price: 10.00,
            category: 'Bebidas',
            image: '../assets/images/Bebida_01_Coca1L.png'
        },
        {
            id: '22',
            name: 'ANTÁRTICA 1L',
            description: 'ANTÁRTICA 1L',
            price: 8.00,
            category: 'Bebidas',
            image: '../assets/images/Bebida_02_Antartica1L.png'
        },
        {
            id: '23',
            name: 'FANTA 2L',
            description: 'FANTA 2L',
            price: 12.00,
            category: 'Bebidas',
            image: '../assets/images/Bebida_03_Fanta2L.png'
        },
        {
            id: '24',
            name: 'KUAT 2L',
            description: 'KUAT 2L',
            price: 12.00,
            category: 'Bebidas',
            image: '../assets/images/Bebida_04_Kuat2L.png'
        },
        {
            id: '25',
            name: 'COCA 2L',
            description: 'COCA 2L',
            price: 14.00,
            category: 'Bebidas',
            image: '../assets/images/Bebida_05_Coca2L.png'
        },
        {
            id: '26',
            name: 'COCA 2,5L',
            description: 'COCA 2,5L',
            price: 15.00,
            category: 'Bebidas',
            image: '../assets/images/Bebida_06_Coca2_5L.png'
        }
    ]
};

// Flag para indicar se os dados foram carregados do Firebase
let menuLoadedFromFirebase = false;

/**
 * Carregar menu do Firebase
 * Atualiza MENU_DATA com produtos do Firestore
 */
async function loadMenuFromFirebase() {
    try {
        console.log('Carregando produtos do Firebase...');
        const products = await getAvailableProducts();
        
        if (products && products.length > 0) {
            // Converter produtos do Firebase para o formato esperado
            MENU_DATA.items = products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description || '',
                price: product.price,
                category: product.category,
                image: product.image || ''
            }));
            
            // Extrair categorias únicas dos produtos
            const uniqueCategories = ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))];
            MENU_DATA.categories = uniqueCategories;
            
            menuLoadedFromFirebase = true;
            console.log(`✅ ${products.length} produtos carregados do Firebase`);
            
            // Renderizar após carregar
            if (categoryButtons && itemsGrid) {
                renderCategories();
                renderItems();
            }
        } else {
            console.warn('Nenhum produto encontrado no Firebase. Usando dados estáticos como fallback.');
            menuLoadedFromFirebase = false;
        }
    } catch (error) {
        console.error('Erro ao carregar produtos do Firebase:', error);
        console.log('Usando dados estáticos como fallback.');
        menuLoadedFromFirebase = false;
    }
}

/**
 * Carregar configurações do Firebase
 * Atualiza CONFIG com dados do Firestore
 */
async function loadConfigFromFirebase() {
    try {
        const config = await getRestaurantConfig();
        
        // Atualizar CONFIG com dados do Firebase
        if (config.restaurantName) CONFIG.restaurantName = config.restaurantName;
        if (config.whatsappNumber) CONFIG.whatsappNumber = config.whatsappNumber;
        if (config.restaurantLatitude) CONFIG.restaurantLatitude = config.restaurantLatitude;
        if (config.restaurantLongitude) CONFIG.restaurantLongitude = config.restaurantLongitude;
        if (config.openingHours) CONFIG.openingHours = config.openingHours;
        
        // Atualizar nome do restaurante na página se já estiver renderizado
        const restaurantNameEl = document.querySelector('.restaurant-name');
        if (restaurantNameEl) {
            restaurantNameEl.textContent = CONFIG.restaurantName;
        }
        
        console.log('✅ Configurações carregadas do Firebase');
    } catch (error) {
        console.error('Erro ao carregar configurações do Firebase:', error);
        console.log('Usando configurações estáticas.');
    }
}

// Available ingredients for customization
// Será carregado do Firebase ou usado como fallback
let AVAILABLE_INGREDIENTS = [
    { id: 'hamburger', name: 'Hamburger', price: 12.00 },
    { id: 'mussarela', name: 'Mussarela', price: 4.00 },
    { id: 'calabresa', name: 'Calabresa', price: 2.00 },
    { id: 'catupiry', name: 'Catupiry', price: 4.00 },
    { id: 'batata-palha', name: 'Batata Palha', price: 2.00 },
    { id: 'cebola-caramelizada', name: 'Cebola Caramelizada', price: 3.00 },
    { id: 'picles', name: 'Picles', price: 3.00 },
    { id: 'cheddar', name: 'Cheddar', price: 3.00 },
    { id: 'salada', name: 'Salada', price: 2.00 },
    { id: 'bacon', name: 'Bacon', price: 4.00 },
    { id: 'ovo', name: 'Ovo', price: 2.00 },
    { id: 'salsicha', name: 'Salsicha', price: 2.00 },
    { id: 'cebola-roxa', name: 'Cebola Roxa', price: 2.00 },
    { id: 'onion-rings', name: 'Onion Rings', price: 3.00 },
    { id: 'molho-mima', name: 'Molho Mima', price: 2.00 },
    { id: 'molho-barbecue', name: 'Molho Barbecue', price: 2.00 },
    { id: 'molho-churrasco', name: 'Molho de Churrasco', price: 2.00 }
];

// Flag para indicar se os ingredientes foram carregados do Firebase
let ingredientsLoadedFromFirebase = false;

/**
 * Carregar ingredientes do Firebase
 */
async function loadIngredientsFromFirebase() {
    try {
        console.log('Carregando ingredientes do Firebase...');
        const firebaseIngredients = await getActiveIngredients();
        
        if (firebaseIngredients && firebaseIngredients.length > 0) {
            AVAILABLE_INGREDIENTS = firebaseIngredients.map(ing => ({
                id: ing.id,
                name: ing.name,
                price: ing.price
            }));
            
            ingredientsLoadedFromFirebase = true;
            console.log(`✅ ${firebaseIngredients.length} ingredientes carregados do Firebase`);
        } else {
            console.warn('Nenhum ingrediente encontrado no Firebase. Usando dados estáticos como fallback.');
            ingredientsLoadedFromFirebase = false;
        }
    } catch (error) {
        console.error('Erro ao carregar ingredientes do Firebase:', error);
        console.log('Usando dados estáticos como fallback.');
        ingredientsLoadedFromFirebase = false;
    }
    
    // Sempre atualizar window.AVAILABLE_INGREDIENTS
    window.AVAILABLE_INGREDIENTS = AVAILABLE_INGREDIENTS;
}

// Make AVAILABLE_INGREDIENTS globally accessible for whatsapp.js
window.AVAILABLE_INGREDIENTS = AVAILABLE_INGREDIENTS;

// Security functions
/**
 * Sanitize HTML string by escaping special characters
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Sanitize user input by removing HTML tags and escaping special characters
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    // Remove HTML tags and escape special characters
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Validate Brazilian phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Brazilian phone: 10 digits (landline) or 11 digits (mobile with 9)
    return digitsOnly.length === 10 || digitsOnly.length === 11;
}

// State
let currentCategory = 'Todos';
let searchTerm = '';
let currentLayout = 'horizontal'; // Always horizontal

// DOM Elements - Will be initialized in DOMContentLoaded
let categoryButtons, itemsGrid, cartSidebar, cartItems, cartTotal, cartCount, cartToggle;
let mapToggle, closeCartBtn, mapsModal, mapsModalOverlay, mapsModalClose;
let mapsOptionGoogle, mapsOptionApple, alertModal, alertModalOverlay, alertModalClose;
let alertModalOk, alertModalTitle, alertModalMessage, pickupMapModal, pickupMapModalOverlay;
let pickupMapModalClose, pickupMapImage, pickupMapLink, pickupMapBtnGoogle, pickupMapBtnApple;
let quantityModal, quantityModalOverlay, quantityModalClose, quantityModalImage;
let quantityModalName, quantityModalDescription, quantityModalPriceValue, quantityBtnConfirm;
let customerNameInput, customerNotesInput, searchInput, searchClearBtn, paymentMethodInputs;
let changeField, changeAmountInput, changeResult, changeValue, openingHoursInfo;
let hoursOverlay, hoursSidebar, hoursContent, closeHoursBtn, cartOverlay, cartBackBtn;
let cartHeaderTitle, cartStep1, cartStep2, cartStep3, cartStep4, cartStep5;
let btnContinueStep1, btnContinueStep2, btnContinueStep3, btnContinueStep4, btnCheckoutSummary;
let deliveryMethodInputs, deliveryAddressField, deliveryAddressInput, deliveryComplementInput;
let deliveryFeeDisplay, customerPhoneInput, cartTotalStep4;
let summaryItems, summarySubtotal, summaryDeliveryFee, summaryDeliveryFeeValue, summaryTotal;
let summaryCustomerName, summaryCustomerPhone, summaryCustomerNotes, summaryNotesItem;
let summaryDeliveryMethod, summaryDeliveryAddress, summaryDeliveryComplement;
let summaryAddressItem, summaryComplementItem, summaryPaymentMethod, summaryChangeAmount;
let summaryChangeValue, summaryChangeItem, summaryChangeValueItem;
let layoutSelector, layoutBtnVertical, layoutBtnHorizontal;

// Delivery fee constant
const DELIVERY_FEE = 3.00;

// Quantity Modal state
let currentQuantityModalItem = null;
let currentQuantityModalIsBuyNow = false;
let currentQuantityModalCustomizations = {
    addedIngredients: {}, // { ingredientId: quantity }
    removedIngredients: [] // Array of ingredient IDs
};

// checkoutBtn removed - now using btnCheckoutSummary in step 5
const checkoutBtn = null; // Deprecated - button moved to step 5

// Cart step state
let currentCartStep = 1;
let scrollPosition = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all DOM elements
    categoryButtons = document.getElementById('category-buttons');
    itemsGrid = document.getElementById('items-grid');
    cartSidebar = document.getElementById('cart-sidebar');
    cartItems = document.getElementById('cart-items');
    cartTotal = document.getElementById('cart-total');
    cartCount = document.getElementById('cart-count');
    cartToggle = document.getElementById('cart-toggle');
    mapToggle = document.getElementById('map-toggle');
    closeCartBtn = document.getElementById('close-cart');
    mapsModal = document.getElementById('maps-modal');
    mapsModalOverlay = document.getElementById('maps-modal-overlay');
    mapsModalClose = document.getElementById('maps-modal-close');
    mapsOptionGoogle = document.getElementById('maps-option-google');
    mapsOptionApple = document.getElementById('maps-option-apple');
    alertModal = document.getElementById('alert-modal');
    alertModalOverlay = document.getElementById('alert-modal-overlay');
    alertModalClose = document.getElementById('alert-modal-close');
    alertModalOk = document.getElementById('alert-modal-ok');
    alertModalTitle = document.getElementById('alert-modal-title');
    alertModalMessage = document.getElementById('alert-modal-message');
    pickupMapModal = document.getElementById('pickup-map-modal');
    pickupMapModalOverlay = document.getElementById('pickup-map-modal-overlay');
    pickupMapModalClose = document.getElementById('pickup-map-modal-close');
    pickupMapImage = document.getElementById('pickup-map-image');
    pickupMapLink = document.getElementById('pickup-map-link');
    pickupMapBtnGoogle = document.getElementById('pickup-map-btn-google');
    pickupMapBtnApple = document.getElementById('pickup-map-btn-apple');
    quantityModal = document.getElementById('quantity-modal');
    quantityModalOverlay = document.getElementById('quantity-modal-overlay');
    quantityModalClose = document.getElementById('quantity-modal-close');
    quantityModalImage = document.getElementById('quantity-modal-image');
    quantityModalName = document.getElementById('quantity-modal-name');
    quantityModalDescription = document.getElementById('quantity-modal-description');
    quantityModalPriceValue = document.getElementById('quantity-modal-price-value');
    quantityBtnConfirm = document.getElementById('quantity-btn-confirm');
    if (!quantityBtnConfirm) {
        console.warn('quantity-btn-confirm button not found!');
    }
    customerNameInput = document.getElementById('customer-name');
    customerNotesInput = document.getElementById('customer-notes');
    searchInput = document.getElementById('search-input');
    searchClearBtn = document.getElementById('search-clear');
    paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
    changeField = document.getElementById('change-field');
    changeAmountInput = document.getElementById('change-amount');
    changeResult = document.getElementById('change-result');
    changeValue = document.getElementById('change-value');
    openingHoursInfo = document.getElementById('opening-hours-info');
    hoursOverlay = document.getElementById('hours-overlay');
    hoursSidebar = document.getElementById('hours-sidebar');
    hoursContent = document.getElementById('hours-content');
    closeHoursBtn = document.getElementById('close-hours');
    cartOverlay = document.getElementById('cart-overlay');
    cartBackBtn = document.getElementById('cart-back-btn');
    cartHeaderTitle = document.getElementById('cart-header-title');
    cartStep1 = document.getElementById('cart-step-1');
    cartStep2 = document.getElementById('cart-step-2');
    cartStep3 = document.getElementById('cart-step-3');
    cartStep4 = document.getElementById('cart-step-4');
    cartStep5 = document.getElementById('cart-step-5');
    btnContinueStep1 = document.getElementById('btn-continue-step1');
    btnContinueStep2 = document.getElementById('btn-continue-step2');
    btnContinueStep3 = document.getElementById('btn-continue-step3');
    btnContinueStep4 = document.getElementById('btn-continue-step4');
    btnCheckoutSummary = document.getElementById('btn-checkout-summary');
    deliveryMethodInputs = document.querySelectorAll('input[name="delivery-method"]');
    deliveryAddressField = document.getElementById('delivery-address-field');
    deliveryAddressInput = document.getElementById('delivery-address');
    deliveryComplementInput = document.getElementById('delivery-complement');
    deliveryFeeDisplay = document.getElementById('delivery-fee-display');
    customerPhoneInput = document.getElementById('customer-phone');
    cartTotalStep4 = document.getElementById('cart-total-step4');
    summaryItems = document.getElementById('summary-items');
    summarySubtotal = document.getElementById('summary-subtotal');
    summaryDeliveryFee = document.getElementById('summary-delivery-fee');
    summaryDeliveryFeeValue = document.getElementById('summary-delivery-fee-value');
    summaryTotal = document.getElementById('summary-total');
    summaryCustomerName = document.getElementById('summary-customer-name');
    summaryCustomerPhone = document.getElementById('summary-customer-phone');
    summaryCustomerNotes = document.getElementById('summary-customer-notes');
    summaryNotesItem = document.getElementById('summary-notes-item');
    summaryDeliveryMethod = document.getElementById('summary-delivery-method');
    summaryDeliveryAddress = document.getElementById('summary-delivery-address');
    summaryDeliveryComplement = document.getElementById('summary-delivery-complement');
    summaryAddressItem = document.getElementById('summary-address-item');
    summaryComplementItem = document.getElementById('summary-complement-item');
    summaryPaymentMethod = document.getElementById('summary-payment-method');
    summaryChangeAmount = document.getElementById('summary-change-amount');
    summaryChangeValue = document.getElementById('summary-change-value');
    summaryChangeItem = document.getElementById('summary-change-item');
    summaryChangeValueItem = document.getElementById('summary-change-value-item');
    layoutSelector = document.getElementById('layout-selector');
    layoutBtnVertical = document.getElementById('layout-btn-vertical');
    layoutBtnHorizontal = document.getElementById('layout-btn-horizontal');
    
    const restaurantNameEl = document.querySelector('.restaurant-name');
    if (restaurantNameEl) {
        restaurantNameEl.textContent = CONFIG.restaurantName;
    }
    
    const cart = getCart();
    const customerData = loadCustomerData();
    const paymentMethod = loadPaymentMethod();
    const changeAmount = loadChangeAmount();
    
    if (customerNameInput) {
        customerNameInput.value = customerData.name || '';
    }
    if (customerNotesInput) {
        customerNotesInput.value = customerData.notes || '';
    }
    
    const customerPhone = loadCustomerPhone();
    if (customerPhoneInput && customerPhone) {
        customerPhoneInput.value = customerPhone;
    }
    
    if (paymentMethod) {
        const selectedInput = document.querySelector(`input[name="payment-method"][value="${paymentMethod}"]`);
        if (selectedInput) {
            selectedInput.checked = true;
            if (paymentMethod === 'Dinheiro' && changeField) {
                changeField.style.display = 'block';
                if (changeAmount && changeAmountInput) {
                    changeAmountInput.value = changeAmount;
                    calculateChange();
                }
            }
        }
    }
    
    // Carregar dados do Firebase (assíncrono)
    loadMenuFromFirebase();
    loadIngredientsFromFirebase();
    loadConfigFromFirebase();
    
    // Renderizar com dados estáticos inicialmente (fallback)
    renderCategories();
    renderItems();
    renderCartUI();
    
    setupCategoryListeners();
    setupSearchListeners();
    setupCartToggleListeners();
    setupMapToggleListener();
    setupCartNavigationButtons();
    setupCustomerFieldListeners();
    setupPaymentMethodListeners();
    setupDeliveryMethodListeners();
    setupHoursModalListeners();
    setupAlertModalListeners();
    setupPickupMapModalListeners();
    setupQuantityModalListeners();
    renderOpeningHours();
    
    // Always use horizontal layout
    itemsGrid.classList.add('horizontal');
    
    // Initialize cart to step 1
    goToCartStep(1);
});

/**
 * Render category filter buttons
 */
function renderCategories() {
    categoryButtons.innerHTML = '';
    
    MENU_DATA.categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        if (category === currentCategory) {
            btn.classList.add('active');
        }
        btn.setAttribute('data-category', category);
        categoryButtons.appendChild(btn);
    });
}

/**
 * Render menu items dynamically with animations
 */
function renderItems() {
    // If there are existing items, fade them out first
    const existingItems = itemsGrid.querySelectorAll('.item-card');
    if (existingItems.length > 0) {
        // Add fade-out class to existing items
        existingItems.forEach(card => {
            card.style.animation = 'fadeOut 0.3s ease forwards';
        });
        
        // Add fade-out class to grid
        itemsGrid.classList.add('fade-out');
        
        // Wait for fade-out animation to complete, then clear and render new items
        setTimeout(() => {
            itemsGrid.innerHTML = '';
            itemsGrid.classList.remove('fade-out');
            renderNewItems();
        }, 300);
    } else {
        // No existing items, render immediately
        itemsGrid.innerHTML = '';
        renderNewItems();
    }
}

/**
 * Render new items with fade-in animation
 */
function renderNewItems() {
    let filteredItems = currentCategory === 'Todos' 
        ? MENU_DATA.items 
        : MENU_DATA.items.filter(item => item.category === currentCategory);
    
    if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filteredItems = filteredItems.filter(item => {
            const nameMatch = item.name.toLowerCase().includes(searchLower);
            const descMatch = item.description.toLowerCase().includes(searchLower);
            const categoryMatch = item.category.toLowerCase().includes(searchLower);
            return nameMatch || descMatch || categoryMatch;
        });
    }
    
    if (filteredItems.length === 0) {
        const message = searchTerm.trim() 
            ? 'Nenhum item encontrado com essa busca.'
            : 'Nenhum item encontrado nesta categoria.';
        const messageEl = document.createElement('p');
        messageEl.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px; color: #999; opacity: 0; animation: fadeInUp 0.5s ease forwards;';
        messageEl.textContent = message;
        itemsGrid.appendChild(messageEl);
        return;
    }
    
    // Add items with staggered delay for cascade effect
    filteredItems.forEach((item, index) => {
        const card = createItemCard(item);
        // Reset animation and add delay for cascade effect
        card.style.animation = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        itemsGrid.appendChild(card);
        
        // Trigger animation with delay
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        }, index * 50); // 50ms delay between each item
    });
}

/**
 * Format item name with number prefix
 */
function formatItemName(item) {
    // Don't add ID prefix for Bebidas category
    if (item.category === 'Bebidas') {
        return item.name;
    }
    const number = item.id.padStart(2, '0');
    return `${number} - ${item.name}`;
}

/**
 * Create an item card element
 */
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    // Always add horizontal class
    card.classList.add('horizontal');
    
    const formattedName = formatItemName(item);
    
    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'item-image-container';
    // Add specific class for hot dog containers
    if (item.category === 'Hot-Dogs') {
        imageContainer.classList.add('hotdog-container');
    }
    
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = sanitizeHTML(item.name);
    img.className = 'item-image';
    // Add specific class for hot dog images
    if (item.category === 'Hot-Dogs') {
        img.classList.add('hotdog-image');
    }
    img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ESem Imagem%3C/text%3E%3C/svg%3E';
    };
    imageContainer.appendChild(img);
    
    // Content container (for title and description only)
    const contentContainer = document.createElement('div');
    contentContainer.className = 'item-content';
    
    const title = document.createElement('h3');
    title.className = 'item-title';
    title.textContent = formattedName;
    
    const description = document.createElement('p');
    description.className = 'item-description';
    description.textContent = item.description;
    
    contentContainer.appendChild(title);
    contentContainer.appendChild(description);
    
    // Price and actions container (price + buttons on same line) - below the main content
    const priceActionsContainer = document.createElement('div');
    priceActionsContainer.className = 'item-price-actions';
    
    const price = document.createElement('div');
    price.className = 'item-price';
    price.textContent = `R$ ${item.price.toFixed(2)}`;
    
    const buyNowBtn = document.createElement('button');
    buyNowBtn.className = 'btn-buy-now';
    buyNowBtn.setAttribute('data-item-id', item.id);
    buyNowBtn.textContent = 'Pedir Agora';
    buyNowBtn.addEventListener('click', () => {
        // Verificar se pode comprar antes de abrir modal
        const purchaseCheck = checkIfCanPurchase();
        if (!purchaseCheck.canPurchase) {
            showAlertModal('Aviso', purchaseCheck.message);
            return;
        }
        // Abrir modal de quantidade
        showQuantityModal(item, true);
    });
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-cart';
    addBtn.setAttribute('data-item-id', item.id);
    addBtn.setAttribute('aria-label', 'Adicionar ao Carrinho');
    addBtn.setAttribute('title', 'Adicionar ao Carrinho');
    // Add text and cart icon SVG
    addBtn.innerHTML = '<span>Adicionar</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
    addBtn.addEventListener('click', () => {
        // Verificar se pode comprar antes de abrir modal
        const purchaseCheck = checkIfCanPurchase();
        if (!purchaseCheck.canPurchase) {
            showAlertModal('Aviso', purchaseCheck.message);
            return;
        }
        // Abrir modal de quantidade
        showQuantityModal(item, false);
    });
    
    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'item-buttons';
    buttonsContainer.appendChild(buyNowBtn);
    buttonsContainer.appendChild(addBtn);
    
    // Add price and buttons to price-actions container
    priceActionsContainer.appendChild(price);
    priceActionsContainer.appendChild(buttonsContainer);
    
    // Always use horizontal layout: create top section with content and image, then price-actions below
    const topSection = document.createElement('div');
    topSection.className = 'item-top-section';
    topSection.appendChild(contentContainer);
    topSection.appendChild(imageContainer);
    
    card.appendChild(topSection);
    card.appendChild(priceActionsContainer);
    
    return card;
}

/**
 * Setup category filter listeners
 */
function setupCategoryListeners() {
    categoryButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            const category = e.target.getAttribute('data-category');
            
            // Add click animation to button
            e.target.classList.add('clicked');
            
            // Remove animation class after animation completes
            e.target.addEventListener('animationend', function handler() {
                e.target.classList.remove('clicked');
                e.target.removeEventListener('animationend', handler);
            });
            
            currentCategory = category;
            renderCategories();
            renderItems();
        }
    });
}

/**
 * Save layout preference to localStorage
 */
function saveLayoutPreference(layout) {
    try {
        localStorage.setItem('pediragora_layout', layout);
    } catch (error) {
        console.error('Error saving layout preference:', error);
    }
}

/**
 * Load layout preference from localStorage
 */
function loadLayoutPreference() {
    try {
        return localStorage.getItem('pediragora_layout') || 'vertical';
    } catch (error) {
        console.error('Error loading layout preference:', error);
        return 'vertical';
    }
}

/**
 * Set layout and update UI
 */
function setLayout(layout, savePreference = true) {
    if (layout !== 'vertical' && layout !== 'horizontal') {
        return;
    }
    
    currentLayout = layout;
    
    // Update grid class
    if (layout === 'horizontal') {
        itemsGrid.classList.add('horizontal');
    } else {
        itemsGrid.classList.remove('horizontal');
    }
    
    // Update button states
    if (layoutBtnVertical && layoutBtnHorizontal) {
        if (layout === 'vertical') {
            layoutBtnVertical.classList.add('active');
            layoutBtnHorizontal.classList.remove('active');
        } else {
            layoutBtnVertical.classList.remove('active');
            layoutBtnHorizontal.classList.add('active');
        }
    }
    
    // Save preference
    if (savePreference) {
        saveLayoutPreference(layout);
    }
    
    // Re-render items with new layout
    renderItems();
}

/**
 * Setup layout selector listeners
 */
function setupLayoutSelectorListeners() {
    if (!layoutSelector) return;
    
    layoutSelector.addEventListener('click', (e) => {
        if (e.target.closest('.layout-btn')) {
            const btn = e.target.closest('.layout-btn');
            const layout = btn.getAttribute('data-layout');
            if (layout && layout !== currentLayout) {
                setLayout(layout);
            }
        }
    });
}

/**
 * Setup search listeners
 */
function setupSearchListeners() {
    searchInput.addEventListener('input', () => {
        searchTerm = searchInput.value;
        updateSearchClearButton();
        renderItems();
    });
    
    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchTerm = '';
        updateSearchClearButton();
        renderItems();
    });
}

/**
 * Update search clear button visibility
 */
function updateSearchClearButton() {
    searchClearBtn.style.display = searchTerm.trim() ? 'flex' : 'none';
}

/**
 * Go to specific cart step
 */
function goToCartStep(step) {
    // Hide all steps
    if (cartStep1) cartStep1.style.display = 'none';
    if (cartStep2) cartStep2.style.display = 'none';
    if (cartStep3) cartStep3.style.display = 'none';
    if (cartStep4) cartStep4.style.display = 'none';
    if (cartStep5) cartStep5.style.display = 'none';
    
    // Show selected step
    if (step === 1 && cartStep1) {
        cartStep1.style.display = 'flex';
        if (cartHeaderTitle) cartHeaderTitle.textContent = 'Carrinho';
        if (cartBackBtn) cartBackBtn.style.display = 'none';
        currentCartStep = 1;
        // Step 1: Always show total without delivery fee
        if (cartTotal) {
            cartTotal.textContent = getTotal().toFixed(2);
        }
    } else if (step === 2 && cartStep2) {
        cartStep2.style.display = 'flex';
        if (cartHeaderTitle) cartHeaderTitle.textContent = 'Forma de Entrega';
        if (cartBackBtn) cartBackBtn.style.display = 'flex';
        currentCartStep = 2;
        // Update delivery fee display
        updateDeliveryFeeDisplay();
    } else if (step === 3 && cartStep3) {
        cartStep3.style.display = 'flex';
        if (cartHeaderTitle) cartHeaderTitle.textContent = 'Seus Dados';
        if (cartBackBtn) cartBackBtn.style.display = 'flex';
        currentCartStep = 3;
    } else if (step === 4 && cartStep4) {
        cartStep4.style.display = 'flex';
        if (cartHeaderTitle) cartHeaderTitle.textContent = 'Pagamento';
        if (cartBackBtn) cartBackBtn.style.display = 'flex';
        currentCartStep = 4;
        // Update total in step 4
        if (cartTotalStep4) cartTotalStep4.textContent = getTotalWithDeliveryFee().toFixed(2);
    } else if (step === 5 && cartStep5) {
        cartStep5.style.display = 'flex';
        if (cartHeaderTitle) cartHeaderTitle.textContent = 'Resumo do Pedido';
        if (cartBackBtn) cartBackBtn.style.display = 'flex';
        currentCartStep = 5;
        // Render order summary
        renderOrderSummary();
    }
}

/**
 * Render order summary in step 5
 */
function renderOrderSummary() {
    try {
        const cart = getCart();
        const baseTotal = getTotal();
        const totalWithFee = getTotalWithDeliveryFee();
        const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
        const isDelivery = selectedDelivery && selectedDelivery.value === 'Entrega';
        const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
        
        // Render items
        if (summaryItems) {
            summaryItems.innerHTML = '';
            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'summary-item';
                
                const itemNameContainer = document.createElement('div');
                itemNameContainer.className = 'summary-item-name-container';
                
                const itemName = document.createElement('span');
                itemName.className = 'summary-item-name';
                const itemNameText = formatItemName ? formatItemName(item) : item.name;
                itemName.textContent = itemNameText;
                itemNameContainer.appendChild(itemName);
                
                // Add customizations as separate elements below the name
                const customizationsData = item.customizations ? getCustomizationsData(item.customizations) : { removed: [], added: [] };
                if (customizationsData.removed.length > 0 || customizationsData.added.length > 0) {
                    const customizationsDiv = document.createElement('div');
                    customizationsDiv.className = 'summary-item-customizations';
                    
                    if (customizationsData.removed.length > 0) {
                        const removedDiv = document.createElement('div');
                        removedDiv.className = 'summary-item-removed';
                        removedDiv.textContent = `Remover: ${customizationsData.removed.join(', ')}`;
                        customizationsDiv.appendChild(removedDiv);
                    }
                    
                    if (customizationsData.added.length > 0) {
                        const addedDiv = document.createElement('div');
                        addedDiv.className = 'summary-item-added';
                        addedDiv.textContent = `Adicionar: ${customizationsData.added.join(', ')}`;
                        customizationsDiv.appendChild(addedDiv);
                    }
                    
                    itemNameContainer.appendChild(customizationsDiv);
                }
                
                const itemDetails = document.createElement('span');
                itemDetails.className = 'summary-item-details';
                const itemTotalPrice = calculateItemTotalPrice(item);
                const itemSubtotal = itemTotalPrice * item.quantity;
                itemDetails.textContent = `${item.quantity}x R$ ${itemTotalPrice.toFixed(2)} = R$ ${itemSubtotal.toFixed(2)}`;
                
                itemDiv.appendChild(itemNameContainer);
                itemDiv.appendChild(itemDetails);
                summaryItems.appendChild(itemDiv);
            });
        }
        
        // Render subtotal
        if (summarySubtotal) {
            summarySubtotal.textContent = `R$ ${baseTotal.toFixed(2).replace('.', ',')}`;
        }
        
        // Render delivery fee
        if (summaryDeliveryFee && summaryDeliveryFeeValue) {
            if (isDelivery) {
                summaryDeliveryFee.style.display = 'flex';
                summaryDeliveryFeeValue.textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
            } else {
                summaryDeliveryFee.style.display = 'none';
            }
        }
        
        // Render total
        if (summaryTotal) {
            summaryTotal.textContent = `R$ ${totalWithFee.toFixed(2).replace('.', ',')}`;
        }
        
        // Render customer data
        const customerNameInput = document.getElementById('customer-name');
        const customerPhoneInput = document.getElementById('customer-phone');
        const customerNotesInput = document.getElementById('customer-notes');
        
        if (summaryCustomerName && customerNameInput) {
            const name = sanitizeInput(customerNameInput.value.trim()).toUpperCase();
            summaryCustomerName.textContent = name || '-';
        }
        
        if (summaryCustomerPhone && customerPhoneInput) {
            const phone = sanitizeInput(customerPhoneInput.value.trim());
            summaryCustomerPhone.textContent = phone || '-';
        }
        
        if (summaryCustomerNotes && summaryNotesItem && customerNotesInput) {
            const notes = sanitizeInput(customerNotesInput.value.trim()).toUpperCase();
            if (notes) {
                summaryCustomerNotes.textContent = notes;
                summaryNotesItem.style.display = 'flex';
            } else {
                summaryNotesItem.style.display = 'none';
            }
        }
        
        // Render delivery info
        if (summaryDeliveryMethod && selectedDelivery) {
            summaryDeliveryMethod.textContent = selectedDelivery.value;
        }
        
        if (isDelivery && deliveryAddressInput) {
            const address = sanitizeInput(deliveryAddressInput.value.trim()).toUpperCase();
            const complement = deliveryComplementInput ? sanitizeInput(deliveryComplementInput.value.trim()).toUpperCase() : '';
            
            if (summaryDeliveryAddress && summaryAddressItem) {
                summaryDeliveryAddress.textContent = address || '-';
                summaryAddressItem.style.display = 'flex';
            }
            
            if (summaryDeliveryComplement && summaryComplementItem) {
                if (complement) {
                    summaryDeliveryComplement.textContent = complement;
                    summaryComplementItem.style.display = 'flex';
                } else {
                    summaryComplementItem.style.display = 'none';
                }
            }
        } else {
            if (summaryAddressItem) summaryAddressItem.style.display = 'none';
            if (summaryComplementItem) summaryComplementItem.style.display = 'none';
        }
        
        // Render payment info
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (summaryPaymentMethod && selectedPaymentMethod) {
            summaryPaymentMethod.textContent = selectedPaymentMethod.value;
        }
        
        // Render change info if cash
        if (selectedPaymentMethod && selectedPaymentMethod.value === 'Dinheiro') {
            const changeAmountInput = document.getElementById('change-amount');
            if (changeAmountInput && changeAmountInput.value) {
                const amountStr = changeAmountInput.value.replace(',', '.').trim();
                const amount = parseFloat(amountStr);
                
                if (!isNaN(amount) && amount > 0) {
                    if (summaryChangeAmount && summaryChangeItem) {
                        summaryChangeAmount.textContent = `R$ ${amount.toFixed(2).replace('.', ',')}`;
                        summaryChangeItem.style.display = 'flex';
                    }
                    
                    if (summaryChangeValue && summaryChangeValueItem) {
                        if (amount >= totalWithFee) {
                            const change = amount - totalWithFee;
                            summaryChangeValue.textContent = `R$ ${change.toFixed(2).replace('.', ',')}`;
                            summaryChangeValueItem.style.display = 'flex';
                        } else {
                            summaryChangeValue.textContent = 'Valor insuficiente';
                            summaryChangeValueItem.style.display = 'flex';
                        }
                    }
                } else {
                    if (summaryChangeItem) summaryChangeItem.style.display = 'none';
                    if (summaryChangeValueItem) summaryChangeValueItem.style.display = 'none';
                }
            } else {
                if (summaryChangeItem) summaryChangeItem.style.display = 'none';
                if (summaryChangeValueItem) summaryChangeValueItem.style.display = 'none';
            }
        } else {
            if (summaryChangeItem) summaryChangeItem.style.display = 'none';
            if (summaryChangeValueItem) summaryChangeValueItem.style.display = 'none';
        }
    } catch (error) {
        console.error('Error rendering order summary:', error);
    }
}

/**
 * Get total with delivery fee if delivery is selected
 */
function getTotalWithDeliveryFee() {
    const baseTotal = getTotal();
    const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
    const isDelivery = selectedDelivery && selectedDelivery.value === 'Entrega';
    return baseTotal + (isDelivery ? DELIVERY_FEE : 0);
}

/**
 * Update delivery fee display based on selected delivery method
 */
function updateDeliveryFeeDisplay() {
    const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
    const isDelivery = selectedDelivery && selectedDelivery.value === 'Entrega';
    
    if (deliveryFeeDisplay) {
        if (isDelivery) {
            deliveryFeeDisplay.style.display = 'block';
        } else {
            deliveryFeeDisplay.style.display = 'none';
        }
    }
    
    // Update total display in step 1 if visible (without delivery fee)
    if (cartTotal && cartStep1 && cartStep1.style.display !== 'none') {
        cartTotal.textContent = getTotal().toFixed(2);
    }
}

/**
 * Next step
 */
function nextCartStep() {
    if (currentCartStep === 1) {
        const cart = getCart();
        if (cart.length === 0) {
            showAlertModal('Aviso', 'Adicione itens ao carrinho antes de continuar');
            return;
        }
        goToCartStep(2);
    } else if (currentCartStep === 2) {
        const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
        if (!selectedDelivery) {
            showAlertModal('Aviso', 'Selecione uma forma de entrega');
            return;
        }
        if (selectedDelivery.value === 'Entrega') {
            if (!deliveryAddressInput.value.trim()) {
                showAlertModal('Aviso', 'Informe o endereço de entrega');
                return;
            }
        }
        goToCartStep(3);
    } else if (currentCartStep === 3) {
        const customerNameInput = document.getElementById('customer-name');
        const customerPhoneInput = document.getElementById('customer-phone');
        
        const sanitizedName = sanitizeInput(customerNameInput.value.trim());
        const sanitizedPhone = customerPhoneInput ? sanitizeInput(customerPhoneInput.value.trim()) : '';
        
        if (!sanitizedName) {
            showAlertModal('Aviso', 'Informe seu nome');
            return;
        }
        
        if (!sanitizedPhone) {
            showAlertModal('Aviso', 'Informe seu telefone');
            return;
        }
        
        // Validate phone format
        if (!validatePhone(sanitizedPhone)) {
            showAlertModal('Aviso', 'Telefone inválido. Informe um telefone válido (10 ou 11 dígitos)');
            return;
        }
        
        goToCartStep(4);
    } else if (currentCartStep === 4) {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPaymentMethod) {
            showAlertModal('Aviso', 'Selecione uma forma de pagamento');
            return;
        }
        goToCartStep(5);
    }
}

/**
 * Previous step
 */
function prevCartStep() {
    if (currentCartStep === 2) {
        goToCartStep(1);
    } else if (currentCartStep === 3) {
        goToCartStep(2);
    } else if (currentCartStep === 4) {
        goToCartStep(3);
    } else if (currentCartStep === 5) {
        goToCartStep(4);
    }
}

/**
 * Open cart
 */
function openCart() {
    // Check if cartSidebar exists
    if (!cartSidebar) {
        console.error('Cart sidebar not found');
        return;
    }
    
    // Save current scroll position
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop || window.scrollY;
    
    cartSidebar.classList.add('open');
    if (cartOverlay) {
        cartOverlay.classList.add('active');
    }
    // Reset to step 1
    goToCartStep(1);
    
    // Prevent body and html scroll completely - Mobile optimized
    document.body.classList.add('cart-open');
    document.documentElement.classList.add('cart-open');
    document.body.style.top = `-${scrollPosition}px`;
    
    // Additional mobile fixes
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
}

/**
 * Close cart
 */
function closeCart() {
    if (!cartSidebar) {
        return;
    }
    
    cartSidebar.classList.remove('open');
    if (cartOverlay) {
        cartOverlay.classList.remove('active');
    }
    // Reset to step 1
    goToCartStep(1);
    
    // Restore body and html scroll - Mobile optimized
    document.body.classList.remove('cart-open');
    document.documentElement.classList.remove('cart-open');
    
    // Remove inline styles
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.height = '';
    
    // Restore scroll position - Use requestAnimationFrame for better mobile support
    requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
        // Force scroll on mobile
        if (window.pageYOffset !== scrollPosition) {
            document.documentElement.scrollTop = scrollPosition;
            document.body.scrollTop = scrollPosition;
        }
    });
}

/**
 * Setup delivery method listeners
 */
function setupDeliveryMethodListeners() {
    deliveryMethodInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) {
                saveDeliveryMethod(input.value);
                if (input.value === 'Entrega') {
                    deliveryAddressField.style.display = 'block';
                } else {
                    deliveryAddressField.style.display = 'none';
                    deliveryAddressInput.value = '';
                    deliveryComplementInput.value = '';
                    saveDeliveryAddress('');
                    saveDeliveryComplement('');
                }
                // Update delivery fee display and total
                updateDeliveryFeeDisplay();
                // Update total in step 1 if visible (without delivery fee)
                if (cartTotal && cartStep1 && cartStep1.style.display !== 'none') {
                    cartTotal.textContent = getTotal().toFixed(2);
                }
                // Update total in step 4 if visible
                if (cartTotalStep4 && cartStep4.style.display !== 'none') {
                    cartTotalStep4.textContent = getTotalWithDeliveryFee().toFixed(2);
                }
                // Recalculate change if payment method is cash and amount is entered
                const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
                if (paymentMethod && paymentMethod.value === 'Dinheiro' && changeAmountInput && changeAmountInput.value) {
                    calculateChange();
                }
            }
        });
    });
    
    // Save address and complement on input
    if (deliveryAddressInput) {
        deliveryAddressInput.addEventListener('input', () => {
            saveDeliveryAddress(deliveryAddressInput.value.trim());
        });
    }
    
    if (deliveryComplementInput) {
        deliveryComplementInput.addEventListener('input', () => {
            saveDeliveryComplement(deliveryComplementInput.value.trim());
        });
    }
    
    // Load saved delivery data
    const savedDeliveryMethod = loadDeliveryMethod();
    if (savedDeliveryMethod) {
        const savedInput = document.querySelector(`input[name="delivery-method"][value="${savedDeliveryMethod}"]`);
        if (savedInput) {
            savedInput.checked = true;
            if (savedDeliveryMethod === 'Entrega') {
                deliveryAddressField.style.display = 'block';
                updateDeliveryFeeDisplay();
                const savedAddress = loadDeliveryAddress();
                const savedComplement = loadDeliveryComplement();
                if (deliveryAddressInput && savedAddress) {
                    deliveryAddressInput.value = savedAddress;
                }
                if (deliveryComplementInput && savedComplement) {
                    deliveryComplementInput.value = savedComplement;
                }
            }
        }
    }
}

/**
 * Setup cart toggle listeners
 */
function setupCartToggleListeners() {
    if (!cartToggle) {
        console.error('Cart toggle button not found');
        return;
    }
    
    cartToggle.addEventListener('click', () => {
        // Verificar se pode comprar (horário de atendimento) antes de abrir carrinho
        const purchaseCheck = checkIfCanPurchase();
        if (!purchaseCheck.canPurchase) {
            showAlertModal('Aviso', purchaseCheck.message);
            return;
        }
        openCart();
    });
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            closeCart();
        });
    }
    
    // Close cart when clicking overlay
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            closeCart();
        });
    }
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768 && 'ontouchstart' in window);
}

/**
 * Open Google Maps
 */
function openGoogleMaps(lat, lng) {
    // Try to open Google Maps app first, fallback to web
    const googleMapsAppUrl = `comgooglemaps://?q=${lat},${lng}`;
    const googleMapsWebUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    // Try app first
    const appWindow = window.open(googleMapsAppUrl, '_blank');
    
    // If app doesn't open (blocked or not installed), use web
    setTimeout(() => {
        if (!appWindow || appWindow.closed || typeof appWindow.closed === 'undefined') {
            window.open(googleMapsWebUrl, '_blank', 'noopener,noreferrer');
        }
    }, 500);
}

/**
 * Open Apple Maps
 */
function openAppleMaps(lat, lng) {
    // Try to open Apple Maps app first, fallback to web
    const appleMapsAppUrl = `maps://?q=${lat},${lng}`;
    const appleMapsWebUrl = `http://maps.apple.com/?q=${lat},${lng}`;
    
    // Try app first
    const appWindow = window.open(appleMapsAppUrl, '_blank');
    
    // If app doesn't open (blocked or not installed), use web
    setTimeout(() => {
        if (!appWindow || appWindow.closed || typeof appWindow.closed === 'undefined') {
            window.open(appleMapsWebUrl, '_blank', 'noopener,noreferrer');
        }
    }, 500);
}

/**
 * Show maps selection modal
 */
function showMapsModal() {
    if (mapsModal && mapsModalOverlay) {
        mapsModal.classList.add('active');
        mapsModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide maps selection modal
 */
function hideMapsModal() {
    if (mapsModal && mapsModalOverlay) {
        mapsModal.classList.remove('active');
        mapsModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Setup map toggle listener
 */
function setupMapToggleListener() {
    if (mapToggle) {
        mapToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const lat = CONFIG.restaurantLatitude;
            const lng = CONFIG.restaurantLongitude;
            
            // On mobile, show modal to choose app
            if (isMobileDevice()) {
                showMapsModal();
            } else {
                // On desktop, open Google Maps directly
                const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                const newWindow = window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    window.location.href = googleMapsUrl;
                }
            }
        });
    }
    
    // Setup modal listeners
    if (mapsModalClose) {
        mapsModalClose.addEventListener('click', hideMapsModal);
    }
    
    if (mapsModalOverlay) {
        mapsModalOverlay.addEventListener('click', hideMapsModal);
    }
    
    if (mapsOptionGoogle) {
        mapsOptionGoogle.addEventListener('click', () => {
            const lat = CONFIG.restaurantLatitude;
            const lng = CONFIG.restaurantLongitude;
            hideMapsModal();
            openGoogleMaps(lat, lng);
        });
    }
    
    if (mapsOptionApple) {
        mapsOptionApple.addEventListener('click', () => {
            const lat = CONFIG.restaurantLatitude;
            const lng = CONFIG.restaurantLongitude;
            hideMapsModal();
            openAppleMaps(lat, lng);
        });
    }
}

/**
 * Show alert modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 */
function showAlertModal(title, message) {
    if (alertModal && alertModalOverlay && alertModalTitle && alertModalMessage) {
        alertModalTitle.textContent = title || 'Aviso';
        alertModalMessage.textContent = message || '';
        alertModal.classList.add('active');
        alertModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide alert modal
 */
function hideAlertModal() {
    if (alertModal && alertModalOverlay) {
        alertModal.classList.remove('active');
        alertModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Setup alert modal listeners
 */
function setupAlertModalListeners() {
    if (alertModalClose) {
        alertModalClose.addEventListener('click', hideAlertModal);
    }
    
    if (alertModalOverlay) {
        alertModalOverlay.addEventListener('click', hideAlertModal);
    }
    
    if (alertModalOk) {
        alertModalOk.addEventListener('click', hideAlertModal);
    }
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && alertModal && alertModal.classList.contains('active')) {
            hideAlertModal();
        }
    });
}

/**
 * Show pickup map modal
 */
function showPickupMapModal() {
    if (pickupMapModal && pickupMapModalOverlay && pickupMapImage && pickupMapLink) {
        const lat = CONFIG.restaurantLatitude;
        const lng = CONFIG.restaurantLongitude;
        
        // Try multiple static map services as fallback
        // Option 1: Use Nominatim (OpenStreetMap) - more reliable
        const nominatimUrl = `https://nominatim.openstreetmap.org/ui/reverse.html?format=json&lat=${lat}&lon=${lng}&zoom=15`;
        
        // Option 2: Use staticmap.openstreetmap.de with proper encoding
        const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=600x300&markers=${lat},${lng},red-pushpin&scale=2`;
        
        // Option 3: Use a simple tile-based approach
        // For now, use a placeholder that will be replaced by CSS background
        // The image will be set but we'll also add a fallback background
        
        // Try to load the static map
        pickupMapImage.src = staticMapUrl;
        pickupMapImage.alt = `Localização: ${CONFIG.restaurantName}`;
        
        // Add error handler to show placeholder if image fails
        pickupMapImage.onerror = function() {
            // If image fails, hide it and show placeholder via CSS
            this.style.display = 'none';
            const container = this.closest('.pickup-map-container');
            if (container) {
                container.classList.add('map-placeholder');
            }
        };
        
        // Set link to open in Google Maps
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        pickupMapLink.href = googleMapsUrl;
        
        pickupMapModal.classList.add('active');
        pickupMapModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide pickup map modal
 */
function hidePickupMapModal() {
    if (pickupMapModal && pickupMapModalOverlay) {
        pickupMapModal.classList.remove('active');
        pickupMapModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear image src to stop loading
        if (pickupMapImage) {
            pickupMapImage.src = '';
        }
    }
}

/**
 * Setup pickup map modal listeners
 */
function setupPickupMapModalListeners() {
    if (pickupMapModalClose) {
        pickupMapModalClose.addEventListener('click', hidePickupMapModal);
    }
    
    if (pickupMapModalOverlay) {
        pickupMapModalOverlay.addEventListener('click', hidePickupMapModal);
    }
    
    if (pickupMapBtnGoogle) {
        pickupMapBtnGoogle.addEventListener('click', () => {
            const lat = CONFIG.restaurantLatitude;
            const lng = CONFIG.restaurantLongitude;
            hidePickupMapModal();
            openGoogleMaps(lat, lng);
        });
    }
    
    if (pickupMapBtnApple) {
        pickupMapBtnApple.addEventListener('click', () => {
            const lat = CONFIG.restaurantLatitude;
            const lng = CONFIG.restaurantLongitude;
            hidePickupMapModal();
            openAppleMaps(lat, lng);
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pickupMapModal && pickupMapModal.classList.contains('active')) {
            hidePickupMapModal();
        }
    });
}

/**
 * Setup quantity modal listeners
 */
function setupQuantityModalListeners() {
    // Close button
    if (quantityModalClose) {
        quantityModalClose.addEventListener('click', hideQuantityModal);
    }
    
    // Overlay click
    if (quantityModalOverlay) {
        quantityModalOverlay.addEventListener('click', hideQuantityModal);
    }
    
    // Confirm button
    if (quantityBtnConfirm) {
        console.log('Setting up confirm button listener');
        quantityBtnConfirm.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Confirm button clicked');
            confirmQuantityModal();
        });
    } else {
        console.error('quantityBtnConfirm is null! Button not found in DOM.');
    }
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quantityModal && quantityModal.classList.contains('active')) {
            hideQuantityModal();
        }
    });
}

/**
 * Setup hours modal listeners
 */
function setupHoursModalListeners() {
    if (closeHoursBtn) {
        closeHoursBtn.addEventListener('click', () => {
            closeHoursModal();
        });
    }
    
    // Close modal when clicking overlay
    if (hoursOverlay) {
        hoursOverlay.addEventListener('click', () => {
            closeHoursModal();
        });
    }
}

/**
 * Setup cart navigation buttons
 */
function setupCartNavigationButtons() {
    // Navigation buttons
    if (btnContinueStep1) {
        btnContinueStep1.addEventListener('click', () => {
            nextCartStep();
        });
    }
    
    if (btnContinueStep2) {
        btnContinueStep2.addEventListener('click', () => {
            nextCartStep();
        });
    }
    
    if (btnContinueStep3) {
        btnContinueStep3.addEventListener('click', () => {
            nextCartStep();
        });
    }
    
    if (btnContinueStep4) {
        btnContinueStep4.addEventListener('click', () => {
            nextCartStep();
        });
    }
    
    if (cartBackBtn) {
        cartBackBtn.addEventListener('click', () => {
            prevCartStep();
        });
    }
    
    // checkoutBtn removed - button is now in step 5
    if (btnCheckoutSummary) {
        btnCheckoutSummary.addEventListener('click', () => {
            handleCheckout();
        });
    }
}

/**
 * Setup customer field listeners
 */
function setupCustomerFieldListeners() {
    customerNameInput.addEventListener('input', () => {
        const sanitizedName = sanitizeInput(customerNameInput.value.trim());
        const sanitizedNotes = sanitizeInput(customerNotesInput.value.trim());
        saveCustomerData(sanitizedName, sanitizedNotes);
    });
    
    customerNotesInput.addEventListener('input', () => {
        const sanitizedName = sanitizeInput(customerNameInput.value.trim());
        const sanitizedNotes = sanitizeInput(customerNotesInput.value.trim());
        saveCustomerData(sanitizedName, sanitizedNotes);
    });
    
    if (customerPhoneInput) {
        customerPhoneInput.addEventListener('input', () => {
            const sanitizedPhone = sanitizeInput(customerPhoneInput.value.trim());
            saveCustomerPhone(sanitizedPhone);
        });
    }
}

/**
 * Setup payment method listeners
 */
function setupPaymentMethodListeners() {
    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) {
                savePaymentMethod(input.value);
                
                // Show/hide change field based on payment method
                if (input.value === 'Dinheiro') {
                    changeField.style.display = 'block';
                    changeAmountInput.focus();
                } else {
                    changeField.style.display = 'none';
                    changeAmountInput.value = '';
                    changeResult.style.display = 'none';
                    saveChangeAmount('');
                }
            }
        });
    });
    
    // Calculate change on input
    changeAmountInput.addEventListener('input', () => {
        calculateChange();
    });
}

/**
 * Calculate change (troco)
 */
function calculateChange() {
    const amountStr = changeAmountInput.value.replace(',', '.').trim();
    const amount = parseFloat(amountStr);
    const total = getTotalWithDeliveryFee();
    
    if (!amountStr || isNaN(amount) || amount <= 0) {
        changeResult.style.display = 'none';
        saveChangeAmount('');
        return;
    }
    
    if (amount < total) {
        changeResult.style.display = 'block';
        changeValue.textContent = 'Valor insuficiente';
        changeValue.style.color = '#e74c3c';
        saveChangeAmount(amountStr);
        return;
    }
    
    const change = amount - total;
    changeResult.style.display = 'block';
    changeValue.textContent = change.toFixed(2);
    changeValue.style.color = '#f1c40f';
    saveChangeAmount(amountStr);
}

/**
 * Handle add to cart
 */
/**
 * Check if customer can purchase (restaurant is open)
 * @returns {Object} { canPurchase: boolean, message: string }
 */
function checkIfCanPurchase() {
    const dayStatus = getCurrentDayStatus();
    
    if (dayStatus.isOpen) {
        return { canPurchase: true, message: '' };
    }
    
    let message = '';
    if (dayStatus.statusKey === 'not-started' && dayStatus.openTime && dayStatus.closeTime) {
        // Se abrir no dia, mas antes do horário de início
        const openTime = formatTimeForDisplay(dayStatus.openTime);
        const closeTime = formatTimeForDisplay(dayStatus.closeTime);
        message = `Loja fechada, abre hoje das ${openTime} as ${closeTime}`;
    } else if (dayStatus.statusKey === 'finished') {
        // Se for depois do horário de atendimento
        message = 'Loja Fechada';
    } else if (dayStatus.statusKey === 'closed' || !dayStatus.openTime || !dayStatus.closeTime) {
        // Se não abrir no dia
        message = 'Loja Fechada!';
    } else {
        message = 'Loja Fechada!';
    }
    
    return { canPurchase: false, message };
}

function handleAddToCart(itemId) {
    // Verificar se pode comprar (horário de atendimento)
    const purchaseCheck = checkIfCanPurchase();
    if (!purchaseCheck.canPurchase) {
        showAlertModal('Aviso', purchaseCheck.message);
        return;
    }
    
    const item = MENU_DATA.items.find(i => i.id === itemId);
    if (item) {
        addItem(item);
        renderCartUI();
    }
}

/**
 * Extract default ingredients from item description
 * @param {Object} item - Item to extract ingredients from
 * @returns {Array} Array of ingredient IDs found in description
 */
function extractDefaultIngredients(item) {
    if (!item || !item.description) {
        return [];
    }
    
    const description = item.description.toLowerCase();
    const foundIngredients = [];
    
    // Map ingredient names to IDs
    const ingredientMap = {
        'hambúrguer de carne': 'hamburger',
        'hambúrguer': 'hamburger',
        'queijo mussarela': 'mussarela',
        'mussarela': 'mussarela',
        'queijo cheddar': 'cheddar',
        'cheddar': 'cheddar',
        'bacon': 'bacon',
        'ovo': 'ovo',
        'calabresa': 'calabresa',
        'salada': 'salada',
        'alface': 'salada',
        'tomate': 'salada',
        'cebola roxa': 'cebola-roxa',
        'cebola caramelizada': 'cebola-caramelizada',
        'picles': 'picles',
        'salsicha': 'salsicha',
        'onion rings': 'onion-rings',
        'batata palha': 'batata-palha',
        'molho mima': 'molho-mima',
        'molho barbecue': 'molho-barbecue',
        'molho de churrasco': 'molho-churrasco',
        'catupiry': 'catupiry'
    };
    
    // Check each ingredient (check longer names first to avoid partial matches)
    const sortedEntries = Object.entries(ingredientMap).sort((a, b) => b[0].length - a[0].length);
    
    for (const [name, id] of sortedEntries) {
        if (description.includes(name.toLowerCase()) && !foundIngredients.includes(id)) {
            foundIngredients.push(id);
        }
    }
    
    return foundIngredients;
}

/**
 * Render ingredients section in modal
 * @param {Object} item - Item to render ingredients for
 */
function renderIngredientsSection(item) {
    const defaultList = document.getElementById('ingredients-default-list');
    const extraList = document.getElementById('ingredients-extra-list');
    
    if (!defaultList || !extraList) {
        return;
    }
    
    // Clear lists
    defaultList.innerHTML = '';
    extraList.innerHTML = '';
    
    // Extract default ingredients from item description
    const defaultIngredients = extractDefaultIngredients(item);
    
    // Check if item is a beverage (Bebidas category)
    const isBeverage = item.category === 'Bebidas';
    
    // Render default ingredients (can be removed) - skip for beverages
    if (!isBeverage) {
        defaultIngredients.forEach(ingredientId => {
        const ingredient = AVAILABLE_INGREDIENTS.find(ing => ing.id === ingredientId);
        if (!ingredient) return;
        
        const isRemoved = currentQuantityModalCustomizations.removedIngredients.includes(ingredientId);
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `ingredient-item ${isRemoved ? 'removed' : ''}`;
        itemDiv.setAttribute('data-ingredient-id', ingredientId);
        itemDiv.setAttribute('data-ingredient-type', 'default');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'ingredient-checkbox';
        checkbox.id = `ingredient-${ingredientId}`;
        checkbox.checked = !isRemoved;
        checkbox.addEventListener('change', () => toggleIngredient(ingredientId, 'default'));
        
        const label = document.createElement('label');
        label.className = 'ingredient-label';
        label.htmlFor = `ingredient-${ingredientId}`;
        label.textContent = ingredient.name;
        
        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(label);
        defaultList.appendChild(itemDiv);
        });
    } else {
        // Hide default ingredients section for beverages
        const defaultSection = document.getElementById('ingredients-default-section');
        if (defaultSection) {
            defaultSection.style.display = 'none';
        }
    }
    
    // Render extra ingredients (can be added with quantity)
    // Skip if item is a beverage (Bebidas category)
    
    if (!isBeverage) {
        // Filtrar ingredientes disponíveis para este produto
        const availableForProduct = item.availableIngredients || [];
        const ingredientsToShow = availableForProduct.length > 0 
            ? AVAILABLE_INGREDIENTS.filter(ing => availableForProduct.includes(ing.id))
            : AVAILABLE_INGREDIENTS; // Se não houver lista, mostrar todos
        
        ingredientsToShow.forEach(ingredient => {
            // Skip if already in default ingredients
            if (defaultIngredients.includes(ingredient.id)) {
                return;
            }
            
            const quantity = currentQuantityModalCustomizations.addedIngredients[ingredient.id] || 0;
            const isSelected = quantity > 0;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = `ingredient-item ${isSelected ? 'selected' : ''}`;
            itemDiv.setAttribute('data-ingredient-id', ingredient.id);
            itemDiv.setAttribute('data-ingredient-type', 'extra');
            
            const labelContainer = document.createElement('div');
            labelContainer.className = 'ingredient-info';
            
            const label = document.createElement('label');
            label.className = 'ingredient-label';
            label.textContent = ingredient.name;
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'ingredient-price';
            priceSpan.textContent = `R$ ${ingredient.price.toFixed(2)}`;
            
            labelContainer.appendChild(label);
            labelContainer.appendChild(priceSpan);
            
            const quantityContainer = document.createElement('div');
            quantityContainer.className = 'ingredient-quantity-controls';
            
            const decreaseBtn = document.createElement('button');
            decreaseBtn.type = 'button';
            decreaseBtn.className = 'ingredient-qty-btn ingredient-qty-decrease';
            decreaseBtn.textContent = '−';
            decreaseBtn.disabled = quantity === 0;
            decreaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateIngredientQuantity(ingredient.id, quantity - 1);
            });
            
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.className = 'ingredient-qty-input';
            quantityInput.min = '0';
            quantityInput.value = quantity;
            quantityInput.readOnly = true;
            
            const increaseBtn = document.createElement('button');
            increaseBtn.type = 'button';
            increaseBtn.className = 'ingredient-qty-btn ingredient-qty-increase';
            increaseBtn.textContent = '+';
            increaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateIngredientQuantity(ingredient.id, quantity + 1);
            });
            
            quantityContainer.appendChild(decreaseBtn);
            quantityContainer.appendChild(quantityInput);
            quantityContainer.appendChild(increaseBtn);
            
            const totalPriceSpan = document.createElement('span');
            totalPriceSpan.className = 'ingredient-total-price';
            const totalPrice = ingredient.price * quantity;
            totalPriceSpan.textContent = quantity > 0 ? `R$ ${totalPrice.toFixed(2)}` : '';
            
            itemDiv.appendChild(labelContainer);
            itemDiv.appendChild(quantityContainer);
            itemDiv.appendChild(totalPriceSpan);
            extraList.appendChild(itemDiv);
        });
    } else {
        // Hide extra ingredients section for beverages
        if (extraList.parentElement) {
            extraList.parentElement.style.display = 'none';
        }
    }
    
    // Update modal price display with extras total
    updateModalPriceDisplay();
    
    // Show/hide entire ingredients section based on item category
    const ingredientsSection = document.getElementById('quantity-modal-ingredients');
    if (ingredientsSection) {
        if (isBeverage) {
            // Hide entire section for beverages
            ingredientsSection.style.display = 'none';
        } else {
            // Show section for non-beverages
            ingredientsSection.style.display = 'block';
            // Make sure subsections are visible
            const defaultSection = document.getElementById('ingredients-default-section');
            const extraSection = document.getElementById('ingredients-extra-section');
            if (defaultSection) {
                defaultSection.style.display = defaultIngredients.length > 0 ? 'block' : 'none';
            }
            if (extraSection) {
                extraSection.style.display = 'block';
            }
        }
    }
}

/**
 * Toggle ingredient in customizations (for default ingredients only)
 * @param {string} ingredientId - ID of ingredient to toggle
 * @param {string} type - Type: 'default' (can remove) or 'extra' (can add)
 */
function toggleIngredient(ingredientId, type) {
    if (type === 'default') {
        // Toggle in removedIngredients
        const index = currentQuantityModalCustomizations.removedIngredients.indexOf(ingredientId);
        if (index > -1) {
            // Remove from removed list (ingredient is now included)
            currentQuantityModalCustomizations.removedIngredients.splice(index, 1);
        } else {
            // Add to removed list (ingredient is now removed)
            currentQuantityModalCustomizations.removedIngredients.push(ingredientId);
        }
        
        // Re-render to update UI
        if (currentQuantityModalItem) {
            renderIngredientsSection(currentQuantityModalItem);
        }
    }
    // Extra ingredients are handled by updateIngredientQuantity
}

/**
 * Update ingredient quantity
 * @param {string} ingredientId - ID of ingredient
 * @param {number} quantity - New quantity (min 0)
 */
function updateIngredientQuantity(ingredientId, quantity) {
    if (quantity < 0) {
        quantity = 0;
    }
    
    if (quantity === 0) {
        // Remove from addedIngredients
        delete currentQuantityModalCustomizations.addedIngredients[ingredientId];
    } else {
        // Set quantity
        currentQuantityModalCustomizations.addedIngredients[ingredientId] = quantity;
    }
    
    // Re-render to update UI
    if (currentQuantityModalItem) {
        renderIngredientsSection(currentQuantityModalItem);
    }
}

/**
 * Calculate total price of extra ingredients
 * @param {Object} customizations - Optional customizations object (uses currentQuantityModalCustomizations if not provided)
 * @returns {number} Total price
 */
function calculateExtrasTotal(customizations = null) {
    let total = 0;
    const addedIngredients = customizations?.addedIngredients || currentQuantityModalCustomizations.addedIngredients || {};
    
    if (Array.isArray(addedIngredients)) {
        // Legacy format: array of IDs (no price calculation for legacy)
        return 0;
    }
    
    Object.entries(addedIngredients).forEach(([ingredientId, quantity]) => {
        if (quantity > 0) {
            const ingredient = AVAILABLE_INGREDIENTS.find(ing => ing.id === ingredientId);
            if (ingredient) {
                total += ingredient.price * quantity;
            }
        }
    });
    
    return total;
}

/**
 * Calculate total price of an item including extras
 * @param {Object} item - Item object
 * @returns {number} Total price (base price + extras)
 */
function calculateItemTotalPrice(item) {
    if (!item) return 0;
    
    const basePrice = item.price || 0;
    const extrasTotal = item.customizations ? calculateExtrasTotal(item.customizations) : 0;
    
    return basePrice + extrasTotal;
}

/**
 * Update modal price display with base price + extras total
 */
function updateModalPriceDisplay() {
    if (!currentQuantityModalItem || !quantityModalPriceValue) {
        return;
    }
    
    const basePrice = currentQuantityModalItem.price || 0;
    const extrasTotal = calculateExtrasTotal();
    const totalPrice = basePrice + extrasTotal;
    
    quantityModalPriceValue.textContent = totalPrice.toFixed(2);
    
    // Show extras total if > 0
    let extrasDisplay = document.getElementById('quantity-modal-extras-total');
    if (extrasTotal > 0) {
        if (!extrasDisplay) {
            extrasDisplay = document.createElement('div');
            extrasDisplay.id = 'quantity-modal-extras-total';
            extrasDisplay.className = 'quantity-modal-extras-total';
            const priceContainer = quantityModalPriceValue.parentElement;
            if (priceContainer) {
                priceContainer.appendChild(extrasDisplay);
            }
        }
        extrasDisplay.textContent = `(+ R$ ${extrasTotal.toFixed(2)} em extras)`;
        extrasDisplay.style.display = 'block';
    } else if (extrasDisplay) {
        extrasDisplay.style.display = 'none';
    }
}

/**
 * Show quantity modal
 * @param {Object} item - Item to add to cart
 * @param {boolean} isBuyNow - Whether to open cart after confirming
 */
function showQuantityModal(item, isBuyNow) {
    if (!item || !quantityModal || !quantityModalOverlay) {
        return;
    }
    
    // Store current item and mode
    currentQuantityModalItem = item;
    currentQuantityModalIsBuyNow = isBuyNow;
    
    // Reset customizations (always start fresh - never load from cart)
    resetModalCustomizations();
    
    // Fill modal with item data
    if (quantityModalImage) {
        quantityModalImage.src = item.image || '';
        quantityModalImage.alt = item.name || '';
    }
    
    if (quantityModalName) {
        quantityModalName.textContent = item.name || '';
    }
    
    if (quantityModalDescription) {
        if (item.description) {
            quantityModalDescription.textContent = item.description;
            quantityModalDescription.style.display = 'block';
        } else {
            quantityModalDescription.style.display = 'none';
        }
    }
    
    if (quantityModalPriceValue) {
        quantityModalPriceValue.textContent = item.price ? item.price.toFixed(2) : '0.00';
    }
    
    // Show ingredients section before rendering (will be hidden if beverage)
    const ingredientsSection = document.getElementById('quantity-modal-ingredients');
    if (ingredientsSection) {
        ingredientsSection.style.display = 'block';
    }
    
    // Render ingredients section
    renderIngredientsSection(item);
    
    // Show modal
    quantityModal.classList.add('active');
    quantityModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Reset modal customizations
 */
function resetModalCustomizations() {
    currentQuantityModalCustomizations = {
        addedIngredients: {},
        removedIngredients: []
    };
}

/**
 * Hide quantity modal
 */
function hideQuantityModal() {
    if (quantityModal && quantityModalOverlay) {
        quantityModal.classList.remove('active');
        quantityModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Clear state and reset customizations
    currentQuantityModalItem = null;
    currentQuantityModalIsBuyNow = false;
    resetModalCustomizations();
}

// updateQuantityButtons, incrementQuantity and decrementQuantity removed - always add quantity 1

/**
 * Set item quantity in cart directly
 * @param {Object} item - Item to update
 * @param {number} quantity - New quantity
 * @param {Object} customizations - Customizations object with addedIngredients and removedIngredients
 */
function setItemQuantity(item, quantity, customizations = null) {
    if (!item || !item.id || quantity < 0) {
        return;
    }
    
    // Prepare customizations
    const itemCustomizations = customizations || {
        addedIngredients: {}, // { ingredientId: quantity }
        removedIngredients: [] // Array of ingredient IDs
    };
    
    if (quantity === 0) {
        // Remove item if quantity is 0 - find by ID and customizations
        const cart = getCart();
        const customizationsStr = JSON.stringify(itemCustomizations);
        const itemToRemove = cart.find(cartItem => {
            if (cartItem.id !== item.id) return false;
            const existingCustomizationsStr = JSON.stringify(cartItem.customizations || { addedIngredients: {}, removedIngredients: [] });
            return existingCustomizationsStr === customizationsStr;
        });
        if (itemToRemove) {
            // Remove item from localStorage
            const cartArray = JSON.parse(localStorage.getItem('pediragora_cart') || '[]');
            const filteredArray = cartArray.filter(cartItem => {
                if (cartItem.id !== item.id) return true;
                const existingCustomizationsStr = JSON.stringify(cartItem.customizations || { addedIngredients: {}, removedIngredients: [] });
                return existingCustomizationsStr !== customizationsStr;
            });
            localStorage.setItem('pediragora_cart', JSON.stringify(filteredArray));
            if (typeof loadCartFromStorage === 'function') {
                loadCartFromStorage();
            }
        }
        return;
    }
    
    // Check if item has customizations
    const hasCustomizations = (
        (itemCustomizations.removedIngredients && itemCustomizations.removedIngredients.length > 0) ||
        (itemCustomizations.addedIngredients && Object.keys(itemCustomizations.addedIngredients).length > 0)
    );
    
    // If item has customizations, always add as new item (never merge)
    // If no customizations, check if same item exists without customizations
    const cart = getCart();
    let existingItem = null;
    
    if (hasCustomizations) {
        // Items with customizations are always unique - check by ID + customizations
        const customizationsStr = JSON.stringify(itemCustomizations);
        existingItem = cart.find(cartItem => {
            if (cartItem.id !== item.id) return false;
            const existingCustomizationsStr = JSON.stringify(cartItem.customizations || { addedIngredients: {}, removedIngredients: [] });
            return existingCustomizationsStr === customizationsStr;
        });
    } else {
        // Items without customizations - check by ID only (no customizations)
        existingItem = cart.find(cartItem => {
            if (cartItem.id !== item.id) return false;
            const existingHasCustomizations = cartItem.customizations && (
                (cartItem.customizations.removedIngredients && cartItem.customizations.removedIngredients.length > 0) ||
                (cartItem.customizations.addedIngredients && Object.keys(cartItem.customizations.addedIngredients).length > 0)
            );
            return !existingHasCustomizations; // Only match if existing item also has no customizations
        });
    }
    
    if (existingItem) {
        // Update existing item quantity (same item with same customizations)
        // Get current cart from localStorage directly
        let cartArray = [];
        try {
            const savedCart = localStorage.getItem('pediragora_cart');
            if (savedCart) {
                cartArray = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            cartArray = [];
        }
        
        // Find item with same ID and customizations
        const customizationsStr = JSON.stringify(itemCustomizations);
        const itemIndex = cartArray.findIndex(cartItem => {
            if (cartItem.id !== item.id) return false;
            const existingCustomizationsStr = JSON.stringify(cartItem.customizations || { addedIngredients: {}, removedIngredients: [] });
            return existingCustomizationsStr === customizationsStr;
        });
        
        if (itemIndex !== -1) {
            cartArray[itemIndex].quantity = quantity;
            cartArray[itemIndex].customizations = itemCustomizations;
            
            try {
                localStorage.setItem('pediragora_cart', JSON.stringify(cartArray));
                console.log('Item updated in cart:', item.name, 'quantity:', quantity);
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        } else {
            // Item exists but with different customizations, add as new item
            cartArray.push({
                ...item,
                quantity: quantity,
                customizations: itemCustomizations
            });
            
            try {
                localStorage.setItem('pediragora_cart', JSON.stringify(cartArray));
                console.log('Item added to cart (different customizations):', item.name, 'quantity:', quantity);
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        }
    } else {
        // Add new item with specified quantity and customizations
        // Get current cart from localStorage directly
        let cartArray = [];
        try {
            const savedCart = localStorage.getItem('pediragora_cart');
            if (savedCart) {
                cartArray = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            cartArray = [];
        }
        
        cartArray.push({
            ...item,
            quantity: quantity,
            customizations: itemCustomizations
        });
        
        // Save to localStorage
        try {
            localStorage.setItem('pediragora_cart', JSON.stringify(cartArray));
            console.log('Item added to cart:', item.name, 'quantity:', quantity);
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    // Verify item was saved
    const verifyCart = JSON.parse(localStorage.getItem('pediragora_cart') || '[]');
    const savedItem = verifyCart.find(cartItem => cartItem.id === item.id);
    if (savedItem) {
        console.log('Item verified in cart:', savedItem);
    } else {
        console.error('Item NOT found in cart after save!');
    }
}

/**
 * Confirm quantity modal and add to cart
 */
function confirmQuantityModal() {
    console.log('confirmQuantityModal called', {
        currentQuantityModalItem,
        customizations: currentQuantityModalCustomizations,
        isBuyNow: currentQuantityModalIsBuyNow
    });
    
    if (!currentQuantityModalItem) {
        console.error('Missing currentQuantityModalItem');
        alert('Erro: Item não encontrado. Por favor, tente novamente.');
        return;
    }
    
    // Always add quantity 1
    const quantity = 1;
    
    // Check if has customizations
    const hasCustomizations = (
        (currentQuantityModalCustomizations.removedIngredients && currentQuantityModalCustomizations.removedIngredients.length > 0) ||
        (currentQuantityModalCustomizations.addedIngredients && Object.keys(currentQuantityModalCustomizations.addedIngredients).length > 0)
    );
    
    console.log('Confirming modal:', {
        item: currentQuantityModalItem,
        quantity: quantity,
        customizations: currentQuantityModalCustomizations,
        hasCustomizations: hasCustomizations,
        isBuyNow: currentQuantityModalIsBuyNow
    });
    
    try {
        // Set item quantity in cart with customizations (always quantity 1)
        setItemQuantity(currentQuantityModalItem, quantity, currentQuantityModalCustomizations);
        
        console.log('setItemQuantity called, reloading cart...');
        
        // Force reload cart from storage to ensure sync
        if (typeof loadCartFromStorage === 'function') {
            loadCartFromStorage();
        }
        
        // Update cart UI
        renderCartUI();
        
        console.log('Item added/updated successfully');
        
        // Save isBuyNow state before closing modal (hideQuantityModal resets it)
        const wasBuyNow = currentQuantityModalIsBuyNow;
        
        // Reset customizations before closing modal
        resetModalCustomizations();
        
        // Close modal
        hideQuantityModal();
        
        // If "Pedir Agora", open cart after modal is closed
        if (wasBuyNow) {
            setTimeout(() => {
                openCart();
            }, 200);
        }
    } catch (error) {
        console.error('Error in confirmQuantityModal:', error);
        console.error('Error stack:', error.stack);
        alert('Erro ao adicionar item ao carrinho: ' + error.message);
        // Reset customizations even on error
        resetModalCustomizations();
    }
}

// removeItemFromCartModal removed - no remove button in modal

/**
 * Handle increase quantity
 */
function handleIncrease(itemId) {
    increaseItemQuantity(itemId);
    renderCartUI();
}

/**
 * Handle decrease quantity
 */
function handleDecrease(itemId) {
    decreaseItemQuantity(itemId);
    renderCartUI();
}

/**
 * Remove item with customizations from cart
 * @param {Object} item - Item to remove (must include id and customizations)
 */
function removeItemWithCustomizations(item) {
    if (!item || !item.id) {
        console.error('Invalid item: item must have an id');
        return;
    }
    
    const cart = getCart();
    const customizationsStr = JSON.stringify(item.customizations || { addedIngredients: {}, removedIngredients: [] });
    
    // Filter out the specific item (matching ID and customizations)
    const filteredCart = cart.filter(cartItem => {
        if (cartItem.id !== item.id) return true;
        const existingCustomizationsStr = JSON.stringify(cartItem.customizations || { addedIngredients: {}, removedIngredients: [] });
        return existingCustomizationsStr !== customizationsStr;
    });
    
    // Update localStorage
    try {
        localStorage.setItem('pediragora_cart', JSON.stringify(filteredCart));
        // Reload cart from storage
        if (typeof loadCartFromStorage === 'function') {
            loadCartFromStorage();
        }
        console.log('Item removed from cart:', item.id, 'with customizations');
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
}

/**
 * Handle remove item
 * @param {string|Object} itemIdOrItem - Item ID (string) or full item object
 */
function handleRemove(itemIdOrItem) {
    // If it's a string (old format), try to find the item in the cart
    if (typeof itemIdOrItem === 'string') {
        // Legacy support: remove all items with this ID (may remove multiple if customizations differ)
        removeItem(itemIdOrItem);
    } else if (typeof itemIdOrItem === 'object' && itemIdOrItem.id) {
        // New format: remove specific item with customizations
        removeItemWithCustomizations(itemIdOrItem);
    } else {
        console.error('Invalid argument: must be item ID (string) or item object');
        return;
    }
    renderCartUI();
}

/**
 * Render cart UI
 */
function renderCartUI() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const previousCount = parseInt(cartCount.textContent) || 0;
    
    // Update count
    cartCount.textContent = totalItems;
    
    // Update total: Step 1 should show total WITHOUT delivery fee
    // Only steps 2+ should show total WITH delivery fee (if delivery selected)
    if (cartTotal) {
        const isStep1 = cartStep1 && cartStep1.style.display !== 'none';
        if (isStep1) {
            // Step 1: Always show total without delivery fee
            cartTotal.textContent = getTotal().toFixed(2);
        } else {
            // Steps 2+: Show total with delivery fee if applicable
            cartTotal.textContent = getTotalWithDeliveryFee().toFixed(2);
        }
    }
    
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
    
    // Add pulse animation if count changed
    if (totalItems !== previousCount && totalItems > 0) {
        cartCount.classList.remove('pulse');
        // Trigger reflow to restart animation
        void cartCount.offsetWidth;
        cartCount.classList.add('pulse');
        
        // Remove class after animation completes
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 500);
    }
    
    renderCartItems();
    
    // Recalculate change if field is visible and has value
    if (changeField.style.display === 'block' && changeAmountInput.value) {
        calculateChange();
    }
}

/**
 * Render cart items in sidebar
 */
function renderCartItems() {
    const cart = getCart();
    const cartItemsAlterations = document.getElementById('cart-items-alterations');
    const cartAlterationsSection = document.getElementById('cart-alterations-section');
    const cartItemsSection = document.getElementById('cart-items-section');
    
    if (cart.length === 0) {
        // Hide both sections when cart is empty
        if (cartItemsSection) {
            cartItemsSection.style.display = 'none';
        }
        if (cartAlterationsSection) {
            cartAlterationsSection.style.display = 'none';
        }
        cartItems.innerHTML = '';
        if (cartItemsAlterations) {
            cartItemsAlterations.innerHTML = '';
        }
        return;
    }
    
    // Separate items with and without customizations
    const itemsWithoutCustomizations = [];
    const itemsWithCustomizations = [];
    
    cart.forEach(item => {
        const hasCustomizations = item.customizations && (
            (item.customizations.removedIngredients && item.customizations.removedIngredients.length > 0) ||
            (item.customizations.addedIngredients && Object.keys(item.customizations.addedIngredients).length > 0)
        );
        
        if (hasCustomizations) {
            itemsWithCustomizations.push(item);
        } else {
            itemsWithoutCustomizations.push(item);
        }
    });
    
    // Show/hide "Itens" section based on items without customizations
    if (cartItemsSection) {
        if (itemsWithoutCustomizations.length > 0) {
            cartItemsSection.style.display = 'block';
            cartItems.innerHTML = '';
            itemsWithoutCustomizations.forEach(item => {
                const cartItemEl = createCartItemElement(item);
                cartItems.appendChild(cartItemEl);
            });
        } else {
            cartItemsSection.style.display = 'none';
            cartItems.innerHTML = '';
        }
    }
    
    // Show/hide "Com Alterações" section based on items with customizations
    if (cartItemsAlterations && cartAlterationsSection) {
        if (itemsWithCustomizations.length > 0) {
            cartAlterationsSection.style.display = 'block';
            cartItemsAlterations.innerHTML = '';
            itemsWithCustomizations.forEach(item => {
                const cartItemEl = createCartItemElement(item);
                cartItemsAlterations.appendChild(cartItemEl);
            });
        } else {
            cartAlterationsSection.style.display = 'none';
            cartItemsAlterations.innerHTML = '';
        }
    }
}

/**
 * Get ingredient name by ID
 * @param {string} ingredientId - ID of ingredient
 * @returns {string} Name of ingredient
 */
function getIngredientName(ingredientId) {
    const ingredient = AVAILABLE_INGREDIENTS.find(ing => ing.id === ingredientId);
    return ingredient ? ingredient.name : ingredientId;
}

/**
 * Format customizations text for display
 * @param {Object} customizations - Customizations object
 * @returns {string} Formatted text
 */
/**
 * Get customizations as structured object
 * @param {Object} customizations - Customizations object
 * @returns {Object} Object with removed and added arrays
 */
function getCustomizationsData(customizations) {
    if (!customizations) {
        return { removed: [], added: [] };
    }
    
    const removed = [];
    const added = [];
    
    // Handle removed ingredients
    if (customizations.removedIngredients && customizations.removedIngredients.length > 0) {
        customizations.removedIngredients.forEach(id => {
            removed.push(getIngredientName(id));
        });
    }
    
    // Handle addedIngredients as object { ingredientId: quantity }
    if (customizations.addedIngredients) {
        if (Array.isArray(customizations.addedIngredients)) {
            // Legacy format: array of IDs
            customizations.addedIngredients.forEach(id => {
                added.push(getIngredientName(id));
            });
        } else if (typeof customizations.addedIngredients === 'object') {
            // New format: object with quantities
            Object.entries(customizations.addedIngredients).forEach(([id, quantity]) => {
                if (quantity > 0) {
                    const name = getIngredientName(id);
                    if (quantity === 1) {
                        added.push(name);
                    } else {
                        added.push(`${name} (${quantity}x)`);
                    }
                }
            });
        }
    }
    
    return { removed, added };
}

/**
 * Format customizations text (legacy - for backward compatibility)
 * @param {Object} customizations - Customizations object
 * @returns {string} Formatted text
 */
function formatCustomizationsText(customizations) {
    const data = getCustomizationsData(customizations);
    const parts = [];
    
    if (data.removed.length > 0) {
        parts.push(`- ${data.removed.join(', ')}`);
    }
    if (data.added.length > 0) {
        parts.push(`+ ${data.added.join(', ')}`);
    }
    
    return parts.length > 0 ? ` (${parts.join(' | ')})` : '';
}

/**
 * Create cart item element
 */
function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    const formattedName = formatItemName(item);
    const customizationsData = item.customizations ? getCustomizationsData(item.customizations) : { removed: [], added: [] };
    
    // Formatar preço: se quantidade > 1, mostrar cálculo; senão, apenas o preço unitário
    // Include extras in price calculation
    const itemTotalPrice = calculateItemTotalPrice(item);
    let priceDisplay;
    if (item.quantity > 1) {
        const total = itemTotalPrice * item.quantity;
        priceDisplay = `R$ ${itemTotalPrice.toFixed(2)} x ${item.quantity} = R$ ${total.toFixed(2)}`;
    } else {
        priceDisplay = `R$ ${itemTotalPrice.toFixed(2)}`;
    }
    
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = sanitizeHTML(item.name);
    img.className = 'cart-item-image';
    // Add specific class for hot dog images
    if (item.category === 'Hot-Dogs') {
        img.classList.add('hotdog-image');
    }
    img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E';
    };
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'cart-item-info';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'cart-item-name';
    nameDiv.textContent = formattedName;
    
    // Add customizations as separate elements below the name
    if (customizationsData.removed.length > 0 || customizationsData.added.length > 0) {
        const customizationsDiv = document.createElement('div');
        customizationsDiv.className = 'cart-item-customizations';
        
        if (customizationsData.removed.length > 0) {
            const removedDiv = document.createElement('div');
            removedDiv.className = 'cart-item-removed';
            removedDiv.textContent = `Remover: ${customizationsData.removed.join(', ')}`;
            customizationsDiv.appendChild(removedDiv);
        }
        
        if (customizationsData.added.length > 0) {
            const addedDiv = document.createElement('div');
            addedDiv.className = 'cart-item-added';
            addedDiv.textContent = `Adicionar: ${customizationsData.added.join(', ')}`;
            customizationsDiv.appendChild(addedDiv);
        }
        
        nameDiv.appendChild(customizationsDiv);
    }
    
    const priceDiv = document.createElement('div');
    priceDiv.className = 'cart-item-price';
    priceDiv.textContent = priceDisplay;
    
    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'cart-item-quantity';
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'quantity-btn';
    decreaseBtn.setAttribute('data-action', 'decrease');
    decreaseBtn.setAttribute('data-item-id', item.id);
    decreaseBtn.textContent = '-';
    decreaseBtn.addEventListener('click', () => handleDecrease(item.id));
    
    const quantityValue = document.createElement('span');
    quantityValue.className = 'quantity-value';
    quantityValue.textContent = item.quantity;
    
    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'quantity-btn';
    increaseBtn.setAttribute('data-action', 'increase');
    increaseBtn.setAttribute('data-item-id', item.id);
    increaseBtn.textContent = '+';
    increaseBtn.addEventListener('click', () => handleIncrease(item.id));
    
    quantityDiv.appendChild(decreaseBtn);
    quantityDiv.appendChild(quantityValue);
    quantityDiv.appendChild(increaseBtn);
    
    infoDiv.appendChild(nameDiv);
    infoDiv.appendChild(priceDiv);
    infoDiv.appendChild(quantityDiv);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'cart-item-remove';
    removeBtn.setAttribute('data-item-id', item.id);
    removeBtn.textContent = 'Remover';
    // Pass the full item object to handleRemove so it can remove by ID + customizations
    removeBtn.addEventListener('click', () => handleRemove(item));
    
    div.appendChild(img);
    div.appendChild(infoDiv);
    div.appendChild(removeBtn);
    
    return div;
}

/**
 * Handle checkout process
 */
function handleCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showAlertModal('Aviso', 'Carrinho vazio!');
        return;
    }
    
    saveCustomerData(customerNameInput.value.trim(), customerNotesInput.value.trim());
    
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = selectedPaymentMethod ? selectedPaymentMethod.value : '';
    
    if (selectedPaymentMethod) {
        savePaymentMethod(paymentMethod);
    }
    
    // Get delivery method first to calculate total with fee
    const selectedDeliveryMethod = document.querySelector('input[name="delivery-method"]:checked');
    const deliveryMethod = selectedDeliveryMethod ? selectedDeliveryMethod.value : '';
    
    // Get delivery address if delivery
    let deliveryAddress = '';
    let deliveryComplement = '';
    if (deliveryMethod === 'Entrega') {
        deliveryAddress = deliveryAddressInput ? deliveryAddressInput.value.trim() : '';
        deliveryComplement = deliveryComplementInput ? deliveryComplementInput.value.trim() : '';
        if (!deliveryAddress) {
            showAlertModal('Aviso', 'Informe o endereço de entrega');
            return;
        }
    }
    
    // Calculate total with delivery fee
    const total = getTotalWithDeliveryFee();
    const isDelivery = deliveryMethod === 'Entrega';
    const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
    
    let changeAmount = '';
    let change = 0;
    
    if (paymentMethod === 'Dinheiro' && changeAmountInput.value) {
        const amountStr = changeAmountInput.value.replace(',', '.').trim();
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0) {
            changeAmount = amountStr;
            if (amount >= total) {
                change = amount - total;
            }
        }
    }
    
    // Sanitize and validate inputs
    const sanitizedName = sanitizeInput(customerNameInput.value.trim());
    const sanitizedPhone = customerPhoneInput ? sanitizeInput(customerPhoneInput.value.trim()) : '';
    const sanitizedNotes = sanitizeInput(customerNotesInput.value.trim());
    const sanitizedAddress = deliveryAddress ? sanitizeInput(deliveryAddress) : '';
    const sanitizedComplement = deliveryComplement ? sanitizeInput(deliveryComplement) : '';
    
    // Validate required fields
    if (!sanitizedName) {
        showAlertModal('Aviso', 'Informe seu nome');
        return;
    }
    
    if (!sanitizedPhone) {
        showAlertModal('Aviso', 'Informe seu telefone');
        return;
    }
    
    // Validate phone format
    if (!validatePhone(sanitizedPhone)) {
        showAlertModal('Aviso', 'Telefone inválido. Informe um telefone válido (10 ou 11 dígitos)');
        return;
    }
    
    if (!paymentMethod) {
        showAlertModal('Aviso', 'Selecione uma forma de pagamento');
        return;
    }
    
    // Save all data (already sanitized)
    saveCustomerData(sanitizedName, sanitizedNotes);
    if (customerPhoneInput) {
        saveCustomerPhone(sanitizedPhone);
    }
    if (deliveryMethod) {
        saveDeliveryMethod(deliveryMethod);
    }
    if (deliveryMethod === 'Entrega') {
        saveDeliveryAddress(sanitizedAddress);
        saveDeliveryComplement(sanitizedComplement);
    }
    
    const order = {
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            customizations: item.customizations || null
        })),
        total: total,
        deliveryFee: deliveryFee,
        customerName: sanitizedName,
        customerPhone: sanitizedPhone,
        notes: sanitizedNotes,
        deliveryMethod: deliveryMethod,
        deliveryAddress: sanitizedAddress,
        deliveryComplement: sanitizedComplement,
        paymentMethod: paymentMethod,
        changeAmount: changeAmount,
        change: change
    };
    
    // Add restaurant coordinates if pickup at location
    if (deliveryMethod === 'Retirar no local') {
        order.restaurantLatitude = CONFIG.restaurantLatitude;
        order.restaurantLongitude = CONFIG.restaurantLongitude;
    }
    
    sendToWhatsApp(CONFIG.whatsappNumber, order);
    
    // Clear sensitive customer data after successful checkout
    clearSensitiveData();
    
    // Clear cart items and temporary data (payment, notes)
    clearCart();
    clearTemporaryData();
    
    // Clear form fields (except name, phone, address which are kept in localStorage)
    customerNotesInput.value = '';
    if (changeField) {
        changeField.style.display = 'none';
        changeAmountInput.value = '';
        changeResult.style.display = 'none';
    }
    
    // Uncheck payment method
    paymentMethodInputs.forEach(input => {
        input.checked = false;
    });
    
    // Update UI
    renderCartUI();
    
    // Reset to step 1 and close cart
    goToCartStep(1);
    closeCart();
}

/**
 * Get all days of week in Portuguese
 */
function getAllDaysInPortuguese() {
    return [
        { key: 'domingo', name: 'Dom', fullName: 'Domingo' },
        { key: 'segunda', name: 'Seg', fullName: 'Segunda' },
        { key: 'terca', name: 'Ter', fullName: 'Terça' },
        { key: 'quarta', name: 'Qua', fullName: 'Quarta' },
        { key: 'quinta', name: 'Qui', fullName: 'Quinta' },
        { key: 'sexta', name: 'Sex', fullName: 'Sexta' },
        { key: 'sabado', name: 'Sáb', fullName: 'Sábado' }
    ];
}

/**
 * Get current day of week in Portuguese
 */
function getCurrentDayInPortuguese() {
    const days = getAllDaysInPortuguese();
    const brasiliaDate = getBrasiliaTime();
    const today = brasiliaDate.getDay();
    return days[today];
}

/**
 * Get current time in Brasília timezone (UTC-3) or simulated time if test mode is enabled
 * @returns {Date} Date object with Brasília time
 */
function getBrasiliaTime() {
    const now = new Date();
    // Get UTC time
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    // Brasília is UTC-3
    const brasiliaOffset = -3 * 60; // -3 hours in minutes
    const brasiliaTime = new Date(utc + (brasiliaOffset * 60000));
    return brasiliaTime;
}

/**
 * Get current time string (HH:MM format) - uses simulated time if test mode is enabled
 * @returns {string} Current time in "HH:MM" format
 */
function getCurrentTimeString() {
    // Verificar modo teste primeiro
    if (typeof TEST_MODE !== 'undefined' && TEST_MODE.enabled && TEST_MODE.simulatedTime) {
        console.log('[TEST MODE] Usando horário simulado:', TEST_MODE.simulatedTime);
        return TEST_MODE.simulatedTime;
    }
    // Se não estiver em modo teste, usar horário real
    const brasiliaTime = getBrasiliaTime();
    const realTime = `${brasiliaTime.getHours().toString().padStart(2, '0')}:${brasiliaTime.getMinutes().toString().padStart(2, '0')}`;
    console.log('[REAL TIME] Horário real de Brasília:', realTime);
    return realTime;
}

/**
 * Format current date in Portuguese
 * @returns {string} Formatted date (e.g., "Sábado, 15 de Novembro")
 */
function formatCurrentDate() {
    const brasiliaDate = getBrasiliaTime();
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dayName = days[brasiliaDate.getDay()];
    const day = brasiliaDate.getDate();
    const month = months[brasiliaDate.getMonth()];
    
    return `${dayName}, ${day} de ${month}`;
}

/**
 * Get current day status (open/closed) with hours
 * @returns {Object} { isOpen: boolean, status: string, openTime: string, closeTime: string }
 */
function getCurrentDayStatus() {
    const currentDay = getCurrentDayInPortuguese();
    const dayHours = CONFIG.openingHours[currentDay.key];
    
    console.log('[DEBUG] Dia atual:', currentDay.key, 'Horários:', dayHours);
    
    if (!dayHours || !dayHours.open || !dayHours.close) {
        console.log('[DEBUG] Dia fechado - sem horários');
        return {
            isOpen: false,
            status: 'Fechado',
            statusKey: 'closed',
            openTime: null,
            closeTime: null
        };
    }
    
    // Verificar horário atual (Brasília) ou simulado (modo teste)
    const currentTime = getCurrentTimeString();
    console.log('[DEBUG] Horário atual usado:', currentTime);
    console.log('[DEBUG] Horário de abertura:', dayHours.open, 'Fechamento:', dayHours.close);
    
    const [openHour, openMin] = dayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = dayHours.close.split(':').map(Number);
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    const currentMinutes = currentHour * 60 + currentMin;
    
    console.log('[DEBUG] Comparação:', {
        currentMinutes,
        openMinutes,
        closeMinutes,
        isBeforeOpen: currentMinutes < openMinutes,
        isDuringHours: currentMinutes >= openMinutes && currentMinutes < closeMinutes,
        isAfterClose: currentMinutes >= closeMinutes
    });
    
    // Verificar status baseado no horário atual
    if (currentMinutes < openMinutes) {
        // Ainda não iniciou
        console.log('[DEBUG] Status: Não iniciou ainda');
        return {
            isOpen: false,
            status: 'Não iniciado',
            statusKey: 'not-started',
            openTime: dayHours.open,
            closeTime: dayHours.close
        };
    } else if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        // Dentro do horário
        console.log('[DEBUG] Status: ABERTO');
        return {
            isOpen: true,
            status: 'Aberto',
            statusKey: 'open',
            openTime: dayHours.open,
            closeTime: dayHours.close
        };
    } else {
        // Já finalizou
        console.log('[DEBUG] Status: Já finalizou');
        return {
            isOpen: false,
            status: 'Finalizado',
            statusKey: 'finished',
            openTime: dayHours.open,
            closeTime: dayHours.close
        };
    }
}

/**
 * Check if restaurant is currently open
 */
function isCurrentlyOpen(dayKey, openTime, closeTime) {
    if (!openTime || !closeTime) {
        return false;
    }
    
    // Verificar horário atual (Brasília) ou simulado (modo teste)
    const currentTime = getCurrentTimeString();
    
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    const currentMinutes = currentHour * 60 + currentMin;
    
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Format time to compact format (19:00 -> 19h)
 */
function formatTimeCompact(time) {
    if (!time) return '';
    return time.replace(':00', 'h');
}

/**
 * Format time for display (19:00 -> 19h, 22:45 -> 22:45)
 */
function formatTimeForDisplay(time) {
    if (!time) return '';
    // "19:00" -> "19h", "22:45" -> "22:45"
    return time.replace(':00', 'h');
}

/**
 * Render opening hours section with current day info
 */
function renderOpeningHours() {
    if (!openingHoursInfo) {
        return;
    }
    
    openingHoursInfo.innerHTML = '';
    
    const currentDate = formatCurrentDate();
    const dayStatus = getCurrentDayStatus();
    
    // Container principal
    const container = document.createElement('div');
    container.className = 'opening-hours-info-container';
    
    // Data atual
    const dateEl = document.createElement('div');
    dateEl.className = 'opening-hours-date';
    dateEl.textContent = currentDate;
    
    // Status e horário
    const statusContainer = document.createElement('div');
    statusContainer.className = 'opening-hours-status-container';
    
    const statusBadge = document.createElement('span');
    // Usar statusKey para aplicar classe CSS correta
    const statusClass = dayStatus.statusKey ? `status-${dayStatus.statusKey}` : (dayStatus.isOpen ? 'status-open' : 'status-closed');
    statusBadge.className = `opening-hours-status ${statusClass}`;
    
    // Definir texto do status conforme novas regras
    if (dayStatus.isOpen && dayStatus.openTime && dayStatus.closeTime) {
        // Se for durante o horário de atendimento
        statusBadge.textContent = 'Aberto';
    } else if (dayStatus.statusKey === 'not-started' && dayStatus.openTime && dayStatus.closeTime) {
        // Se abrir no dia, mas antes do horário de início
        statusBadge.textContent = 'Loja fechada, abre hoje!';
    } else if (dayStatus.statusKey === 'finished') {
        // Se for depois do horário de atendimento
        statusBadge.textContent = 'Loja Fechada';
    } else {
        // Se não abrir no dia
        statusBadge.textContent = 'Loja Fechada!';
    }
    
    // Container para horário e ícone
    const hoursContainer = document.createElement('div');
    hoursContainer.className = 'opening-hours-time-container';
    
    const hoursText = document.createElement('span');
    hoursText.className = 'opening-hours-time';
    
    if (dayStatus.openTime && dayStatus.closeTime) {
        const openTime = formatTimeForDisplay(dayStatus.openTime);
        const closeTime = formatTimeForDisplay(dayStatus.closeTime);
        hoursText.textContent = `${openTime} às ${closeTime}`;
        
        // Ícone clicável para ver horários completos
        const hoursIcon = document.createElement('button');
        hoursIcon.className = 'opening-hours-icon-btn';
        hoursIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 11V8M8 5H8.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
        hoursIcon.setAttribute('aria-label', 'Ver horários completos');
        hoursIcon.addEventListener('click', openHoursModal);
        
        hoursContainer.appendChild(hoursText);
        hoursContainer.appendChild(hoursIcon);
    } else {
        hoursText.textContent = 'Fechado';
        hoursContainer.appendChild(hoursText);
    }
    
    statusContainer.appendChild(statusBadge);
    statusContainer.appendChild(hoursContainer);
    
    container.appendChild(dateEl);
    container.appendChild(statusContainer);
    
    openingHoursInfo.appendChild(container);
}

/**
 * Open hours modal
 */
function openHoursModal() {
    if (!hoursSidebar || !hoursOverlay) {
        return;
    }
    
    renderHoursModal();
    
    hoursSidebar.classList.add('open');
    hoursOverlay.classList.add('active');
    
    // Prevent body scroll
    document.body.classList.add('hours-open');
    document.documentElement.classList.add('hours-open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
}

/**
 * Close hours modal
 */
function closeHoursModal() {
    if (!hoursSidebar || !hoursOverlay) {
        return;
    }
    
    hoursSidebar.classList.remove('open');
    hoursOverlay.classList.remove('active');
    
    // Restore body scroll
    document.body.classList.remove('hours-open');
    document.documentElement.classList.remove('hours-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
}

/**
 * Render hours modal with all days
 */
function renderHoursModal() {
    if (!hoursContent) {
        return;
    }
    
    hoursContent.innerHTML = '';
    
    const allDays = getAllDaysInPortuguese();
    const currentDay = getCurrentDayInPortuguese();
    
    allDays.forEach(day => {
        const dayHours = CONFIG.openingHours[day.key];
        const isCurrentDay = day.key === currentDay.key;
        
        // Create day item
        const dayItem = document.createElement('div');
        dayItem.className = 'hours-day-item';
        
        if (isCurrentDay) {
            dayItem.classList.add('current-day');
        }
        
        if (!dayHours || !dayHours.open || !dayHours.close) {
            dayItem.classList.add('closed-day');
        }
        
        // Day name
        const dayName = document.createElement('div');
        dayName.className = 'hours-day-name';
        dayName.textContent = day.fullName;
        
        // Status and hours
        const dayInfo = document.createElement('div');
        dayInfo.className = 'hours-day-info';
        
        if (dayHours && dayHours.open && dayHours.close) {
            const openTime = formatTimeCompact(dayHours.open);
            const closeTime = formatTimeCompact(dayHours.close);
            
            const statusBadge = document.createElement('span');
            // Se for o dia atual, usar status real com novas mensagens; senão, mostrar apenas "Aberto"
            if (isCurrentDay) {
                const dayStatus = getCurrentDayStatus();
                const statusClass = dayStatus.statusKey ? `status-${dayStatus.statusKey}` : 'status-open';
                statusBadge.className = `hours-status-badge ${statusClass}`;
                
                // Aplicar novas regras de mensagens
                if (dayStatus.isOpen && dayStatus.openTime && dayStatus.closeTime) {
                    const openTime = formatTimeForDisplay(dayStatus.openTime);
                    const closeTime = formatTimeForDisplay(dayStatus.closeTime);
                    statusBadge.textContent = `Aberto das ${openTime} as ${closeTime}`;
                } else if (dayStatus.statusKey === 'not-started' && dayStatus.openTime && dayStatus.closeTime) {
                    const openTime = formatTimeForDisplay(dayStatus.openTime);
                    const closeTime = formatTimeForDisplay(dayStatus.closeTime);
                    statusBadge.textContent = `Loja fechada, abre hoje das ${openTime} as ${closeTime}`;
                } else if (dayStatus.statusKey === 'finished') {
                    statusBadge.textContent = 'Loja Fechada';
                } else {
                    statusBadge.textContent = 'Loja Fechada!';
                }
            } else {
                statusBadge.className = 'hours-status-badge status-open';
                statusBadge.textContent = 'Aberto';
            }
            
            const hoursText = document.createElement('span');
            hoursText.className = 'hours-time-text';
            hoursText.textContent = `${openTime} às ${closeTime}`;
            
            dayInfo.appendChild(statusBadge);
            dayInfo.appendChild(hoursText);
        } else {
            const statusBadge = document.createElement('span');
            statusBadge.className = 'hours-status-badge status-closed';
            statusBadge.textContent = 'Fechado';
            
            dayInfo.appendChild(statusBadge);
        }
        
        dayItem.appendChild(dayName);
        dayItem.appendChild(dayInfo);
        
        hoursContent.appendChild(dayItem);
    });
}


