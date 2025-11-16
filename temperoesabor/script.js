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
 */

// Configuration
const CONFIG = {
    restaurantName: 'Tempero & Sabor',
    whatsappNumber: '67982077085', // Format: DDD + number (no spaces or special chars)
    logoPath: '../assets/images/TemperoESaborLogo.png',
    restaurantLatitude: -20.367082707152765,
    restaurantLongitude: -51.42205139592757,
    openingHours: {
        segunda: null, // Fechado na segunda-feira
        terca: { open: '08:00', close: '23:00' },
        quarta: { open: '08:00', close: '23:00' },
        quinta: { open: '08:00', close: '23:00' },
        sexta: { open: '08:00', close: '23:00' },
        sabado: { open: '08:00', close: '23:00' },
        domingo: { open: '08:00', close: '23:00' }
    }
};

// Menu data
const MENU_DATA = {
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
let currentLayout = 'vertical'; // 'vertical' or 'horizontal'

// DOM Elements
const categoryButtons = document.getElementById('category-buttons');
const itemsGrid = document.getElementById('items-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartToggle = document.getElementById('cart-toggle');
const mapToggle = document.getElementById('map-toggle');
const closeCartBtn = document.getElementById('close-cart');
const mapsModal = document.getElementById('maps-modal');
const mapsModalOverlay = document.getElementById('maps-modal-overlay');
const mapsModalClose = document.getElementById('maps-modal-close');
const mapsOptionGoogle = document.getElementById('maps-option-google');
const mapsOptionApple = document.getElementById('maps-option-apple');
const alertModal = document.getElementById('alert-modal');
const alertModalOverlay = document.getElementById('alert-modal-overlay');
const alertModalClose = document.getElementById('alert-modal-close');
const alertModalOk = document.getElementById('alert-modal-ok');
const alertModalTitle = document.getElementById('alert-modal-title');
const alertModalMessage = document.getElementById('alert-modal-message');
const pickupMapModal = document.getElementById('pickup-map-modal');
const pickupMapModalOverlay = document.getElementById('pickup-map-modal-overlay');
const pickupMapModalClose = document.getElementById('pickup-map-modal-close');
const pickupMapImage = document.getElementById('pickup-map-image');
const pickupMapLink = document.getElementById('pickup-map-link');
const pickupMapBtnGoogle = document.getElementById('pickup-map-btn-google');
const pickupMapBtnApple = document.getElementById('pickup-map-btn-apple');
const checkoutBtn = document.getElementById('btn-checkout');
const customerNameInput = document.getElementById('customer-name');
const customerNotesInput = document.getElementById('customer-notes');
const searchInput = document.getElementById('search-input');
const searchClearBtn = document.getElementById('search-clear');
const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
const changeField = document.getElementById('change-field');
const changeAmountInput = document.getElementById('change-amount');
const changeResult = document.getElementById('change-result');
const changeValue = document.getElementById('change-value');
const openingHoursInfo = document.getElementById('opening-hours-info');
const hoursOverlay = document.getElementById('hours-overlay');
const hoursSidebar = document.getElementById('hours-sidebar');
const hoursContent = document.getElementById('hours-content');
const closeHoursBtn = document.getElementById('close-hours');
const cartOverlay = document.getElementById('cart-overlay');
const cartBackBtn = document.getElementById('cart-back-btn');
const cartHeaderTitle = document.getElementById('cart-header-title');
const cartStep1 = document.getElementById('cart-step-1');
const cartStep2 = document.getElementById('cart-step-2');
const cartStep3 = document.getElementById('cart-step-3');
const btnContinueStep1 = document.getElementById('btn-continue-step1');
const btnContinueStep2 = document.getElementById('btn-continue-step2');
const deliveryMethodInputs = document.querySelectorAll('input[name="delivery-method"]');
const deliveryAddressField = document.getElementById('delivery-address-field');
const deliveryAddressInput = document.getElementById('delivery-address');
const deliveryComplementInput = document.getElementById('delivery-complement');
const customerPhoneInput = document.getElementById('customer-phone');
const cartTotalStep3 = document.getElementById('cart-total-step3');
const layoutSelector = document.getElementById('layout-selector');
const layoutBtnVertical = document.getElementById('layout-btn-vertical');
const layoutBtnHorizontal = document.getElementById('layout-btn-horizontal');

// Cart step state
let currentCartStep = 1;
let scrollPosition = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const restaurantNameEl = document.querySelector('.restaurant-name');
    if (restaurantNameEl) {
        restaurantNameEl.textContent = CONFIG.restaurantName;
    }
    
    const cart = getCart();
    const customerData = loadCustomerData();
    const paymentMethod = loadPaymentMethod();
    const changeAmount = loadChangeAmount();
    
    customerNameInput.value = customerData.name || '';
    customerNotesInput.value = customerData.notes || '';
    
    const customerPhone = loadCustomerPhone();
    if (customerPhoneInput && customerPhone) {
        customerPhoneInput.value = customerPhone;
    }
    
    if (paymentMethod) {
        const selectedInput = document.querySelector(`input[name="payment-method"][value="${paymentMethod}"]`);
        if (selectedInput) {
            selectedInput.checked = true;
            if (paymentMethod === 'Dinheiro') {
                changeField.style.display = 'block';
                if (changeAmount) {
                    changeAmountInput.value = changeAmount;
                    calculateChange();
                }
            }
        }
    }
    
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
    setupLayoutSelectorListeners();
    renderOpeningHours();
    
    // Load saved layout preference
    const savedLayout = loadLayoutPreference();
    if (savedLayout) {
        setLayout(savedLayout, false); // false = don't save again
    }
    
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
    
    // Add horizontal class if layout is horizontal
    if (currentLayout === 'horizontal') {
        card.classList.add('horizontal');
    }
    
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
            // Verificar se pode comprar antes de adicionar e abrir carrinho
            const purchaseCheck = checkIfCanPurchase();
            if (!purchaseCheck.canPurchase) {
                showAlertModal('Aviso', purchaseCheck.message);
                return;
            }
        handleAddToCart(item.id);
        openCart();
    });
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-cart';
    addBtn.setAttribute('data-item-id', item.id);
    addBtn.setAttribute('aria-label', 'Adicionar ao Carrinho');
    addBtn.setAttribute('title', 'Adicionar ao Carrinho');
    // Add text and cart icon SVG
    addBtn.innerHTML = '<span>Adicionar</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
    addBtn.addEventListener('click', () => {
        handleAddToCart(item.id);
    });
    
    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'item-buttons';
    buttonsContainer.appendChild(buyNowBtn);
    buttonsContainer.appendChild(addBtn);
    
    // Add price and buttons to price-actions container
    priceActionsContainer.appendChild(price);
    priceActionsContainer.appendChild(buttonsContainer);
    
    // For horizontal layout: create top section with content and image, then price-actions below
    if (currentLayout === 'horizontal') {
        const topSection = document.createElement('div');
        topSection.className = 'item-top-section';
        topSection.appendChild(contentContainer);
        topSection.appendChild(imageContainer);
        
        card.appendChild(topSection);
        card.appendChild(priceActionsContainer);
    } else {
        // Vertical layout: normal structure
        card.appendChild(imageContainer);
        card.appendChild(contentContainer);
        card.appendChild(priceActionsContainer);
    }
    
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
    cartStep1.style.display = 'none';
    cartStep2.style.display = 'none';
    cartStep3.style.display = 'none';
    
    // Show selected step
    if (step === 1) {
        cartStep1.style.display = 'flex';
        cartHeaderTitle.textContent = 'Carrinho';
        cartBackBtn.style.display = 'none';
        currentCartStep = 1;
    } else if (step === 2) {
        cartStep2.style.display = 'flex';
        cartHeaderTitle.textContent = 'Forma de Entrega';
        cartBackBtn.style.display = 'flex';
        currentCartStep = 2;
    } else if (step === 3) {
        cartStep3.style.display = 'flex';
        cartHeaderTitle.textContent = 'Finalizar Pedido';
        cartBackBtn.style.display = 'flex';
        currentCartStep = 3;
        // Update total in step 3
        cartTotalStep3.textContent = getTotal().toFixed(2);
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
    }
}

