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
    logoPath: '../../assets/images/TemperoESaborLogo.png',
    restaurantLatitude: -20.367082707152765,
    restaurantLongitude: -51.42205139592757,
    openingHours: {
        segunda: { open: '18:00', close: '23:00' },
        terca: { open: '18:00', close: '23:00' },
        quarta: { open: '18:00', close: '23:00' },
        quinta: { open: '18:00', close: '23:00' },
        sexta: { open: '18:00', close: '23:00' },
        sabado: { open: '18:00', close: '23:00' },
        domingo: { open: '18:00', close: '23:00' }
    }
};

// Menu data
const MENU_DATA = {
    categories: ['Todos', 'Lanches'],
    items: [
        {
            id: '1',
            name: 'VÓ MIMA',
            description: 'Pão, hambúrguer de carne, queijo mussarela, bacon e molho mima',
            price: 22.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_01_voMima.png'
        },
        {
            id: '2',
            name: 'VÔ LELEU',
            description: 'Pão, hambúrguer de carne, queijo mussarela, bacon, ovo, calabresa, alface, tomate e molho mima',
            price: 28.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_02_voLeleu.png'
        },
        {
            id: '3',
            name: 'VÓ ANA',
            description: 'Pão, hambúrguer de carne, queijo mussarela, bacon, alface, tomate e molho de churrasco',
            price: 24.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_03_voAna.png'
        },
        {
            id: '4',
            name: 'TIA TÁ',
            description: 'Pão, hambúrguer de carne, queijo mussarela, queijo cheddar, bacon, alface, tomate e molho de churrasco',
            price: 27.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_04_tiaTa.png'
        },
        {
            id: '5',
            name: 'TIO JE',
            description: 'Pão, hambúrguer de frango, queijo cheddar, bacon, alface, tomate e molho mima',
            price: 24.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_05_tioJe.png'
        },
        {
            id: '6',
            name: 'TIO LAN',
            description: 'Pão, hambúrguer de picanha, queijo cheddar, bacon e molho mima',
            price: 38.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_06_tioLan.png'
        },
        {
            id: '7',
            name: 'TIA PRI',
            description: 'Pão, 3 hambúrgueres de carne, camadas de queijo mussarela, queijo cheddar, bacon e molho mima',
            price: 43.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_07_tiaPri.png'
        },
        {
            id: '8',
            name: 'TIA TAY',
            description: 'Pão, hambúrguer de pernil, queijo mussarela, bacon, alface, tomate e molho de churrasco',
            price: 25.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_08_tiaTay.png'
        },
        {
            id: '9',
            name: 'VÔ LIÓ',
            description: 'Pão, hambúrguer de carne, queijo mussarela, bacon, ovo, cebola caramelizada, alface, tomate e molho mima',
            price: 28.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_09_voLio.png'
        },
        {
            id: '10',
            name: 'NINI',
            description: 'Pão brioche, hambúrguer de carne, queijo mussarela e molho mima',
            price: 20.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_10_voNini.png'
        },
        {
            id: '11',
            name: 'VÓ SOLIS',
            description: 'Pão, hambúrguer de carne, queijo mussarela, tomate, alface, cebola roxa e molho mima',
            price: 25.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_11_voSolis.png'
        },
        {
            id: '12',
            name: 'VÔ NILTON',
            description: 'Pão, hambúrguer de carne, queijo mussarela, alface, tomate, cebola roxa, picles e molho mima',
            price: 27.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_12_voNilton.png'
        },
        {
            id: '13',
            name: 'GÊMEAS LELA',
            description: 'Pão, duplo hambúrguer de carne, duplo queijo mussarela, onion rings e molho barbecue',
            price: 33.00,
            category: 'Lanches',
            image: '../../assets/images/Burgers_13_gemeasLela.png'
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
const openingHoursContainer = document.getElementById('opening-hours-container');
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
    renderOpeningHours();
    
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
 * Render menu items dynamically
 */
function renderItems() {
    itemsGrid.innerHTML = '';
    
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
        messageEl.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px; color: #999;';
        messageEl.textContent = message;
        itemsGrid.appendChild(messageEl);
        return;
    }
    
    filteredItems.forEach(item => {
        const card = createItemCard(item);
        itemsGrid.appendChild(card);
    });
}

/**
 * Format item name with number prefix
 */
function formatItemName(item) {
    const number = item.id.padStart(2, '0');
    return `${number} - ${item.name}`;
}

/**
 * Create an item card element
 */
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const formattedName = formatItemName(item);
    
    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'item-image-container';
    
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = sanitizeHTML(item.name);
    img.className = 'item-image';
    img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ESem Imagem%3C/text%3E%3C/svg%3E';
    };
    imageContainer.appendChild(img);
    
    // Content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'item-content';
    
    const title = document.createElement('h3');
    title.className = 'item-title';
    title.textContent = formattedName;
    
    const description = document.createElement('p');
    description.className = 'item-description';
    description.textContent = item.description;
    
    const price = document.createElement('div');
    price.className = 'item-price';
    price.textContent = `R$ ${item.price.toFixed(2)}`;
    
    const buyNowBtn = document.createElement('button');
    buyNowBtn.className = 'btn-buy-now';
    buyNowBtn.setAttribute('data-item-id', item.id);
    buyNowBtn.textContent = 'Comprar Agora';
    buyNowBtn.addEventListener('click', () => {
        handleAddToCart(item.id);
        openCart();
    });
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-cart';
    addBtn.setAttribute('data-item-id', item.id);
    addBtn.textContent = 'Adicionar ao Carrinho';
    addBtn.addEventListener('click', () => {
        handleAddToCart(item.id);
    });
    
    contentContainer.appendChild(title);
    contentContainer.appendChild(description);
    contentContainer.appendChild(price);
    contentContainer.appendChild(buyNowBtn);
    contentContainer.appendChild(addBtn);
    
    card.appendChild(imageContainer);
    card.appendChild(contentContainer);
    
    return card;
}

