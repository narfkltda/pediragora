/**
 * Template Client Page - Script
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
    restaurantName: 'Nome do Restaurante',
    whatsappNumber: '67982077085', // Format: DDD + number (no spaces or special chars)
    logoPath: '../../assets/images/logo-placeholder.png',
    openingHours: {
        segunda: null, // Fechado na segunda-feira
        terca: { open: '19:00', close: '23:00' },
        quarta: { open: '19:00', close: '23:00' },
        quinta: { open: '19:00', close: '23:00' },
        sexta: { open: '19:00', close: '23:00' },
        sabado: { open: '19:00', close: '23:00' },
        domingo: { open: '19:00', close: '23:00' }
    }
};

// Menu data
const MENU_DATA = {
    categories: ['Todos', 'Burgers'],
    items: [
        {
            id: '1',
            name: 'X-Salada',
            description: 'Hambúrguer com alface, tomate, cebola e maionese',
            price: 18.00,
            category: 'Burgers',
            image: '../../assets/images/x-salada.jpg'
        },
        {
            id: '2',
            name: 'X-Bacon',
            description: 'Hambúrguer com bacon crocante, alface, tomate e maionese',
            price: 22.00,
            category: 'Burgers',
            image: '../../assets/images/x-bacon.jpg'
        },
        {
            id: '3',
            name: 'X-Tudo',
            description: 'Hambúrguer completo com bacon, ovo, presunto, queijo, alface, tomate e maionese',
            price: 28.00,
            category: 'Burgers',
            image: '../../assets/images/x-tudo.jpg'
        }
    ]
};

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
    setupCustomerFieldListeners();
    setupPaymentMethodListeners();
    renderOpeningHours();
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
        itemsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">${message}</p>`;
        return;
    }
    
    filteredItems.forEach(item => {
        const card = createItemCard(item);
        itemsGrid.appendChild(card);
    });
}

/**
 * Create an item card element
 */
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ESem Imagem%3C/text%3E%3C/svg%3E'">
        <div class="item-content">
            <h3 class="item-title">${item.name}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-price">R$ ${item.price.toFixed(2)}</div>
            <button class="btn-add-cart" data-item-id="${item.id}">Adicionar ao Carrinho</button>
        </div>
    `;
    
    const addBtn = card.querySelector('.btn-add-cart');
    addBtn.addEventListener('click', () => {
        handleAddToCart(item.id);
    });
    
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
 * Setup cart toggle listeners
 */
function setupCartToggleListeners() {
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
    checkoutBtn.addEventListener('click', () => {
        handleCheckout();
    });
}

/**
 * Setup customer field listeners
 */
function setupCustomerFieldListeners() {
    customerNameInput.addEventListener('input', () => {
        saveCustomerData(customerNameInput.value.trim(), customerNotesInput.value.trim());
    });
    
    customerNotesInput.addEventListener('input', () => {
        saveCustomerData(customerNameInput.value.trim(), customerNotesInput.value.trim());
    });
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
    changeValue.style.color = '#27ae60';
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
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = getTotal().toFixed(2);
    checkoutBtn.disabled = cart.length === 0;
    
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
        cartItems.innerHTML = '<div class="empty-cart">Carrinho vazio</div>';
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
    
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E'">
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" data-action="decrease" data-item-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-item-id="${item.id}">+</button>
            </div>
        </div>
        <button class="cart-item-remove" data-item-id="${item.id}">Remover</button>
    `;
    
    const decreaseBtn = div.querySelector('[data-action="decrease"]');
    const increaseBtn = div.querySelector('[data-action="increase"]');
    const removeBtn = div.querySelector('.cart-item-remove');
    
    decreaseBtn.addEventListener('click', () => handleDecrease(item.id));
    increaseBtn.addEventListener('click', () => handleIncrease(item.id));
    removeBtn.addEventListener('click', () => handleRemove(item.id));
    
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
    
    const order = {
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: total,
        customerName: customerNameInput.value.trim(),
        notes: customerNotesInput.value.trim(),
        paymentMethod: paymentMethod,
        changeAmount: changeAmount,
        change: change
    };
    
    sendToWhatsApp(CONFIG.whatsappNumber, order);
}

/**
 * Get all days of week in Portuguese
 */
function getAllDaysInPortuguese() {
    return [
        { key: 'domingo', name: 'Domingo' },
        { key: 'segunda', name: 'Segunda' },
        { key: 'terca', name: 'Terça' },
        { key: 'quarta', name: 'Quarta' },
        { key: 'quinta', name: 'Quinta' },
        { key: 'sexta', name: 'Sexta' },
        { key: 'sabado', name: 'Sábado' }
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
        
        // Day name
        const dayName = document.createElement('div');
        dayName.className = 'opening-hours-day-name';
        dayName.textContent = day.name;
        card.appendChild(dayName);
        
        // Status
        const status = document.createElement('div');
        status.className = 'opening-hours-day-status';
        
        if (!dayHours || !dayHours.open || !dayHours.close) {
            status.textContent = 'Fechado!';
            status.classList.add('closed');
        } else {
            // Check if currently open (only for current day)
            if (isCurrentDay && isCurrentlyOpen(day.key, dayHours.open, dayHours.close)) {
                status.textContent = 'Aberto';
                status.classList.add('open');
            } else {
                status.textContent = 'Fechado!';
                status.classList.add('closed');
            }
        }
        card.appendChild(status);
        
        // Time
        const time = document.createElement('div');
        time.className = 'opening-hours-day-time';
        if (dayHours && dayHours.open && dayHours.close) {
            time.textContent = `${dayHours.open} - ${dayHours.close}`;
        } else {
            time.textContent = 'Fechado';
        }
        card.appendChild(time);
        
        openingHoursContainer.appendChild(card);
    });
}

