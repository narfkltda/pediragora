/**
 * Admin Panel - Tempero & Sabor
 * Gerencia produtos e configurações do restaurante
 */

import { 
  signOut,
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from '../firebase-config.js';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../services/products-service.js';
import { 
  getIngredients,
  getActiveIngredients,
  addIngredient,
  updateIngredient,
  deleteIngredient
} from '../services/ingredients-service.js';
import { 
  getRestaurantConfig, 
  saveRestaurantConfig 
} from '../services/config-service.js';
import { uploadProductImage } from '../services/storage-service.js';

// Elementos DOM - Produtos
const productsGrid = document.getElementById('products-grid');
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
let productModalContent = null; // Será inicializado no DOMContentLoaded
const productForm = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const cancelBtn = document.getElementById('cancel-btn');
const productsLoading = document.getElementById('products-loading');
const productIngredientsList = document.getElementById('product-ingredients-list');
const productDefaultIngredientsList = document.getElementById('product-default-ingredients-list');
const productDescriptionInput = document.getElementById('product-description');
const selectAllAvailableBtn = document.getElementById('select-all-available-btn');
const feedbackModal = document.getElementById('feedback-modal');
const feedbackModalClose = document.getElementById('feedback-modal-close');
const feedbackModalOk = document.getElementById('feedback-modal-ok');
const feedbackModalBody = document.getElementById('feedback-modal-body');
const feedbackModalTitle = document.getElementById('feedback-modal-title');

// Elementos DOM - Modal de Confirmação
const confirmModal = document.getElementById('confirm-modal');
const confirmModalClose = document.getElementById('confirm-modal-close');
const confirmModalCancel = document.getElementById('confirm-modal-cancel');
const confirmModalConfirm = document.getElementById('confirm-modal-confirm');
const confirmModalMessage = document.getElementById('confirm-modal-message');
const confirmModalTitle = document.getElementById('confirm-modal-title');

// Elementos DOM - Upload de Imagem (serão inicializados após DOM carregar)
let productImageInput;
let productImageUrl;
let imageUploadArea;
let imageUploadPlaceholder;
let imagePreviewContainer;
let imagePreviewOriginal;
let previewOriginalImg;
let removeImageBtn;
let imageUploadLoading;

// Elementos DOM - Ingredientes
const ingredientsGrid = document.getElementById('ingredients-grid');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const ingredientModal = document.getElementById('ingredient-modal');
let ingredientModalContent = null; // Será inicializado no DOMContentLoaded
const ingredientForm = document.getElementById('ingredient-form');
const ingredientBatchForm = document.getElementById('ingredient-batch-form');
const ingredientModalTitle = document.getElementById('ingredient-modal-title');
const ingredientModalClose = document.getElementById('ingredient-modal-close');
const cancelIngredientBtn = document.getElementById('cancel-ingredient-btn');
const cancelIngredientBatchBtn = document.getElementById('cancel-ingredient-batch-btn');
const ingredientsLoading = document.getElementById('ingredients-loading');
const modalTabs = document.querySelectorAll('.modal-tab');
const modalTabContents = document.querySelectorAll('.modal-tab-content');

// Elementos DOM - Gerais
const logoutBtn = document.getElementById('logout-btn');
const navButtons = document.querySelectorAll('.nav-btn');
const adminSections = document.querySelectorAll('.admin-section');
const configForm = document.getElementById('config-form');

// Elementos DOM - Controles de Seleção e Filtros
const selectAllCheckbox = document.getElementById('select-all-checkbox');
const selectionCount = document.getElementById('selection-count');
const activateSelectedBtn = document.getElementById('activate-selected-btn');
const deactivateSelectedBtn = document.getElementById('deactivate-selected-btn');
const deleteSelectedBtn = document.getElementById('delete-selected-btn');
const categoryFilter = document.getElementById('category-filter');
const productSearchInput = document.getElementById('product-search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');

// Elementos DOM - Controles de Seleção e Filtros de Ingredientes
const selectAllIngredientsCheckbox = document.getElementById('select-all-ingredients-checkbox');
const ingredientsSelectionCount = document.getElementById('ingredients-selection-count');
const activateSelectedIngredientsBtn = document.getElementById('activate-selected-ingredients-btn');
const deactivateSelectedIngredientsBtn = document.getElementById('deactivate-selected-ingredients-btn');
const deleteSelectedIngredientsBtn = document.getElementById('delete-selected-ingredients-btn');
const ingredientSearchInput = document.getElementById('ingredient-search-input');
const clearIngredientSearchBtn = document.getElementById('clear-ingredient-search-btn');

// Estado
let products = [];
let ingredients = [];
let editingProductId = null;
let editingIngredientId = null;
let currentImageFile = null;
let defaultIngredientsOrder = [];
let confirmCallback = null;

// Estado para seleção e filtros
let selectedProducts = []; // Array de IDs selecionados
let currentCategoryFilter = 'all';
let currentSearchTerm = '';
let allProducts = []; // Todos os produtos (sem filtros)
let filteredProducts = []; // Produtos após aplicar filtros

// Estado para seleção e filtros de ingredientes
let selectedIngredients = []; // Array de IDs selecionados
let currentIngredientSearchTerm = '';
let allIngredients = []; // Todos os ingredientes (sem filtros)
let filteredIngredients = []; // Ingredientes após aplicar filtros

// Estado para controle de scroll das modais (estilo sidebar)
let modalScrollPosition = 0;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar elementos DOM de modal content (sidebar)
    if (productModal) {
        productModalContent = productModal.querySelector('.modal-content');
    }
    if (ingredientModal) {
        ingredientModalContent = ingredientModal.querySelector('.modal-content');
    }
    
    // Inicializar elementos DOM de upload de imagem
    productImageInput = document.getElementById('product-image-input');
    productImageUrl = document.getElementById('product-image-url');
    imageUploadArea = document.getElementById('image-upload-area');
    imageUploadPlaceholder = document.getElementById('image-upload-placeholder');
    imagePreviewContainer = document.getElementById('image-preview-container');
    imagePreviewOriginal = document.getElementById('image-preview-original');
    previewOriginalImg = document.getElementById('preview-original-img');
    removeImageBtn = document.getElementById('remove-image-btn');
    imageUploadLoading = document.getElementById('image-upload-loading');
    
    // Inicializar elementos de seleção e filtros (podem não existir em outras seções)
    // Esses elementos serão verificados nas funções antes de uso
    
    checkAuth();
    setupEventListeners();
    setupNavigation();
});

// Verificar autenticação
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('Usuário autenticado:', user.email);
            loadProducts();
            loadIngredients();
            loadConfig();
        } else {
            console.log('Usuário não autenticado');
            window.location.href = 'login.html';
        }
    });
}

// ==================== FUNÇÕES DE PROGRESSO NO BOTÃO ====================

/**
 * Configurar botão com loading e barra de progresso
 * @param {HTMLElement} button - Botão a ser configurado
 * @param {string} text - Texto a ser exibido
 */
function setupButtonWithProgress(button, text) {
    if (!button) return;
    
    button.disabled = true;
    
    // Criar estrutura de progresso se não existir
    let progressBar = button.querySelector('.progress-bar');
    let buttonText = button.querySelector('.button-text');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        button.appendChild(progressBar);
    }
    
    if (!buttonText) {
        buttonText = document.createElement('span');
        buttonText.className = 'button-text';
        // Mover conteúdo existente para buttonText
        const existingContent = Array.from(button.childNodes);
        existingContent.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('progress-bar'))) {
                buttonText.appendChild(node);
            }
        });
        button.appendChild(buttonText);
    }
    
    // Adicionar spinner se não existir
    let spinner = buttonText.querySelector('.spinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.className = 'spinner';
        buttonText.insertBefore(spinner, buttonText.firstChild);
    }
    
    buttonText.innerHTML = `<div class="spinner"></div>${text}`;
    progressBar.style.width = '0%';
}

/**
 * Atualizar progresso do botão
 * @param {HTMLElement} button - Botão a ser atualizado
 * @param {number} progress - Progresso (0-100)
 * @param {string} text - Texto a ser exibido
 */
function updateButtonProgress(button, progress, text) {
    if (!button) return;
    
    const progressBar = button.querySelector('.progress-bar');
    const buttonText = button.querySelector('.button-text');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    if (buttonText) {
        buttonText.innerHTML = `<div class="spinner"></div>${text} ${progress}%`;
    } else {
        button.innerHTML = `<div class="spinner"></div>${text} ${progress}%`;
    }
}

/**
 * Resetar botão removendo loading e progresso
 * @param {HTMLElement} button - Botão a ser resetado
 * @param {string} text - Texto final do botão
 */
function resetButtonProgress(button, text) {
    if (!button) return;
    
    button.disabled = false;
    
    const progressBar = button.querySelector('.progress-bar');
    const buttonText = button.querySelector('.button-text');
    
    if (progressBar) {
        progressBar.style.width = '0%';
        // Remover barra de progresso se necessário
        setTimeout(() => {
            if (progressBar && progressBar.style.width === '0%') {
                progressBar.remove();
            }
        }, 300);
    }
    
    if (buttonText) {
        buttonText.innerHTML = text;
        // Remover spinner se existir
        const spinner = buttonText.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
    } else {
        // Limpar todo o conteúdo e adicionar apenas o texto
        button.innerHTML = text;
    }
}

// ==================== FUNÇÕES DE MODAL (SIDEBAR ESTILO CARRINHO) ====================

/**
 * Abrir modal como sidebar (estilo carrinho)
 * @param {HTMLElement} modalOverlay - Elemento overlay da modal
 * @param {HTMLElement} modalContent - Elemento content da modal
 */
function openModal(modalOverlay, modalContent) {
    if (!modalOverlay || !modalContent) return;
    
    // Salvar posição de scroll atual
    modalScrollPosition = window.pageYOffset || document.documentElement.scrollTop || window.scrollY;
    
    // Adicionar classes para abrir
    modalOverlay.classList.add('active');
    modalContent.classList.add('open');
    
    // Bloquear scroll do body (igual carrinho)
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
    document.body.style.top = `-${modalScrollPosition}px`;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
}

/**
 * Fechar modal sidebar
 * @param {HTMLElement} modalOverlay - Elemento overlay da modal
 * @param {HTMLElement} modalContent - Elemento content da modal
 */
function closeModal(modalOverlay, modalContent) {
    if (!modalOverlay || !modalContent) return;
    
    // Remover classes
    modalOverlay.classList.remove('active');
    modalContent.classList.remove('open');
    
    // Restaurar scroll do body
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.top = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.height = '';
    
    // Restaurar posição de scroll
    window.scrollTo(0, modalScrollPosition);
}

