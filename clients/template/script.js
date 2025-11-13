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
    logoPath: '../../assets/images/logo-placeholder.png'
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const restaurantNameEl = document.querySelector('.restaurant-name');
    if (restaurantNameEl) {
        restaurantNameEl.textContent = CONFIG.restaurantName;
    }
    
    const cart = getCart();
    const customerData = loadCustomerData();
    
    customerNameInput.value = customerData.name || '';
    customerNotesInput.value = customerData.notes || '';
    
    renderCategories();
    renderItems();
    renderCartUI();
    
    setupCategoryListeners();
    setupSearchListeners();
    setupCartToggleListeners();
    setupCustomerFieldListeners();
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
    
    const order = {
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: getTotal(),
        customerName: customerNameInput.value.trim(),
        notes: customerNotesInput.value.trim()
    };
    
    sendToWhatsApp(CONFIG.whatsappNumber, order);
}