/**
 * Open cart
 */
function openCart() {
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
    cartToggle.addEventListener('click', () => {
        // Verificar se pode comprar (horário de atendimento) antes de abrir carrinho
        const purchaseCheck = checkIfCanPurchase();
        if (!purchaseCheck.canPurchase) {
            showAlertModal('Aviso', purchaseCheck.message);
            return;
        }
        openCart();
    });
    
    closeCartBtn.addEventListener('click', () => {
        closeCart();
    });
    
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
    
    if (cartBackBtn) {
        cartBackBtn.addEventListener('click', () => {
            prevCartStep();
        });
    }
    
    checkoutBtn.addEventListener('click', () => {
        handleCheckout();
    });
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
    const total = getTotal();
    
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
    
    // Formatar horários para exibição
    const formatTime = (time) => {
        if (!time) return '';
        return time.replace(':00', 'h');
    };
    
    let message = '';
    if (dayStatus.statusKey === 'not-started') {
        const openTime = formatTime(dayStatus.openTime);
        const closeTime = formatTime(dayStatus.closeTime);
        message = `Atendimento ainda não iniciado. Horário: ${openTime} às ${closeTime}`;
    } else if (dayStatus.statusKey === 'finished') {
        const openTime = formatTime(dayStatus.openTime);
        const closeTime = formatTime(dayStatus.closeTime);
        message = `Atendimento finalizado. Horário: ${openTime} às ${closeTime}`;
    } else if (dayStatus.statusKey === 'closed') {
        message = 'Fechado hoje';
    } else {
        message = 'Atendimento não disponível no momento';
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
 * Handle remove item
 */
function handleRemove(itemId) {
    removeItem(itemId);
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
    cartTotal.textContent = getTotal().toFixed(2);
    checkoutBtn.disabled = cart.length === 0;
    
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
    
    if (cart.length === 0) {
        const emptyCartEl = document.createElement('div');
        emptyCartEl.className = 'empty-cart';
        emptyCartEl.textContent = 'Carrinho vazio';
        cartItems.innerHTML = '';
        cartItems.appendChild(emptyCartEl);
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemEl = createCartItemElement(item);
        cartItems.appendChild(cartItemEl);
    });
}

/**
 * Create cart item element
 */
function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    const formattedName = formatItemName(item);
    
    // Formatar preço: se quantidade > 1, mostrar cálculo; senão, apenas o preço unitário
    let priceDisplay;
    if (item.quantity > 1) {
        const total = item.price * item.quantity;
        priceDisplay = `R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${total.toFixed(2)}`;
    } else {
        priceDisplay = `R$ ${item.price.toFixed(2)}`;
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
    removeBtn.addEventListener('click', () => handleRemove(item.id));
    
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
    
    const total = getTotal();
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
    
    // Get delivery method
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
            price: item.price
        })),
        total: total,
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
 * Get current time in Brasília timezone (UTC-3)
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
    
    if (!dayHours || !dayHours.open || !dayHours.close) {
        return {
            isOpen: false,
            status: 'Fechado',
            statusKey: 'closed',
            openTime: null,
            closeTime: null
        };
    }
    
    // Verificar horário atual (Brasília)
    const brasiliaTime = getBrasiliaTime();
    const currentTime = `${brasiliaTime.getHours().toString().padStart(2, '0')}:${brasiliaTime.getMinutes().toString().padStart(2, '0')}`;
    
    const [openHour, openMin] = dayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = dayHours.close.split(':').map(Number);
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    const currentMinutes = currentHour * 60 + currentMin;
    
    // Verificar status baseado no horário atual
    if (currentMinutes < openMinutes) {
        // Ainda não iniciou
        return {
            isOpen: false,
            status: 'Não iniciado',
            statusKey: 'not-started',
            openTime: dayHours.open,
            closeTime: dayHours.close
        };
    } else if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        // Dentro do horário
        return {
            isOpen: true,
            status: 'Aberto',
            statusKey: 'open',
            openTime: dayHours.open,
            closeTime: dayHours.close
        };
    } else {
        // Já finalizou
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
    
    const brasiliaTime = getBrasiliaTime();
    const currentTime = `${brasiliaTime.getHours().toString().padStart(2, '0')}:${brasiliaTime.getMinutes().toString().padStart(2, '0')}`;
    
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
    statusBadge.textContent = dayStatus.status;
    
    // Container para horário e ícone
    const hoursContainer = document.createElement('div');
    hoursContainer.className = 'opening-hours-time-container';
    
    const hoursText = document.createElement('span');
    hoursText.className = 'opening-hours-time';
    
    if (dayStatus.openTime && dayStatus.closeTime) {
        const openTime = formatTimeCompact(dayStatus.openTime);
        const closeTime = formatTimeCompact(dayStatus.closeTime);
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
            // Se for o dia atual, usar status real; senão, mostrar apenas "Aberto"
            if (isCurrentDay) {
                const dayStatus = getCurrentDayStatus();
                const statusClass = dayStatus.statusKey ? `status-${dayStatus.statusKey}` : 'status-open';
                statusBadge.className = `hours-status-badge ${statusClass}`;
                statusBadge.textContent = dayStatus.status;
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