// Carregar produtos
async function loadProducts() {
    try {
        productsLoading.style.display = 'block';
        productsGrid.innerHTML = '';
        
        allProducts = await getProducts();
        products = allProducts;
        
        // Debug detalhado: verificar imagens dos produtos
        console.log('🔍 [DEBUG] Produtos carregados:', allProducts.length);
        let produtosComImagem = 0;
        let produtosSemImagem = 0;
        allProducts.forEach(product => {
            const hasImage = product.image && product.image.trim() !== '';
            if (!hasImage) {
                produtosSemImagem++;
                console.warn(`⚠️ [DEBUG] Produto "${product.name}" (ID: ${product.id}) NÃO tem imagem`);
                console.warn(`   - product.image:`, product.image);
                console.warn(`   - Tipo:`, typeof product.image);
            } else {
                produtosComImagem++;
                const imageUrl = product.image;
                console.log(`✅ [DEBUG] Produto "${product.name}" (ID: ${product.id}) tem imagem`);
                console.log(`   - URL completa:`, imageUrl);
                console.log(`   - Tipo:`, typeof imageUrl);
                console.log(`   - Tamanho:`, imageUrl.length, 'caracteres');
                console.log(`   - Começa com http:`, imageUrl.startsWith('http'));
                console.log(`   - Começa com https:`, imageUrl.startsWith('https'));
                console.log(`   - Contém firebasestorage:`, imageUrl.includes('firebasestorage'));
            }
        });
        console.log(`📊 [DEBUG] Resumo: ${produtosComImagem} com imagem, ${produtosSemImagem} sem imagem`);
        
        populateCategoryFilter();
        applyFilters();
        
        productsLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showToast('Erro ao carregar produtos', 'error');
        productsLoading.style.display = 'none';
    }
}

// Renderizar produtos
function renderProducts() {
    console.log('🎨 [DEBUG] renderProducts() chamado');
    console.log('   - filteredProducts.length:', filteredProducts.length);
    console.log('   - allProducts.length:', allProducts.length);
    
    productsGrid.innerHTML = '';
    
    // Usar filteredProducts em vez de products
    const productsToRender = filteredProducts.length > 0 ? filteredProducts : products;
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <p>${currentSearchTerm || currentCategoryFilter !== 'all' ? 'Nenhum produto encontrado com os filtros aplicados.' : 'Nenhum produto cadastrado ainda.'}</p>
                ${!currentSearchTerm && currentCategoryFilter === 'all' ? `
                <button class="btn-primary" onclick="document.getElementById('add-product-btn').click()">
                    Adicionar Primeiro Produto
                </button>
                ` : ''}
            </div>
        `;
        updateSelectionUI();
        return;
    }
    
    // Agrupar por categoria para numeração
    const productsByCategory = {};
    productsToRender.forEach(product => {
        if (!productsByCategory[product.category]) {
            productsByCategory[product.category] = [];
        }
        productsByCategory[product.category].push(product);
    });
    
    // Ordenar produtos dentro de cada categoria por número (quando disponível)
    Object.keys(productsByCategory).forEach(category => {
        productsByCategory[category].sort((a, b) => {
            // Para Bebidas, ordenar apenas por nome
            if (category === 'Bebidas') {
                return (a.name || '').localeCompare(b.name || '');
            }
            
            // Para outras categorias, ordenar por número se disponível
            const aNumber = a.number !== null && a.number !== undefined ? Number(a.number) : null;
            const bNumber = b.number !== null && b.number !== undefined ? Number(b.number) : null;
            
            // Se ambos têm número, ordenar por número
            if (aNumber !== null && bNumber !== null) {
                return aNumber - bNumber;
            }
            
            // Se apenas um tem número, o que tem número vem primeiro
            if (aNumber !== null && bNumber === null) {
                return -1;
            }
            if (aNumber === null && bNumber !== null) {
                return 1;
            }
            
            // Se nenhum tem número, ordenar por nome
            return (a.name || '').localeCompare(b.name || '');
        });
    });
    
    // Renderizar produtos agrupados por categoria
    Object.keys(productsByCategory).sort().forEach(category => {
        productsByCategory[category].forEach((product) => {
        const card = document.createElement('div');
        card.className = 'item-card horizontal';
        
        // PRIMEIRA LINHA: Checkbox, Imagem, Nome + Descrição, Valor
        const firstRow = document.createElement('div');
        firstRow.className = 'item-card-first-row';
        
        // 1. Checkbox de seleção
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'product-checkbox-container';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'product-checkbox';
        checkbox.dataset.productId = product.id;
        checkbox.checked = selectedProducts.includes(product.id);
        checkbox.addEventListener('change', () => toggleProductSelection(product.id));
        checkboxContainer.appendChild(checkbox);
        
        // 2. Imagem (pequena)
        const imageContainer = document.createElement('div');
        imageContainer.className = 'item-image-container';
        
        // Garantir que o container seja visível
        imageContainer.style.display = 'flex';
        imageContainer.style.visibility = 'visible';
        imageContainer.style.opacity = '1';
        
        const img = document.createElement('img');
        img.className = 'item-image';
        let imageUrl = product.image || '';
        
        // Normalizar URL: adicionar https:// se não tiver protocolo
        if (imageUrl && imageUrl.trim() !== '') {
            imageUrl = imageUrl.trim();
            // Se não começar com http://, https:// ou data:, adicionar https://
            if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:')) {
                console.warn(`⚠️ [DEBUG] URL sem protocolo detectada para "${product.name}", adicionando https://`);
                imageUrl = 'https://' + imageUrl;
            }
        }
        
        console.log(`🖼️ [DEBUG] Renderizando imagem para "${product.name}"`);
        console.log(`   - URL original:`, product.image);
        console.log(`   - URL normalizada:`, imageUrl);
        
        // Sempre definir alt e loading primeiro
        img.alt = escapeHtml(product.name);
        img.loading = 'lazy';
        img.style.display = 'block';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.visibility = 'visible';
        img.style.opacity = '1';
        
        // Configurar imagem - aceitar qualquer URL não vazia
        if (imageUrl && imageUrl.trim() !== '') {
            console.log(`   - Definindo src da imagem:`, imageUrl);
            img.src = imageUrl;
            
            img.onerror = function() {
                console.error(`❌ [DEBUG] Erro ao carregar imagem do produto: "${product.name}"`);
                console.error(`   - URL tentada:`, imageUrl);
                console.error(`   - this.src atual:`, this.src);
                console.error(`   - Tipo de erro:`, this.error || 'desconhecido');
                
                // Verificar se é erro de CORS
                if (imageUrl.includes('firebasestorage')) {
                    console.error('⚠️ Possível problema de CORS ou URL inválida do Firebase Storage');
                    console.error('Verifique se a URL está correta e se as regras do Storage permitem leitura pública');
                }
                
                // Mostrar placeholder de erro
                this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ESem Imagem%3C/text%3E%3C/svg%3E';
                this.onerror = null; // Prevenir loop infinito
            };
            
            img.onload = function() {
                console.log(`✅ [DEBUG] Imagem carregada com sucesso no card: "${product.name}"`);
                console.log(`   - Dimensões: ${this.naturalWidth}x${this.naturalHeight}`);
            };
        } else {
            // Sem imagem - mostrar placeholder
            console.warn(`⚠️ [DEBUG] Produto "${product.name}" não tem URL de imagem, usando placeholder`);
            img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ESem Imagem%3C/text%3E%3C/svg%3E';
        }
        
        // Sempre anexar a imagem ao container
        if (imageContainer) {
            imageContainer.appendChild(img);
            console.log(`   - Imagem anexada ao container para "${product.name}"`);
        } else {
            console.error(`❌ [DEBUG] imageContainer não existe para "${product.name}"`);
        }
        
        // 3. Nome e Descrição (em container vertical)
        const contentContainer = document.createElement('div');
        contentContainer.className = 'item-content';
        
        const title = document.createElement('h3');
        title.className = 'item-title';
        // Formatar nome com numeração (exceto Bebidas) - NÃO usar index para evitar problemas
        const formattedName = formatProductName(product);
        title.textContent = escapeHtml(formattedName);
        
        const description = document.createElement('p');
        description.className = 'item-description';
        description.textContent = escapeHtml(product.description || '');
        
        contentContainer.appendChild(title);
        contentContainer.appendChild(description);
        
        // 4. Preço (Valor)
        const price = document.createElement('div');
        price.className = 'item-price';
        price.textContent = `R$ ${product.price.toFixed(2)}`;
        
        // Adicionar elementos à primeira linha
        firstRow.appendChild(checkboxContainer);
        firstRow.appendChild(imageContainer);
        firstRow.appendChild(contentContainer);
        firstRow.appendChild(price);
        
        // SEGUNDA LINHA: Status, Categoria, Botões
        const secondRow = document.createElement('div');
        secondRow.className = 'item-card-second-row';
        
        // 1. Status (disponibilidade)
        const status = document.createElement('span');
        status.className = `product-status-badge ${product.available ? 'available' : 'unavailable'}`;
        status.textContent = product.available ? '✓ Disponível' : '✗ Indisponível';
        
        // 2. Categoria
        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'product-category-badge';
        categoryBadge.textContent = escapeHtml(product.category);
        
        // 3. Botões
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'item-buttons';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '✏️ Editar';
        editBtn.onclick = () => editProduct(product.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '🗑️ Excluir';
        deleteBtn.onclick = () => deleteProductConfirm(product.id);
        
        buttonsContainer.appendChild(editBtn);
        buttonsContainer.appendChild(deleteBtn);
        
        // Adicionar elementos à segunda linha
        secondRow.appendChild(status);
        secondRow.appendChild(categoryBadge);
        secondRow.appendChild(buttonsContainer);
        
        // Adicionar as duas linhas ao card
        card.appendChild(firstRow);
        card.appendChild(secondRow);
        
        productsGrid.appendChild(card);
        });
    });
    
    updateSelectionUI();
}

// Popular dropdown de categorias
function populateCategoryFilter() {
    if (!categoryFilter) return;
    
    // Limpar opções existentes (exceto "Todas as Categorias")
    const allOption = categoryFilter.querySelector('option[value="all"]');
    categoryFilter.innerHTML = '';
    if (allOption) {
        categoryFilter.appendChild(allOption);
    } else {
        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = 'Todas as Categorias';
        categoryFilter.appendChild(defaultOption);
    }
    
    // Obter categorias únicas dos produtos
    const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))].sort();
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Aplicar filtros (categoria + busca)
function applyFilters() {
    filteredProducts = [...allProducts];
    
    // Filtro por categoria
    if (currentCategoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategoryFilter);
    }
    
    // Filtro por busca
    if (currentSearchTerm.trim()) {
        const searchLower = currentSearchTerm.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower)
        );
    }
    
    // Remover seleções de produtos que não estão mais visíveis
    selectedProducts = selectedProducts.filter(id => 
        filteredProducts.some(p => p.id === id)
    );
    
    renderProducts();
}

// Filtrar por categoria
function filterByCategory(category) {
    currentCategoryFilter = category;
    applyFilters();
}

// Buscar produtos por nome
function searchProducts(term) {
    currentSearchTerm = term;
    applyFilters();
}

// Buscar ingredientes
function searchIngredients(term) {
    currentIngredientSearchTerm = term;
    applyIngredientFilters();
}

// Aplicar filtros de ingredientes (busca)
function applyIngredientFilters() {
    filteredIngredients = [...allIngredients];
    
    // Filtro por busca
    if (currentIngredientSearchTerm.trim()) {
        const searchLower = currentIngredientSearchTerm.toLowerCase().trim();
        filteredIngredients = filteredIngredients.filter(i => {
            return i.name.toLowerCase().includes(searchLower);
        });
    }
    
    // Remover seleções de ingredientes que não estão mais visíveis
    selectedIngredients = selectedIngredients.filter(id => 
        filteredIngredients.some(i => i.id === id)
    );
    
    renderIngredients();
}