/**
 * Setup category filter listeners
 */
function setupCategoryListeners() {
    categoryButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            const category = e.target.getAttribute('data-category');
            currentCategory = category;
            renderCategories();
            renderItems();
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
            alert('Adicione itens ao carrinho antes de continuar');
            return;
        }
        goToCartStep(2);
    } else if (currentCartStep === 2) {
        const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
        if (!selectedDelivery) {
            alert('Selecione uma forma de entrega');
            return;
        }
        if (selectedDelivery.value === 'Entrega') {
            if (!deliveryAddressInput.value.trim()) {
                alert('Informe o endereço de entrega');
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
 * Setup map toggle listener
 */
function setupMapToggleListener() {
    if (mapToggle) {
        mapToggle.addEventListener('click', () => {
            // Use exact coordinates from CONFIG
            const lat = CONFIG.restaurantLatitude;
            const lng = CONFIG.restaurantLongitude;
            // Open Google Maps with exact coordinates
            const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
            window.open(googleMapsUrl, '_blank');
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
function handleAddToCart(itemId) {
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
        alert('Carrinho vazio!');
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
            alert('Informe o endereço de entrega');
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
        alert('Informe seu nome');
        return;
    }
    
    if (!sanitizedPhone) {
        alert('Informe seu telefone');
        return;
    }
    
    // Validate phone format
    if (!validatePhone(sanitizedPhone)) {
        alert('Telefone inválido. Informe um telefone válido (10 ou 11 dígitos)');
        return;
    }
    
    if (!paymentMethod) {
        alert('Selecione uma forma de pagamento');
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
    const today = new Date().getDay();
    return days[today];
}

/**
 * Check if restaurant is currently open
 */
function isCurrentlyOpen(dayKey, openTime, closeTime) {
    if (!openTime || !closeTime) {
        return false;
    }
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
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
 * Render opening hours for all days
 */
function renderOpeningHours() {
    if (!openingHoursContainer) {
        return;
    }
    
    openingHoursContainer.innerHTML = '';
    const allDays = getAllDaysInPortuguese();
    const currentDay = getCurrentDayInPortuguese();
    
    allDays.forEach(day => {
        const dayHours = CONFIG.openingHours[day.key];
        const isCurrentDay = day.key === currentDay.key;
        
        // Create card element
        const card = document.createElement('div');
        card.className = 'opening-hours-day-card';
        
        if (isCurrentDay) {
            card.classList.add('current-day');
        }
        
        // Check if day is closed
        if (!dayHours || !dayHours.open || !dayHours.close) {
            card.classList.add('closed-day');
        }
        
        // Day name (abbreviated)
        const dayName = document.createElement('div');
        dayName.className = 'opening-hours-day-name';
        dayName.textContent = day.name;
        card.appendChild(dayName);
        
        openingHoursContainer.appendChild(card);
    });
    
    // Render current day hours below cards
    renderCurrentDayHours();
}

/**
 * Render current day hours below the cards
 */
function renderCurrentDayHours() {
    const currentTimeElement = document.getElementById('opening-hours-current-time');
    if (!currentTimeElement) {
        return;
    }
    
    const currentDay = getCurrentDayInPortuguese();
    const dayHours = CONFIG.openingHours[currentDay.key];
    
    if (dayHours && dayHours.open && dayHours.close) {
        const openTime = formatTimeCompact(dayHours.open);
        const closeTime = formatTimeCompact(dayHours.close);
        currentTimeElement.textContent = `Horário: ${openTime} às ${closeTime}`;
        currentTimeElement.style.display = 'block';
    } else {
        currentTimeElement.textContent = '';
        currentTimeElement.style.display = 'none';
    }
}