// Toggle selecionar todos
function toggleSelectAll() {
    if (!selectAllCheckbox) return;
    
    const isChecked = selectAllCheckbox.checked;
    const visibleProductIds = filteredProducts.map(p => p.id);
    
    if (isChecked) {
        // Adicionar todos os produtos visíveis
        visibleProductIds.forEach(id => {
            if (!selectedProducts.includes(id)) {
                selectedProducts.push(id);
            }
        });
    } else {
        // Remover apenas os produtos visíveis
        selectedProducts = selectedProducts.filter(id => !visibleProductIds.includes(id));
    }
    
    // Atualizar checkboxes individuais
    document.querySelectorAll('.product-checkbox').forEach(checkbox => {
        checkbox.checked = selectedProducts.includes(checkbox.dataset.productId);
    });
    
    updateSelectionUI();
}

// Toggle seleção de produto individual
function toggleProductSelection(productId) {
    const index = selectedProducts.indexOf(productId);
    if (index > -1) {
        selectedProducts.splice(index, 1);
    } else {
        selectedProducts.push(productId);
    }
    
    updateSelectionUI();
}

// Atualizar UI de seleção
function updateSelectionUI() {
    if (!selectAllCheckbox || !selectionCount) return;
    
    const visibleProductIds = filteredProducts.map(p => p.id);
    const selectedVisible = visibleProductIds.filter(id => selectedProducts.includes(id));
    
    // Atualizar checkbox "Selecionar Todos"
    if (visibleProductIds.length > 0) {
        selectAllCheckbox.checked = selectedVisible.length === visibleProductIds.length;
        selectAllCheckbox.indeterminate = selectedVisible.length > 0 && selectedVisible.length < visibleProductIds.length;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
    
    // Atualizar contador
    const totalSelected = selectedProducts.length;
    if (totalSelected > 0) {
        selectionCount.textContent = `(${totalSelected} selecionado${totalSelected > 1 ? 's' : ''})`;
        selectionCount.style.display = 'inline';
    } else {
        selectionCount.textContent = '';
        selectionCount.style.display = 'none';
    }
    
    // Habilitar/desabilitar botões de ação
    const hasSelection = selectedProducts.length > 0;
    if (activateSelectedBtn) activateSelectedBtn.disabled = !hasSelection;
    if (deactivateSelectedBtn) deactivateSelectedBtn.disabled = !hasSelection;
    if (deleteSelectedBtn) deleteSelectedBtn.disabled = !hasSelection;
}

// Ativar produtos selecionados
async function activateSelected() {
    if (selectedProducts.length === 0) return;
    
    try {
        productsLoading.style.display = 'block';
        let successCount = 0;
        let errorCount = 0;
        
        for (const productId of selectedProducts) {
            try {
                await updateProduct(productId, { available: true });
                successCount++;
            } catch (error) {
                console.error(`Erro ao ativar produto ${productId}:`, error);
                errorCount++;
            }
        }
        
        await loadProducts();
        
        if (successCount > 0) {
            showToast(`${successCount} produto(s) ativado(s) com sucesso!`, 'success');
        }
        if (errorCount > 0) {
            showToast(`Erro ao ativar ${errorCount} produto(s)`, 'error');
        }
        
        selectedProducts = [];
        updateSelectionUI();
        productsLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao ativar produtos:', error);
        showToast('Erro ao ativar produtos', 'error');
        productsLoading.style.display = 'none';
    }
}

// Desativar produtos selecionados
async function deactivateSelected() {
    if (selectedProducts.length === 0) return;
    
    try {
        productsLoading.style.display = 'block';
        let successCount = 0;
        let errorCount = 0;
        
        for (const productId of selectedProducts) {
            try {
                await updateProduct(productId, { available: false });
                successCount++;
            } catch (error) {
                console.error(`Erro ao desativar produto ${productId}:`, error);
                errorCount++;
            }
        }
        
        await loadProducts();
        
        if (successCount > 0) {
            showToast(`${successCount} produto(s) desativado(s) com sucesso!`, 'success');
        }
        if (errorCount > 0) {
            showToast(`Erro ao desativar ${errorCount} produto(s)`, 'error');
        }
        
        selectedProducts = [];
        updateSelectionUI();
        productsLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao desativar produtos:', error);
        showToast('Erro ao desativar produtos', 'error');
        productsLoading.style.display = 'none';
    }
}

// Excluir produtos selecionados
async function deleteSelected() {
    if (selectedProducts.length === 0) return;
    
    const count = selectedProducts.length;
    const productNames = allProducts
        .filter(p => selectedProducts.includes(p.id))
        .map(p => p.name)
        .slice(0, 3)
        .join(', ');
    const moreText = count > 3 ? ` e mais ${count - 3}` : '';
    
    showConfirmModal(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir ${count} produto(s)?\n\n${productNames}${moreText}`,
        async () => {
            try {
                productsLoading.style.display = 'block';
                let successCount = 0;
                let errorCount = 0;
                
                for (const productId of selectedProducts) {
                    try {
                        await deleteProduct(productId);
                        successCount++;
                    } catch (error) {
                        console.error(`Erro ao excluir produto ${productId}:`, error);
                        errorCount++;
                    }
                }
                
                await loadProducts();
                
                if (successCount > 0) {
                    showToast(`${successCount} produto(s) excluído(s) com sucesso!`, 'success');
                }
                if (errorCount > 0) {
                    showToast(`Erro ao excluir ${errorCount} produto(s)`, 'error');
                }
                
                selectedProducts = [];
                updateSelectionUI();
                productsLoading.style.display = 'none';
            } catch (error) {
                console.error('Erro ao excluir produtos:', error);
                showToast('Erro ao excluir produtos', 'error');
                productsLoading.style.display = 'none';
            }
        }
    );
}

// Adicionar produto
if (addProductBtn) {
    addProductBtn.addEventListener('click', async () => {
        resetProductForm();
        await loadProductDefaultIngredients();
        await loadProductIngredients();
        updateDescriptionFromDefaultIngredients();
        openModal(productModal, productModalContent);
    });
}

// Salvar produto
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar se há imagem (exceto se estiver editando e já tiver imagem)
    const existingImageUrl = productImageUrl ? productImageUrl.value.trim() : '';
    if (!currentImageFile && !existingImageUrl && !editingProductId) {
        showToast('Por favor, selecione uma imagem para o produto', 'error');
        return;
    }
    
    let imageUrl = existingImageUrl;
    
    // Fazer upload da imagem se houver nova imagem selecionada
    if (currentImageFile) {
        const submitButton = document.querySelector('.modal-footer .btn-save[form="product-form"]') ||
                            productModal?.querySelector('.modal-footer .btn-save');
        
        try {
            console.log('Iniciando upload da imagem...', currentImageFile.name);
            if (imageUploadLoading) {
                imageUploadLoading.style.display = 'block';
            }
            
            // Configurar botão com loading e progresso
            if (submitButton) {
                setupButtonWithProgress(submitButton, 'Fazendo upload...');
            }
            
            // Callback de progresso
            const onProgress = (progress) => {
                if (submitButton) {
                    updateButtonProgress(submitButton, progress, 'Fazendo upload...');
                }
            };
            
            // Adicionar timeout para evitar loop infinito
            const uploadPromise = uploadProductImage(currentImageFile, editingProductId || null, onProgress);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Upload demorou muito tempo. Verifique sua conexão e tente novamente.')), 60000); // 60 segundos
            });
            
            imageUrl = await Promise.race([uploadPromise, timeoutPromise]);
            console.log('Upload concluído com sucesso. URL:', imageUrl);
            if (productImageUrl) productImageUrl.value = imageUrl;
            
            // Atualizar botão para "Salvando..."
            if (submitButton) {
                updateButtonProgress(submitButton, 100, 'Salvando...');
            }
        } catch (error) {
            console.error('Erro detalhado ao fazer upload da imagem:', error);
            console.error('Stack trace:', error.stack);
            
            // Verificar se é erro de CORS
            const errorMsg = error.message || '';
            const isCorsError = errorMsg.includes('CORS') || 
                              errorMsg.includes('blocked by CORS') ||
                              errorMsg.includes('preflight') ||
                              errorMsg.includes('XMLHttpRequest') ||
                              (error.stack && error.stack.includes('CORS'));
            
            let displayMessage = errorMsg;
            
            // Se for CORS, mostrar mensagem mais clara
            if (isCorsError) {
                displayMessage = 'Erro de CORS: Configure as regras do Firebase Storage. Veja o console para instruções.';
                console.error('\n========================================');
                console.error('⚠️  ERRO DE CORS DETECTADO');
                console.error('========================================');
                console.error('O upload está sendo bloqueado pelas regras do Firebase Storage.');
                console.error('\n📋 SOLUÇÃO:');
                console.error('1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/storage/rules');
                console.error('2. Substitua as regras por:');
                console.error(`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`);
                console.error('3. Clique em "Publish" para publicar');
                console.error('========================================\n');
            }
            
            showToast(displayMessage, 'error');
            // Não continuar se o upload falhou
            if (imageUploadLoading) imageUploadLoading.style.display = 'none';
            if (submitButton) {
                resetButtonProgress(submitButton, 'Salvar');
            }
            return;
        } finally {
            // Sempre esconder o loading no finally (mas não resetar botão se continuou o fluxo)
            if (imageUploadLoading) {
                imageUploadLoading.style.display = 'none';
            }
        }
    }
    
    // Configurar botão para "Salvando..." se não houver upload
    const submitButton = document.querySelector('.modal-footer .btn-save[form="product-form"]') ||
                        productModal?.querySelector('.modal-footer .btn-save');
    if (submitButton && !currentImageFile) {
        setupButtonWithProgress(submitButton, 'Salvando...');
    }
    
    // Coletar ingredientes padrão selecionados na ordem de seleção
    const selectedDefaultIngredients = [];
    if (productDefaultIngredientsList) {
        // Usar a ordem de seleção (defaultIngredientsOrder) para manter a sequência
        const selectedIds = Array.from(productDefaultIngredientsList.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        // Preservar ordem: primeiro os que estão em defaultIngredientsOrder, depois os restantes
        const orderedIds = defaultIngredientsOrder.filter(id => selectedIds.includes(id));
        const remainingIds = selectedIds.filter(id => !defaultIngredientsOrder.includes(id));
        selectedDefaultIngredients.push(...orderedIds, ...remainingIds);
    }
    
    // Coletar ingredientes disponíveis selecionados
    const selectedAvailableIngredients = [];
    if (productIngredientsList) {
        const availableCheckboxes = productIngredientsList.querySelectorAll('input[type="checkbox"]:checked');
        availableCheckboxes.forEach(checkbox => {
            selectedAvailableIngredients.push(checkbox.value);
        });
    }
    
    // Gerar descrição a partir dos ingredientes padrão (se não houver descrição manual)
    let description = productDescriptionInput ? productDescriptionInput.value.trim() : '';
    if (!description && selectedDefaultIngredients.length > 0) {
        description = await generateDescriptionFromIngredients(selectedDefaultIngredients);
    }
    
    // Obter número do produto (pode ser vazio)
    const productNumberInput = document.getElementById('product-number').value.trim();
    let productNumber = null;
    if (productNumberInput) {
        const parsed = parseInt(productNumberInput, 10);
        if (!isNaN(parsed) && parsed > 0) {
            productNumber = parsed;
        } else {
            showToast('Número do produto inválido. Use um número maior que zero.', 'error');
            return;
        }
    }
    
    const productData = {
        name: document.getElementById('product-name').value.trim(),
        description: description,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: imageUrl,
        available: document.getElementById('product-available').checked,
        defaultIngredients: selectedDefaultIngredients,
        availableIngredients: selectedAvailableIngredients,
        number: productNumber // Incluir número (pode ser null)
    };

    try {
        // Atualizar botão para "Salvando..." se ainda não estiver
        if (submitButton) {
            const currentText = submitButton.querySelector('.button-text')?.textContent || submitButton.textContent;
            if (!currentText.includes('Salvando') && !currentText.includes('Fazendo upload')) {
                setupButtonWithProgress(submitButton, 'Salvando...');
            } else if (currentText.includes('Fazendo upload')) {
                updateButtonProgress(submitButton, 100, 'Salvando...');
            }
        }
        
        if (editingProductId) {
            await updateProduct(editingProductId, productData);
            showToast('Produto atualizado com sucesso!', 'success');
        } else {
            await addProduct(productData);
            showToast('Produto adicionado com sucesso!', 'success');
        }
        
        // Resetar botão
        if (submitButton) {
            resetButtonProgress(submitButton, 'Salvar');
        }
        
        // Resetar formulário e estado
        resetProductForm();
        closeModal(productModal, productModalContent);
        await loadProducts();
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showToast('Erro ao salvar produto: ' + error.message, 'error');
        
        // Resetar botão em caso de erro
        if (submitButton) {
            resetButtonProgress(submitButton, 'Salvar');
        }
    }
});

// Editar produto
window.editProduct = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    modalTitle.textContent = 'Editar Produto';
    
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-available').checked = product.available !== false;
    document.getElementById('product-number').value = product.number || ''; // Carregar número se existir
    
    // Carregar preview da imagem existente
    if (product.image) {
        loadExistingImagePreview(product.image);
    } else {
        resetImagePreview();
    }
    
    // Carregar e marcar ingredientes padrão
    // Garantir que defaultIngredients seja um array válido
    let defaultIngredientIds = [];
    if (product.defaultIngredients) {
        // Se for array, usar diretamente; se for outro tipo, converter
        defaultIngredientIds = Array.isArray(product.defaultIngredients) 
            ? [...product.defaultIngredients] 
            : [];
    }
    
    console.log('🔍 Editando produto - defaultIngredients:', defaultIngredientIds);
    console.log('🔍 Produto completo:', product);
    console.log('🔍 Tipo de defaultIngredients:', typeof product.defaultIngredients, Array.isArray(product.defaultIngredients));
    
    // Inicializar ordem ANTES de carregar para garantir que os checkboxes sejam marcados corretamente
    defaultIngredientsOrder = [...defaultIngredientIds];
    
    await loadProductDefaultIngredients(defaultIngredientIds);
    
    // Carregar e marcar ingredientes disponíveis
    await loadProductIngredients(product.availableIngredients || []);
    
    // Atualizar descrição
    updateDescriptionFromDefaultIngredients();
    
    openModal(productModal, productModalContent);
};

// Função para exibir modal de confirmação
function showConfirmModal(title, message, onConfirm) {
    if (confirmModalTitle) confirmModalTitle.textContent = title;
    if (confirmModalMessage) confirmModalMessage.textContent = message;
    if (confirmModal) confirmModal.classList.add('active');
    
    // Armazenar callback
    confirmCallback = onConfirm;
}

// Deletar produto
window.deleteProductConfirm = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    showConfirmModal(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o produto "${product.name}"?`,
        async () => {
            try {
                await deleteProduct(id);
                showToast('Produto excluído com sucesso!', 'success');
                await loadProducts();
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                showToast('Erro ao excluir produto: ' + error.message, 'error');
            }
        }
    );
};

// Carregar configurações
async function loadConfig() {
    try {
        const config = await getRestaurantConfig();
        
        document.getElementById('config-name').value = config.restaurantName || '';
        document.getElementById('config-whatsapp').value = config.whatsappNumber || '';
        document.getElementById('config-latitude').value = config.restaurantLatitude || '';
        document.getElementById('config-longitude').value = config.restaurantLongitude || '';
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

// Salvar configurações
configForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const configData = {
        restaurantName: document.getElementById('config-name').value.trim(),
        whatsappNumber: document.getElementById('config-whatsapp').value.trim(),
        restaurantLatitude: parseFloat(document.getElementById('config-latitude').value),
        restaurantLongitude: parseFloat(document.getElementById('config-longitude').value)
    };

    try {
        await saveRestaurantConfig(configData);
        showToast('Configurações salvas com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showToast('Erro ao salvar configurações: ' + error.message, 'error');
    }
});

// ==================== UPLOAD DE IMAGEM ====================

/**
 * Exibir preview da imagem
 * @param {File|Blob} imageFile - Arquivo ou blob da imagem
 */
function showImagePreview(imageFile) {
    if (!previewOriginalImg) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        if (previewOriginalImg) {
            previewOriginalImg.src = e.target.result;
        }
    };
    reader.readAsDataURL(imageFile);
}

/**
 * Resetar preview de imagem
 */
// Resetar formulário de produto
function resetProductForm() {
    editingProductId = null;
    modalTitle.textContent = 'Adicionar Produto';
    productForm.reset();
    document.getElementById('product-available').checked = true;
    document.getElementById('product-number').value = '';
    defaultIngredientsOrder = [];
    resetImagePreview();
    currentImageFile = null;
    
    // Resetar botão de submit se estiver em estado de upload
    const submitButton = productForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Salvar';
        submitButton.disabled = false;
    }
}

function resetImagePreview() {
    if (!imageUploadPlaceholder || !imagePreviewContainer) return;
    
    currentImageFile = null;
    imageUploadPlaceholder.style.display = 'flex';
    imagePreviewContainer.style.display = 'none';
    if (previewOriginalImg) previewOriginalImg.src = '';
    if (productImageUrl) productImageUrl.value = '';
    if (productImageInput) {
        productImageInput.value = '';
    }
}

/**
 * Processar imagem selecionada
 */
function handleImageSelection(file) {
    if (!file || !imageUploadPlaceholder || !imagePreviewContainer) return;

    currentImageFile = file;
    
    // Mostrar preview
    showImagePreview(file);
    imageUploadPlaceholder.style.display = 'none';
    imagePreviewContainer.style.display = 'block';
}

/**
 * Carregar preview da imagem existente (para edição)
 * @param {string} imageUrl - URL da imagem
 */
function loadExistingImagePreview(imageUrl) {
    console.log('🖼️ [DEBUG] loadExistingImagePreview chamado');
    console.log('   - URL recebida:', imageUrl);
    console.log('   - Tipo:', typeof imageUrl);
    console.log('   - É string vazia?', imageUrl === '');
    console.log('   - Trim vazio?', !imageUrl || imageUrl.trim() === '');
    
    if (!imageUrl || !imageUrl.trim()) {
        console.warn('⚠️ [DEBUG] URL vazia ou inválida, resetando preview');
        resetImagePreview();
        return;
    }

    if (!previewOriginalImg || !productImageUrl) {
        console.error('❌ [DEBUG] Elementos de preview não disponíveis');
        console.error('   - previewOriginalImg existe?', !!previewOriginalImg);
        console.error('   - productImageUrl existe?', !!productImageUrl);
        return;
    }

    // Normalizar URL: adicionar https:// se não tiver protocolo
    let normalizedUrl = imageUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://') && !normalizedUrl.startsWith('data:')) {
        console.warn('⚠️ [DEBUG] URL sem protocolo detectada, adicionando https://');
        normalizedUrl = 'https://' + normalizedUrl;
    }

    console.log('🖼️ [DEBUG] Carregando imagem existente no preview');
    console.log('   - URL original:', imageUrl);
    console.log('   - URL normalizada:', normalizedUrl);

    // Carregar imagem diretamente (sem crossOrigin para evitar problemas de CORS)
    // O Firebase Storage permite leitura pública, então não precisa de crossOrigin
    // NÃO limpar src antes de definir nova URL (pode causar flicker)
    
    // Configurar handlers ANTES de definir src
    previewOriginalImg.onload = () => {
        console.log('✅ [DEBUG] Imagem carregada com sucesso no preview');
        console.log('   - Dimensões:', previewOriginalImg.naturalWidth, 'x', previewOriginalImg.naturalHeight);
        if (imageUploadPlaceholder) {
            imageUploadPlaceholder.style.display = 'none';
            console.log('   - Placeholder escondido');
        }
        if (imagePreviewContainer) {
            imagePreviewContainer.style.display = 'block';
            console.log('   - Container de preview mostrado');
        }
    };
    
    previewOriginalImg.onerror = () => {
        console.error('❌ [DEBUG] Erro ao carregar imagem no preview');
        console.error('   - URL tentada:', normalizedUrl);
        console.error('   - this.src atual:', previewOriginalImg.src);
        // Mostrar placeholder de erro
        if (imageUploadPlaceholder) {
            imageUploadPlaceholder.style.display = 'flex';
            console.log('   - Placeholder mostrado (erro)');
        }
        if (imagePreviewContainer) {
            imagePreviewContainer.style.display = 'none';
            console.log('   - Container de preview escondido (erro)');
        }
    };
    
    // Definir src da imagem (sem limpar antes)
    console.log('   - Definindo src:', normalizedUrl);
    previewOriginalImg.src = normalizedUrl;
    
    // Atualizar campo de URL
    if (productImageUrl) {
        productImageUrl.value = normalizedUrl;
        console.log('   - Campo de URL atualizado');
    }
    
    // Mostrar container de preview imediatamente
    if (imageUploadPlaceholder) {
        imageUploadPlaceholder.style.display = 'none';
    }
    if (imagePreviewContainer) {
        imagePreviewContainer.style.display = 'block';
    }
    console.log('   - UI atualizada para mostrar preview');
}

// ==================== INGREDIENTES ====================

// Seleção de ingredientes
function toggleSelectAllIngredients() {
    if (!selectAllIngredientsCheckbox) return;
    
    const isChecked = selectAllIngredientsCheckbox.checked;
    const visibleIngredientIds = filteredIngredients.map(i => i.id);
    
    if (isChecked) {
        // Adicionar todos os ingredientes visíveis
        visibleIngredientIds.forEach(id => {
            if (!selectedIngredients.includes(id)) {
                selectedIngredients.push(id);
            }
        });
    } else {
        // Remover apenas os ingredientes visíveis
        selectedIngredients = selectedIngredients.filter(id => !visibleIngredientIds.includes(id));
    }
    
    // Atualizar checkboxes individuais
    document.querySelectorAll('.product-checkbox[data-ingredient-id]').forEach(checkbox => {
        checkbox.checked = selectedIngredients.includes(checkbox.dataset.ingredientId);
    });
    
    updateIngredientSelectionUI();
}

function toggleIngredientSelection(ingredientId) {
    const index = selectedIngredients.indexOf(ingredientId);
    if (index > -1) {
        selectedIngredients.splice(index, 1);
    } else {
        selectedIngredients.push(ingredientId);
    }
    
    updateIngredientSelectionUI();
}

// Atualizar UI de seleção de ingredientes
function updateIngredientSelectionUI() {
    if (!selectAllIngredientsCheckbox || !ingredientsSelectionCount) return;
    
    const visibleIngredientIds = filteredIngredients.map(i => i.id);
    const selectedVisible = visibleIngredientIds.filter(id => selectedIngredients.includes(id));
    
    // Atualizar checkbox "Selecionar Todos"
    if (visibleIngredientIds.length > 0) {
        selectAllIngredientsCheckbox.checked = selectedVisible.length === visibleIngredientIds.length;
        selectAllIngredientsCheckbox.indeterminate = selectedVisible.length > 0 && selectedVisible.length < visibleIngredientIds.length;
    } else {
        selectAllIngredientsCheckbox.checked = false;
        selectAllIngredientsCheckbox.indeterminate = false;
    }
    
    // Atualizar contador
    const totalSelected = selectedIngredients.length;
    if (totalSelected > 0) {
        ingredientsSelectionCount.textContent = `(${totalSelected} selecionado${totalSelected > 1 ? 's' : ''})`;
        ingredientsSelectionCount.style.display = 'inline';
    } else {
        ingredientsSelectionCount.textContent = '';
        ingredientsSelectionCount.style.display = 'none';
    }
    
    // Atualizar botões de ação em massa
    const hasSelection = selectedIngredients.length > 0;
    if (activateSelectedIngredientsBtn) {
        activateSelectedIngredientsBtn.disabled = !hasSelection;
    }
    if (deactivateSelectedIngredientsBtn) {
        deactivateSelectedIngredientsBtn.disabled = !hasSelection;
    }
    if (deleteSelectedIngredientsBtn) {
        deleteSelectedIngredientsBtn.disabled = !hasSelection;
    }
}

// Carregar ingredientes
async function loadIngredients() {
    try {
        if (ingredientsLoading) ingredientsLoading.style.display = 'block';
        if (ingredientsGrid) ingredientsGrid.innerHTML = '';
        
        ingredients = await getIngredients();
        allIngredients = [...ingredients];
        filteredIngredients = [...ingredients];
        renderIngredients();
        
        if (ingredientsLoading) ingredientsLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao carregar ingredientes:', error);
        showToast('Erro ao carregar ingredientes', 'error');
        if (ingredientsLoading) ingredientsLoading.style.display = 'none';
    }
}

// Renderizar ingredientes
function renderIngredients() {
    if (!ingredientsGrid) return;
    ingredientsGrid.innerHTML = '';
    
    // Usar filteredIngredients em vez de ingredients
    const ingredientsToRender = filteredIngredients.length > 0 ? filteredIngredients : allIngredients;
    
    if (ingredientsToRender.length === 0) {
        ingredientsGrid.innerHTML = `
            <div class="empty-state">
                <p>${currentIngredientSearchTerm ? 'Nenhum ingrediente encontrado com essa busca.' : 'Nenhum ingrediente cadastrado ainda.'}</p>
                ${!currentIngredientSearchTerm ? `
                <button class="btn-primary" onclick="document.getElementById('add-ingredient-btn').click()">
                    Adicionar Primeiro Ingrediente
                </button>
                ` : ''}
            </div>
        `;
        updateIngredientSelectionUI();
        return;
    }
    
    // Renderizar ingredientes com cards horizontais
    ingredientsToRender.forEach((ingredient) => {
        const card = document.createElement('div');
        card.className = 'item-card horizontal';
        
        // PRIMEIRA LINHA: Checkbox, Nome, Preço
        const firstRow = document.createElement('div');
        firstRow.className = 'item-card-first-row';
        
        // 1. Checkbox de seleção
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'product-checkbox-container';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'product-checkbox';
        checkbox.dataset.ingredientId = ingredient.id;
        checkbox.checked = selectedIngredients.includes(ingredient.id);
        checkbox.addEventListener('change', () => toggleIngredientSelection(ingredient.id));
        checkboxContainer.appendChild(checkbox);
        
        // 2. Nome
        const contentContainer = document.createElement('div');
        contentContainer.className = 'item-content';
        
        const title = document.createElement('h3');
        title.className = 'item-title';
        title.textContent = escapeHtml(ingredient.name);
        
        contentContainer.appendChild(title);
        
        // 3. Preço
        const price = document.createElement('div');
        price.className = 'item-price';
        price.textContent = `R$ ${ingredient.price.toFixed(2)}`;
        
        // Adicionar elementos à primeira linha
        firstRow.appendChild(checkboxContainer);
        firstRow.appendChild(contentContainer);
        firstRow.appendChild(price);
        
        // SEGUNDA LINHA: Status, Categoria, Botões
        const secondRow = document.createElement('div');
        secondRow.className = 'item-card-second-row';
        
        // 1. Status (ativo/inativo)
        const status = document.createElement('span');
        status.className = `product-status-badge ${ingredient.active ? 'available' : 'unavailable'}`;
        status.textContent = ingredient.active ? '✓ Ativo' : '✗ Inativo';
        
        // 2. Categoria (Ingrediente)
        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'product-category-badge';
        categoryBadge.textContent = 'Ingrediente';
        
        // 3. Botões
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'item-buttons';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '✏️ Editar';
        editBtn.onclick = () => editIngredient(ingredient.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '🗑️ Excluir';
        deleteBtn.onclick = () => deleteIngredientConfirm(ingredient.id);
        
        buttonsContainer.appendChild(editBtn);
        buttonsContainer.appendChild(deleteBtn);
        
        // Adicionar elementos à segunda linha
        secondRow.appendChild(status);
        secondRow.appendChild(categoryBadge);
        secondRow.appendChild(buttonsContainer);
        
        // Adicionar as duas linhas ao card
        card.appendChild(firstRow);
        card.appendChild(secondRow);
        
        ingredientsGrid.appendChild(card);
    });
    
    updateIngredientSelectionUI();
}

// Ações em massa para ingredientes
async function activateSelectedIngredients() {
    if (selectedIngredients.length === 0) return;
    
    try {
        if (ingredientsLoading) ingredientsLoading.style.display = 'block';
        let successCount = 0;
        let errorCount = 0;
        
        for (const ingredientId of selectedIngredients) {
            try {
                await updateIngredient(ingredientId, { active: true });
                successCount++;
            } catch (error) {
                console.error(`Erro ao ativar ingrediente ${ingredientId}:`, error);
                errorCount++;
            }
        }
        
        await loadIngredients();
        
        if (successCount > 0) {
            showToast(`${successCount} ingrediente(s) ativado(s) com sucesso!`, 'success');
        }
        if (errorCount > 0) {
            showToast(`Erro ao ativar ${errorCount} ingrediente(s)`, 'error');
        }
        
        selectedIngredients = [];
        updateIngredientSelectionUI();
        if (ingredientsLoading) ingredientsLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao ativar ingredientes:', error);
        showToast('Erro ao ativar ingredientes', 'error');
        if (ingredientsLoading) ingredientsLoading.style.display = 'none';
    }
}

async function deactivateSelectedIngredients() {
    if (selectedIngredients.length === 0) return;
    
    try {
        if (ingredientsLoading) ingredientsLoading.style.display = 'block';
        let successCount = 0;
        let errorCount = 0;
        
        for (const ingredientId of selectedIngredients) {
            try {
                await updateIngredient(ingredientId, { active: false });
                successCount++;
            } catch (error) {
                console.error(`Erro ao desativar ingrediente ${ingredientId}:`, error);
                errorCount++;
            }
        }
        
        await loadIngredients();
        
        if (successCount > 0) {
            showToast(`${successCount} ingrediente(s) desativado(s) com sucesso!`, 'success');
        }
        if (errorCount > 0) {
            showToast(`Erro ao desativar ${errorCount} ingrediente(s)`, 'error');
        }
        
        selectedIngredients = [];
        updateIngredientSelectionUI();
        if (ingredientsLoading) ingredientsLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao desativar ingredientes:', error);
        showToast('Erro ao desativar ingredientes', 'error');
        if (ingredientsLoading) ingredientsLoading.style.display = 'none';
    }
}

async function deleteSelectedIngredients() {
    if (selectedIngredients.length === 0) return;
    
    const count = selectedIngredients.length;
    const ingredientNames = allIngredients
        .filter(i => selectedIngredients.includes(i.id))
        .map(i => i.name)
        .slice(0, 3)
        .join(', ');
    const moreText = count > 3 ? ` e mais ${count - 3}` : '';
    
    showConfirmModal(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir ${count} ingrediente(s)?\n\n${ingredientNames}${moreText}`,
        async () => {
            try {
                if (ingredientsLoading) ingredientsLoading.style.display = 'block';
                let successCount = 0;
                let errorCount = 0;
                
                for (const ingredientId of selectedIngredients) {
                    try {
                        await deleteIngredient(ingredientId);
                        successCount++;
                    } catch (error) {
                        console.error(`Erro ao excluir ingrediente ${ingredientId}:`, error);
                        errorCount++;
                    }
                }
                
                await loadIngredients();
                
                if (successCount > 0) {
                    showToast(`${successCount} ingrediente(s) excluído(s) com sucesso!`, 'success');
                }
                if (errorCount > 0) {
                    showToast(`Erro ao excluir ${errorCount} ingrediente(s)`, 'error');
                }
                
                selectedIngredients = [];
                updateIngredientSelectionUI();
                if (ingredientsLoading) ingredientsLoading.style.display = 'none';
            } catch (error) {
                console.error('Erro ao excluir ingredientes:', error);
                showToast('Erro ao excluir ingredientes', 'error');
                if (ingredientsLoading) ingredientsLoading.style.display = 'none';
            }
        }
    );
}

// Adicionar ingrediente
if (addIngredientBtn) {
    addIngredientBtn.addEventListener('click', () => {
        editingIngredientId = null;
        ingredientModalTitle.textContent = 'Adicionar Ingrediente';
        ingredientForm.reset();
        ingredientBatchForm.reset();
        document.getElementById('ingredient-active').checked = true;
        // Ativar aba "Adicionar" por padrão (isso também atualiza os botões do footer)
        switchModalTab('single');
        openModal(ingredientModal, ingredientModalContent);
    });
}

// Trocar abas na modal de ingrediente
function switchModalTab(tabName) {
    // Atualizar botões de aba
    modalTabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Atualizar conteúdo das abas
    modalTabContents.forEach(content => {
        if (content.id === `ingredient-tab-${tabName}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Atualizar botões do footer
    const ingredientSaveBtn = document.getElementById('ingredient-save-btn');
    const ingredientBatchSaveBtn = document.getElementById('ingredient-batch-save-btn');
    if (tabName === 'single') {
        if (ingredientSaveBtn) ingredientSaveBtn.style.display = '';
        if (ingredientBatchSaveBtn) ingredientBatchSaveBtn.style.display = 'none';
    } else if (tabName === 'batch') {
        if (ingredientSaveBtn) ingredientSaveBtn.style.display = 'none';
        if (ingredientBatchSaveBtn) ingredientBatchSaveBtn.style.display = '';
    }
}

// Event listeners para abas
if (modalTabs.length > 0) {
    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchModalTab(tabName);
        });
    });
}

// Salvar ingrediente (único)
if (ingredientForm) {
    ingredientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = document.getElementById('ingredient-save-btn');
        
        const ingredientData = {
            name: document.getElementById('ingredient-name').value.trim(),
            price: parseFloat(document.getElementById('ingredient-price').value),
            active: document.getElementById('ingredient-active').checked
        };
        
        try {
            // Configurar botão com loading
            if (submitButton) {
                setupButtonWithProgress(submitButton, 'Salvando...');
            }
            
            if (editingIngredientId) {
                await updateIngredient(editingIngredientId, ingredientData);
                showToast('Ingrediente atualizado com sucesso!', 'success');
            } else {
                await addIngredient(ingredientData);
                showToast('Ingrediente adicionado com sucesso!', 'success');
            }
            
            // Resetar botão
            if (submitButton) {
                resetButtonProgress(submitButton, 'Salvar');
            }
            
            closeModal(ingredientModal, ingredientModalContent);
            await loadIngredients();
            // Recarregar listas de ingredientes no formulário de produtos
            if (productModal && productModal.classList.contains('active') && productModalContent && productModalContent.classList.contains('open')) {
                await loadProductDefaultIngredients();
                await loadProductIngredients();
                updateDescriptionFromDefaultIngredients();
            }
        } catch (error) {
            console.error('Erro ao salvar ingrediente:', error);
            showToast('Erro ao salvar ingrediente: ' + error.message, 'error');
            
            // Resetar botão em caso de erro
            if (submitButton) {
                resetButtonProgress(submitButton, 'Salvar');
            }
        }
    });
}

// Função para normalizar nome de ingrediente (trim + lowercase)
function normalizeIngredientName(name) {
    return name.trim().toLowerCase();
}

// Função para remover duplicatas da lista de ingredientes (case-insensitive)
function removeDuplicateIngredients(ingredientsList) {
    const seen = new Set();
    const unique = [];
    const duplicates = [];
    
    for (const ingredient of ingredientsList) {
        const normalized = normalizeIngredientName(ingredient);
        if (!seen.has(normalized)) {
            seen.add(normalized);
            unique.push(ingredient);
        } else {
            duplicates.push(ingredient);
        }
    }
    
    return { unique, duplicates };
}

// Processar lista com preços individuais (formato: "ingrediente1,preço1,ingrediente2,preço2")
function processIngredientsWithIndividualPrices(listText) {
    const parts = listText.split(',').map(p => p.trim()).filter(p => p.length > 0);
    const ingredients = [];
    
    for (let i = 0; i < parts.length; i += 2) {
        const name = parts[i];
        const priceStr = parts[i + 1];
        
        if (!name) continue;
        
        let price = 0;
        if (priceStr) {
            const parsedPrice = parseFloat(priceStr.replace(',', '.'));
            if (!isNaN(parsedPrice) && parsedPrice >= 0) {
                price = parsedPrice;
            }
        }
        
        ingredients.push({ name, price });
    }
    
    return ingredients;
}

// Salvar ingredientes em lote
if (ingredientBatchForm) {
    ingredientBatchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = document.getElementById('ingredient-batch-save-btn');
        
        const listText = document.getElementById('ingredient-list').value.trim();
        const priceMode = document.querySelector('input[name="price-mode"]:checked')?.value || 'none';
        const priceUniqueInput = document.getElementById('price-unique');
        const priceUnique = priceUniqueInput ? parseFloat(priceUniqueInput.value) || 0 : 0;
        
        if (!listText) {
            showToast('Por favor, digite pelo menos um ingrediente.', 'error');
            return;
        }
        
        // Validar preço único se necessário
        if (priceMode === 'unique') {
            if (!priceUniqueInput || !priceUniqueInput.value || priceUnique <= 0) {
                showToast('Por favor, informe um preço único válido maior que zero.', 'error');
                return;
            }
        }
        
        // Configurar botão com loading
        if (submitButton) {
            setupButtonWithProgress(submitButton, 'Criando ingredientes...');
        }
        
        let ingredientsList = [];
        let ingredientsWithPrices = [];
        
        // Processar lista baseado no modo de preço selecionado
        if (priceMode === 'individual') {
            // Formato: "ingrediente1,preço1,ingrediente2,preço2"
            ingredientsWithPrices = processIngredientsWithIndividualPrices(listText);
            ingredientsList = ingredientsWithPrices.map(ing => ing.name);
            
            if (ingredientsList.length === 0) {
                showToast('Formato inválido. Use: ingrediente1,preço1,ingrediente2,preço2', 'error');
                return;
            }
        } else {
            // Sem preço ou preço único - processar normalmente
            ingredientsList = listText
                .split(',')
                .map(ing => ing.trim())
                .filter(ing => ing.length > 0);
        }
        
        if (ingredientsList.length === 0) {
            showToast('Nenhum ingrediente válido encontrado.', 'error');
            if (submitButton) {
                resetButtonProgress(submitButton, 'Criar Ingredientes');
            }
            return;
        }
        
        // Remover duplicatas da lista fornecida
        const { unique: uniqueIngredients, duplicates: duplicateNames } = removeDuplicateIngredients(ingredientsList);
        
        if (uniqueIngredients.length === 0) {
            showToast('Todos os ingredientes são duplicados. Nenhum ingrediente será criado.', 'error');
            if (submitButton) {
                resetButtonProgress(submitButton, 'Criar Ingredientes');
            }
            return;
        }
        
        try {
            // Buscar ingredientes existentes no Firebase
            const existingIngredients = await getIngredients();
            const existingNames = new Set(
                existingIngredients.map(ing => normalizeIngredientName(ing.name))
            );
            
            // Filtrar ingredientes que já existem e preparar dados com preços
            const ingredientsToCreate = [];
            const alreadyExisting = [];
            
            for (const ingredientName of uniqueIngredients) {
                const normalized = normalizeIngredientName(ingredientName);
                if (existingNames.has(normalized)) {
                    alreadyExisting.push(ingredientName);
                } else {
                    // Determinar preço baseado no modo
                    let price = 0;
                    if (priceMode === 'unique') {
                        price = priceUnique;
                    } else if (priceMode === 'individual') {
                        const ingredientData = ingredientsWithPrices.find(ing => 
                            normalizeIngredientName(ing.name) === normalized
                        );
                        price = ingredientData ? ingredientData.price : 0;
                    }
                    
                    ingredientsToCreate.push({ name: ingredientName, price });
                }
            }
            
            if (ingredientsToCreate.length === 0) {
                // Exibir modal mesmo quando não há nada para criar
                showFeedbackModal({
                    title: 'Resultado da Criação de Ingredientes',
                    created: [],
                    duplicates: duplicateNames,
                    existing: alreadyExisting,
                    errors: []
                });
                showToast('Nenhum ingrediente novo para criar.', 'warning');
                
                // Resetar botão
                if (submitButton) {
                    resetButtonProgress(submitButton, 'Criar Ingredientes');
                }
                return;
            }
            
            // Criar ingredientes com progresso
            const created = [];
            const errors = [];
            const total = ingredientsToCreate.length;
            
            for (let i = 0; i < ingredientsToCreate.length; i++) {
                const { name: ingredientName, price } = ingredientsToCreate[i];
                const progress = Math.round(((i + 1) / total) * 100);
                
                // Atualizar progresso no botão
                if (submitButton) {
                    updateButtonProgress(submitButton, progress, `Criando ingredientes...`);
                }
                
                try {
                    const ingredientData = {
                        name: ingredientName,
                        price: price,
                        active: true // Ativo por padrão
                    };
                    
                    await addIngredient(ingredientData);
                    const displayName = price > 0 ? `${ingredientName} (R$ ${price.toFixed(2)})` : ingredientName;
                    created.push(displayName);
                } catch (error) {
                    console.error(`Erro ao criar ingrediente "${ingredientName}":`, error);
                    errors.push(`${ingredientName}: ${error.message}`);
                }
            }
            
            // Exibir modal de feedback
            showFeedbackModal({
                title: 'Resultado da Criação de Ingredientes',
                created: created,
                duplicates: duplicateNames,
                existing: alreadyExisting,
                errors: errors
            });
            
            // Toast rápido para feedback imediato
            if (created.length > 0) {
                showToast(`${created.length} ingrediente(s) criado(s) com sucesso!`, 'success');
            } else if (errors.length > 0) {
                showToast('Erro ao criar ingredientes.', 'error');
            }
            
            // Resetar botão
            if (submitButton) {
                resetButtonProgress(submitButton, 'Criar Ingredientes');
            }
            
            // Limpar formulário e recarregar lista
            ingredientBatchForm.reset();
            document.querySelector('input[name="price-mode"][value="none"]').checked = true;
            updatePriceModeUI();
            await loadIngredients();
            
            // Recarregar listas de ingredientes no formulário de produtos se estiver aberto
            if (productModal && productModal.classList.contains('active') && productModalContent && productModalContent.classList.contains('open')) {
                await loadProductDefaultIngredients();
                await loadProductIngredients();
                updateDescriptionFromDefaultIngredients();
            }
            
            // Fechar modal se todos foram criados com sucesso
            if (errors.length === 0 && alreadyExisting.length === 0) {
                closeModal(ingredientModal, ingredientModalContent);
            }
        } catch (error) {
            console.error('Erro ao criar ingredientes em lote:', error);
            showToast('Erro ao criar ingredientes: ' + error.message, 'error');
            
            // Resetar botão em caso de erro
            if (submitButton) {
                resetButtonProgress(submitButton, 'Criar Ingredientes');
            }
        }
    });
    
    // Atualizar UI baseado no modo de preço selecionado
    function updatePriceModeUI() {
        const priceMode = document.querySelector('input[name="price-mode"]:checked')?.value || 'none';
        const priceUniqueGroup = document.getElementById('price-unique-group');
        const ingredientList = document.getElementById('ingredient-list');
        const ingredientListHint = document.getElementById('ingredient-list-hint');
        
        if (priceMode === 'unique') {
            priceUniqueGroup.style.display = 'block';
            document.getElementById('price-unique').required = true;
            ingredientList.placeholder = 'Digite os ingredientes separados por vírgula\nExemplo: Pão, Molho Mima, Alface, Tomate, Cebola';
            ingredientListHint.textContent = 'Separe os ingredientes por vírgula. Todos receberão o preço único definido acima.';
        } else if (priceMode === 'individual') {
            priceUniqueGroup.style.display = 'none';
            document.getElementById('price-unique').required = false;
            ingredientList.placeholder = 'Digite no formato: ingrediente1,preço1,ingrediente2,preço2\nExemplo: bacon,2.99,molho,1.99,queijo,3.50';
            ingredientListHint.textContent = 'Formato: ingrediente,preço,ingrediente,preço... Use ponto ou vírgula para decimais (ex: 2.99 ou 2,99).';
        } else {
            priceUniqueGroup.style.display = 'none';
            document.getElementById('price-unique').required = false;
            ingredientList.placeholder = 'Digite os ingredientes separados por vírgula\nExemplo: Pão, Molho Mima, Alface, Tomate, Cebola';
            ingredientListHint.textContent = 'Separe os ingredientes por vírgula. Todos serão criados com preço R$ 0,00 e como ativos.';
        }
    }
    
    // Event listeners para mudança de modo de preço
    const priceModeRadios = document.querySelectorAll('input[name="price-mode"]');
    priceModeRadios.forEach(radio => {
        radio.addEventListener('change', updatePriceModeUI);
    });
    
    // Inicializar UI ao abrir modal
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', () => {
            setTimeout(() => {
                updatePriceModeUI();
            }, 100);
        });
    }
}

// Editar ingrediente
window.editIngredient = async (id) => {
    const ingredient = ingredients.find(i => i.id === id);
    if (!ingredient) return;

    editingIngredientId = id;
    ingredientModalTitle.textContent = 'Editar Ingrediente';
    
    document.getElementById('ingredient-id').value = ingredient.id;
    document.getElementById('ingredient-name').value = ingredient.name;
    document.getElementById('ingredient-price').value = ingredient.price;
    document.getElementById('ingredient-active').checked = ingredient.active !== false;
    
    // Ativar aba "Adicionar" ao editar
    switchModalTab('single');
    openModal(ingredientModal, ingredientModalContent);
};

// Deletar ingrediente
window.deleteIngredientConfirm = async (id) => {
    const ingredient = ingredients.find(i => i.id === id);
    if (!ingredient) return;
    
    showConfirmModal(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o ingrediente "${ingredient.name}"?`,
        async () => {
            try {
                await deleteIngredient(id);
                showToast('Ingrediente excluído com sucesso!', 'success');
                await loadIngredients();
                // Recarregar listas de ingredientes no formulário de produtos
                if (productModal && productModal.classList.contains('active') && productModalContent && productModalContent.classList.contains('open')) {
                    await loadProductDefaultIngredients();
                    await loadProductIngredients();
                    updateDescriptionFromDefaultIngredients();
                }
            } catch (error) {
                console.error('Erro ao excluir ingrediente:', error);
                showToast('Erro ao excluir ingrediente: ' + error.message, 'error');
            }
        }
    );
};

// Variável para rastrear a ordem de seleção dos ingredientes padrão
// defaultIngredientsOrder já declarado acima no estado

// Carregar ingredientes padrão no formulário de produto
async function loadProductDefaultIngredients(selectedIds = []) {
    if (!productDefaultIngredientsList) return;
    
    try {
        const activeIngredients = await getActiveIngredients();
        
        productDefaultIngredientsList.innerHTML = '';
        
        if (!activeIngredients || activeIngredients.length === 0) {
            productDefaultIngredientsList.innerHTML = '<p class="loading-text">Nenhum ingrediente ativo cadastrado. Adicione ingredientes na aba "Ingredientes".</p>';
            return;
        }
        
        // Inicializar ordem com os IDs já selecionados (preservar ordem se existir)
        // Só inicializar se defaultIngredientsOrder estiver vazio E selectedIds tiver valores
        if (selectedIds.length > 0 && defaultIngredientsOrder.length === 0) {
            defaultIngredientsOrder = [...selectedIds];
        }
        
        console.log('🔍 loadProductDefaultIngredients - selectedIds recebidos:', selectedIds);
        console.log('🔍 loadProductDefaultIngredients - defaultIngredientsOrder:', defaultIngredientsOrder);
        
        activeIngredients.forEach(ingredient => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '8px';
            label.style.marginBottom = '8px';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = ingredient.id;
            // Marcar checkbox se o ingrediente estiver em selectedIds
            // Converter ambos para string para garantir comparação correta
            const isSelected = selectedIds.some(id => String(id) === String(ingredient.id));
            checkbox.checked = isSelected;
            
            if (isSelected) {
                console.log(`✅ Checkbox marcado para ingrediente: ${ingredient.name} (ID: ${ingredient.id})`);
            }
            
            // Event listener para atualizar descrição em tempo real e rastrear ordem
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    // Adicionar à ordem se não estiver presente
                    if (!defaultIngredientsOrder.includes(ingredient.id)) {
                        defaultIngredientsOrder.push(ingredient.id);
                    }
                } else {
                    // Remover da ordem
                    defaultIngredientsOrder = defaultIngredientsOrder.filter(id => id !== ingredient.id);
                }
                updateDescriptionFromDefaultIngredients();
                updateIngredientPositions();
            });
            
            // Criar container para posição e nome
            const contentContainer = document.createElement('div');
            contentContainer.style.display = 'flex';
            contentContainer.style.alignItems = 'center';
            contentContainer.style.gap = '8px';
            contentContainer.style.flex = '1';
            
            // Span para posição (será atualizado)
            const positionSpan = document.createElement('span');
            positionSpan.className = 'ingredient-position';
            positionSpan.style.minWidth = '25px';
            positionSpan.style.fontWeight = 'bold';
            positionSpan.style.color = '#eeb534';
            positionSpan.setAttribute('data-ingredient-id', ingredient.id);
            
            // Span para nome
            const nameSpan = document.createElement('span');
            nameSpan.textContent = ingredient.name;
            
            contentContainer.appendChild(positionSpan);
            contentContainer.appendChild(nameSpan);
            
            label.appendChild(checkbox);
            label.appendChild(contentContainer);
            productDefaultIngredientsList.appendChild(label);
        });
        
        // Atualizar posições após carregar
        updateIngredientPositions();
    } catch (error) {
        console.error('Erro ao carregar ingredientes padrão para produto:', error);
        productDefaultIngredientsList.innerHTML = '<p class="loading-text">Erro ao carregar ingredientes.</p>';
    }
}

// Atualizar posições visuais dos ingredientes
function updateIngredientPositions() {
    if (!productDefaultIngredientsList) return;
    
    const positionSpans = productDefaultIngredientsList.querySelectorAll('.ingredient-position');
    positionSpans.forEach(span => {
        const ingredientId = span.getAttribute('data-ingredient-id');
        const checkbox = span.closest('label').querySelector('input[type="checkbox"]');
        
        if (checkbox && checkbox.checked && defaultIngredientsOrder.includes(ingredientId)) {
            const position = defaultIngredientsOrder.indexOf(ingredientId) + 1;
            span.textContent = `${position}º`;
            span.style.display = 'inline';
        } else {
            span.textContent = '';
            span.style.display = 'none';
        }
    });
}

// Carregar ingredientes disponíveis no formulário de produto
async function loadProductIngredients(selectedIds = []) {
    if (!productIngredientsList) return;
    
    try {
        const activeIngredients = await getActiveIngredients();
        
        productIngredientsList.innerHTML = '';
        
        if (!activeIngredients || activeIngredients.length === 0) {
            productIngredientsList.innerHTML = '<p class="loading-text">Nenhum ingrediente ativo cadastrado. Adicione ingredientes na aba "Ingredientes".</p>';
            updateSelectAllButtonState();
            return;
        }
        
        activeIngredients.forEach(ingredient => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '8px';
            label.style.marginBottom = '8px';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = ingredient.id;
            checkbox.checked = selectedIds.includes(ingredient.id);
            
            // Event listener para atualizar estado do botão "Selecionar Todos"
            checkbox.addEventListener('change', () => {
                updateSelectAllButtonState();
            });
            
            const span = document.createElement('span');
            span.textContent = `${ingredient.name} (R$ ${ingredient.price.toFixed(2)})`;
            
            label.appendChild(checkbox);
            label.appendChild(span);
            productIngredientsList.appendChild(label);
        });
        
        updateSelectAllButtonState();
    } catch (error) {
        console.error('Erro ao carregar ingredientes disponíveis para produto:', error);
        productIngredientsList.innerHTML = '<p class="loading-text">Erro ao carregar ingredientes.</p>';
        updateSelectAllButtonState();
    }
}

// Atualizar estado do botão "Selecionar Todos"
function updateSelectAllButtonState() {
    if (!selectAllAvailableBtn || !productIngredientsList) return;
    
    const checkboxes = productIngredientsList.querySelectorAll('input[type="checkbox"]');
    const checkedCount = productIngredientsList.querySelectorAll('input[type="checkbox"]:checked').length;
    
    if (checkboxes.length === 0) {
        selectAllAvailableBtn.style.display = 'none';
        return;
    }
    
    selectAllAvailableBtn.style.display = 'inline-block';
    
    if (checkedCount === checkboxes.length) {
        selectAllAvailableBtn.textContent = 'Deselecionar Todos';
        selectAllAvailableBtn.classList.add('deselect-all');
    } else {
        selectAllAvailableBtn.textContent = 'Selecionar Todos';
        selectAllAvailableBtn.classList.remove('deselect-all');
    }
}

// Selecionar/Deselecionar todos os ingredientes disponíveis
function toggleSelectAllAvailable() {
    if (!productIngredientsList) return;
    
    const checkboxes = productIngredientsList.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length === 0) return;
    
    const checkedCount = productIngredientsList.querySelectorAll('input[type="checkbox"]:checked').length;
    const shouldSelectAll = checkedCount < checkboxes.length;
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = shouldSelectAll;
    });
    
    updateSelectAllButtonState();
}

// Função auxiliar para capitalizar apenas a primeira letra
function capitalizeFirstLetter(str) {
    if (!str || str.length === 0) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Gerar descrição a partir dos ingredientes padrão selecionados (na ordem de seleção)
async function generateDescriptionFromIngredients(ingredientIds) {
    if (!ingredientIds || ingredientIds.length === 0) {
        return '';
    }
    
    // Buscar ingredientes do Firebase se necessário
    let ingredientsToUse = ingredients;
    if (ingredientsToUse.length === 0) {
        try {
            ingredientsToUse = await getActiveIngredients();
        } catch (error) {
            console.error('Erro ao buscar ingredientes:', error);
            return '';
        }
    }
    
    // Usar a ordem de seleção (defaultIngredientsOrder) se disponível
    // Caso contrário, usar a ordem dos IDs fornecidos
    const orderedIds = defaultIngredientsOrder.length > 0 
        ? defaultIngredientsOrder.filter(id => ingredientIds.includes(id))
        : ingredientIds;
    
    // Buscar nomes dos ingredientes na ordem de seleção e converter para minúsculas
    const ingredientNames = orderedIds
        .map(id => {
            const ingredient = ingredientsToUse.find(ing => ing.id === id);
            return ingredient ? ingredient.name.toLowerCase() : id.toLowerCase();
        })
        .filter(name => name); // Remover nomes vazios
    
    // Separar "Pão" dos outros ingredientes
    const paoIndex = ingredientNames.findIndex(name => {
        const nameLower = name.toLowerCase().trim();
        return nameLower === 'pão' || nameLower === 'pao';
    });
    
    let paoName = null;
    let otherIngredients = [];
    
    if (paoIndex !== -1) {
        paoName = ingredientNames[paoIndex];
        otherIngredients = ingredientNames.filter((_, index) => index !== paoIndex);
    } else {
        otherIngredients = ingredientNames;
    }
    
    // Se não houver ingredientes, retornar apenas "Pão" ou vazio
    if (otherIngredients.length === 0) {
        return capitalizeFirstLetter(paoName || 'pão');
    }
    
    // Formatar descrição: "Pão, ingrediente1, ingrediente2 e ingrediente3"
    // ou "Ingrediente1, ingrediente2 e ingrediente3" se não houver Pão
    const baseName = paoName || 'pão';
    
    let description = '';
    if (otherIngredients.length === 1) {
        description = `${baseName}, ${otherIngredients[0]}`;
    } else if (otherIngredients.length === 2) {
        description = `${baseName}, ${otherIngredients[0]} e ${otherIngredients[1]}`;
    } else {
        const lastIngredient = otherIngredients[otherIngredients.length - 1];
        const otherList = otherIngredients.slice(0, -1).join(', ');
        description = `${baseName}, ${otherList} e ${lastIngredient}`;
    }
    
    // Capitalizar apenas a primeira letra da descrição completa
    return capitalizeFirstLetter(description);
}

// Atualizar descrição a partir dos ingredientes padrão selecionados
async function updateDescriptionFromDefaultIngredients() {
    if (!productDefaultIngredientsList || !productDescriptionInput) return;
    
    const selectedCheckboxes = productDefaultIngredientsList.querySelectorAll('input[type="checkbox"]:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    // Atualizar ordem para incluir apenas os selecionados (preservar ordem)
    defaultIngredientsOrder = defaultIngredientsOrder.filter(id => selectedIds.includes(id));
    
    const description = await generateDescriptionFromIngredients(selectedIds);
    productDescriptionInput.value = description;
    
    // Atualizar posições visuais
    updateIngredientPositions();
}

// ==================== EVENT LISTENERS ====================

// Setup event listeners
function setupEventListeners() {
    // Fechar modal de produto
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            resetProductForm();
            closeModal(productModal, productModalContent);
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            resetProductForm();
            closeModal(productModal, productModalContent);
        });
    }
    
    // Fechar modal de ingrediente
    if (ingredientModalClose) {
        ingredientModalClose.addEventListener('click', () => {
            ingredientForm.reset();
            ingredientBatchForm.reset();
            switchModalTab('single');
            closeModal(ingredientModal, ingredientModalContent);
        });
    }
    
    if (cancelIngredientBtn) {
        cancelIngredientBtn.addEventListener('click', () => {
            ingredientForm.reset();
            ingredientBatchForm.reset();
            switchModalTab('single');
            closeModal(ingredientModal, ingredientModalContent);
        });
    }
    
    if (cancelIngredientBatchBtn) {
        cancelIngredientBatchBtn.addEventListener('click', () => {
            ingredientForm.reset();
            ingredientBatchForm.reset();
            switchModalTab('single');
            closeModal(ingredientModal, ingredientModalContent);
        });
    }
    
    // Fechar modais ao clicar no overlay
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                resetProductForm();
                closeModal(productModal, productModalContent);
            }
        });
    }
    
    if (ingredientModal) {
        ingredientModal.addEventListener('click', (e) => {
            if (e.target === ingredientModal) {
                closeModal(ingredientModal, ingredientModalContent);
            }
        });
    }
    
    // Carregar ingredientes ao abrir modal de produto
    if (addProductBtn) {
        addProductBtn.addEventListener('click', async () => {
            await loadProductIngredients();
        });
    }
    
    // Fechar modais com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (productModal && productModal.classList.contains('active')) {
                resetProductForm();
                closeModal(productModal, productModalContent);
            }
            if (ingredientModal && ingredientModal.classList.contains('active')) {
                ingredientForm.reset();
                ingredientBatchForm.reset();
                switchModalTab('single');
                closeModal(ingredientModal, ingredientModalContent);
            }
        }
    });
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja sair?')) {
                try {
                    await signOut(auth);
                    window.location.href = 'login.html';
                } catch (error) {
                    console.error('Erro ao fazer logout:', error);
                    showToast('Erro ao fazer logout', 'error');
                }
            }
        });
    }
    
    // Botão Selecionar Todos (Ingredientes Disponíveis)
    if (selectAllAvailableBtn) {
        selectAllAvailableBtn.addEventListener('click', () => {
            toggleSelectAllAvailable();
        });
    }
    
    // Fechar modal de feedback
    if (feedbackModalClose) {
        feedbackModalClose.addEventListener('click', () => {
            feedbackModal.classList.remove('active');
        });
    }
    
    if (feedbackModalOk) {
        feedbackModalOk.addEventListener('click', () => {
            feedbackModal.classList.remove('active');
        });
    }
    
    // Fechar modal de confirmação
    if (confirmModalClose) {
        confirmModalClose.addEventListener('click', () => {
            confirmModal.classList.remove('active');
        });
    }
    
    if (confirmModalCancel) {
        confirmModalCancel.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            confirmCallback = null;
        });
    }
    
    if (confirmModalConfirm) {
        confirmModalConfirm.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            if (confirmCallback) {
                confirmCallback();
                confirmCallback = null;
            }
        });
    }
    
    // Upload de imagem - File input
    if (productImageInput) {
        productImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageSelection(file);
            }
        });
    }
    
    // Upload de imagem - Drag and drop
    if (imageUploadArea) {
        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.classList.add('drag-over');
        });
        
        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.classList.remove('drag-over');
        });
        
        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                if (productImageInput) {
                    // Criar um DataTransfer para atualizar o input
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    productImageInput.files = dataTransfer.files;
                    handleImageSelection(file);
                }
            }
        });
        
        // Clique na área de upload
        imageUploadArea.addEventListener('click', (e) => {
            if (e.target === imageUploadArea || e.target.closest('.image-upload-placeholder')) {
                if (productImageInput) {
                    productImageInput.click();
                }
            }
        });
    }
    
    // Botão remover imagem
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', () => {
            resetImagePreview();
        });
    }
    
    if (feedbackModal) {
        feedbackModal.addEventListener('click', (e) => {
            if (e.target === feedbackModal) {
                feedbackModal.classList.remove('active');
            }
        });
    }
    
    // Controles de seleção em massa
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAll);
    }
    
    if (activateSelectedBtn) {
        activateSelectedBtn.addEventListener('click', activateSelected);
    }
    
    if (deactivateSelectedBtn) {
        deactivateSelectedBtn.addEventListener('click', deactivateSelected);
    }
    
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', deleteSelected);
    }
    
    // Filtro por categoria
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            filterByCategory(e.target.value);
        });
    }
    
    // Busca por nome
    if (productSearchInput) {
        productSearchInput.addEventListener('input', (e) => {
            const term = e.target.value;
            searchProducts(term);
            if (clearSearchBtn) {
                clearSearchBtn.style.display = term.trim() ? 'block' : 'none';
            }
        });
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (productSearchInput) {
                productSearchInput.value = '';
                searchProducts('');
                clearSearchBtn.style.display = 'none';
            }
        });
    }
    
    // Controles de seleção em massa de ingredientes
    if (selectAllIngredientsCheckbox) {
        selectAllIngredientsCheckbox.addEventListener('change', toggleSelectAllIngredients);
    }
    
    if (activateSelectedIngredientsBtn) {
        activateSelectedIngredientsBtn.addEventListener('click', activateSelectedIngredients);
    }
    
    if (deactivateSelectedIngredientsBtn) {
        deactivateSelectedIngredientsBtn.addEventListener('click', deactivateSelectedIngredients);
    }
    
    if (deleteSelectedIngredientsBtn) {
        deleteSelectedIngredientsBtn.addEventListener('click', deleteSelectedIngredients);
    }
    
    // Busca de ingredientes
    if (ingredientSearchInput) {
        ingredientSearchInput.addEventListener('input', (e) => {
            const term = e.target.value;
            searchIngredients(term);
            if (clearIngredientSearchBtn) {
                clearIngredientSearchBtn.style.display = term.trim() ? 'block' : 'none';
            }
        });
    }
    
    if (clearIngredientSearchBtn) {
        clearIngredientSearchBtn.addEventListener('click', () => {
            if (ingredientSearchInput) {
                ingredientSearchInput.value = '';
                searchIngredients('');
                clearIngredientSearchBtn.style.display = 'none';
            }
        });
    }
}

// Navegação entre seções
function setupNavigation() {
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            
            // Atualizar botões
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Atualizar seções
            adminSections.forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
        });
    });
}

// Utilitários
// Formatar nome do produto com numeração (exceto Bebidas)
function formatProductName(product, index = null) {
    // Don't add ID prefix for Bebidas category
    if (product.category === 'Bebidas') {
        return product.name;
    }
    
    // PRIMEIRO: Tentar usar campo 'number' do Firebase (prioridade máxima)
    if (product.number !== null && product.number !== undefined) {
        const number = String(product.number).padStart(2, '0');
        return `${number} - ${product.name}`;
    }
    
    // SEGUNDO: Tentar usar ID numérico se disponível (fallback para produtos antigos)
    if (product.id && /^\d+$/.test(product.id)) {
        const number = product.id.padStart(2, '0');
        return `${number} - ${product.name}`;
    }
    
    // Fallback: retornar nome sem numeração (NÃO usar índice, pois causa problemas)
    return product.name;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Exibir modal de feedback
function showFeedbackModal(data) {
    if (!feedbackModal || !feedbackModalBody) return;
    
    const {
        title = 'Resultado da Criação',
        created = [],
        duplicates = [],
        existing = [],
        errors = []
    } = data;
    
    feedbackModalTitle.textContent = title;
    feedbackModalBody.innerHTML = '';
    
    // Seção: Ingredientes criados
    if (created.length > 0) {
        const section = createFeedbackSection('success', '✓ Ingredientes Criados', created);
        feedbackModalBody.appendChild(section);
    }
    
    // Seção: Duplicatas removidas
    if (duplicates.length > 0) {
        const section = createFeedbackSection('warning', '⚠ Duplicatas Removidas', duplicates);
        feedbackModalBody.appendChild(section);
    }
    
    // Seção: Já existentes
    if (existing.length > 0) {
        const section = createFeedbackSection('info', 'ℹ Já Existentes', existing);
        feedbackModalBody.appendChild(section);
    }
    
    // Seção: Erros
    if (errors.length > 0) {
        const section = createFeedbackSection('error', '✗ Erros', errors);
        feedbackModalBody.appendChild(section);
    }
    
    // Se não houver nenhuma informação, mostrar mensagem
    if (created.length === 0 && duplicates.length === 0 && existing.length === 0 && errors.length === 0) {
        feedbackModalBody.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhuma informação disponível.</p>';
    }
    
    feedbackModal.classList.add('active');
}

// Criar seção de feedback
function createFeedbackSection(type, title, items) {
    const section = document.createElement('div');
    section.className = `feedback-section ${type}`;
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'feedback-section-title';
    titleDiv.textContent = `${title} (${items.length})`;
    
    const list = document.createElement('ul');
    list.className = 'feedback-list';
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = escapeHtml(item);
        list.appendChild(li);
    });
    
    section.appendChild(titleDiv);
    section.appendChild(list);
    
    return section;
}

