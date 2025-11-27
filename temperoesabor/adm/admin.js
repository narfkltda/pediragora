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

// Elementos DOM - Produtos
const productsGrid = document.getElementById('products-grid');
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
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

// Elementos DOM - Ingredientes
const ingredientsGrid = document.getElementById('ingredients-grid');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const ingredientModal = document.getElementById('ingredient-modal');
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

// Estado
let products = [];
let ingredients = [];
let editingProductId = null;
let editingIngredientId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
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

// Carregar produtos
async function loadProducts() {
    try {
        productsLoading.style.display = 'block';
        productsGrid.innerHTML = '';
        
        products = await getProducts();
        renderProducts();
        
        productsLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showToast('Erro ao carregar produtos', 'error');
        productsLoading.style.display = 'none';
    }
}

// Renderizar produtos
function renderProducts() {
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <p>Nenhum produto cadastrado ainda.</p>
                <button class="btn-primary" onclick="document.getElementById('add-product-btn').click()">
                    Adicionar Primeiro Produto
                </button>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ESem Imagem%3C/text%3E%3C/svg%3E'}" 
                     alt="${product.name}" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3C/svg%3E'">
            </div>
            <div class="product-info">
                <h3>${escapeHtml(product.name)}</h3>
                <p class="product-description">${escapeHtml(product.description || '')}</p>
                <div class="product-meta">
                    <span class="product-price">R$ ${product.price.toFixed(2)}</span>
                    <span class="product-category">${escapeHtml(product.category)}</span>
                    <span class="product-status ${product.available ? 'available' : 'unavailable'}">
                        ${product.available ? '✓ Disponível' : '✗ Indisponível'}
                    </span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct('${product.id}')">✏️ Editar</button>
                <button class="btn-delete" onclick="deleteProductConfirm('${product.id}')">🗑️ Excluir</button>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// Adicionar produto
if (addProductBtn) {
    addProductBtn.addEventListener('click', async () => {
        editingProductId = null;
        modalTitle.textContent = 'Adicionar Produto';
        productForm.reset();
        document.getElementById('product-available').checked = true;
        defaultIngredientsOrder = []; // Resetar ordem
        await loadProductDefaultIngredients();
        await loadProductIngredients();
        updateDescriptionFromDefaultIngredients();
        productModal.classList.add('active');
    });
}

// Salvar produto
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
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
    
    const productData = {
        name: document.getElementById('product-name').value.trim(),
        description: description,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value.trim(),
        available: document.getElementById('product-available').checked,
        defaultIngredients: selectedDefaultIngredients,
        availableIngredients: selectedAvailableIngredients
    };

    try {
        if (editingProductId) {
            await updateProduct(editingProductId, productData);
            showToast('Produto atualizado com sucesso!', 'success');
        } else {
            await addProduct(productData);
            showToast('Produto adicionado com sucesso!', 'success');
        }
        
        productModal.classList.remove('active');
        await loadProducts();
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showToast('Erro ao salvar produto: ' + error.message, 'error');
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
    document.getElementById('product-image').value = product.image || '';
    document.getElementById('product-available').checked = product.available !== false;
    
    // Inicializar ordem com os ingredientes padrão do produto (preservar ordem se existir)
    defaultIngredientsOrder = product.defaultIngredients ? [...product.defaultIngredients] : [];
    
    // Carregar e marcar ingredientes padrão
    await loadProductDefaultIngredients(product.defaultIngredients || []);
    
    // Carregar e marcar ingredientes disponíveis
    await loadProductIngredients(product.availableIngredients || []);
    
    // Atualizar descrição
    updateDescriptionFromDefaultIngredients();
    
    productModal.classList.add('active');
};

// Deletar produto
window.deleteProductConfirm = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
        return;
    }
    
    try {
        await deleteProduct(id);
        showToast('Produto excluído com sucesso!', 'success');
        await loadProducts();
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showToast('Erro ao excluir produto: ' + error.message, 'error');
    }
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

// ==================== INGREDIENTES ====================

// Carregar ingredientes
async function loadIngredients() {
    try {
        if (ingredientsLoading) ingredientsLoading.style.display = 'block';
        if (ingredientsGrid) ingredientsGrid.innerHTML = '';
        
        ingredients = await getIngredients();
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
    
    if (ingredients.length === 0) {
        ingredientsGrid.innerHTML = `
            <div class="empty-state">
                <p>Nenhum ingrediente cadastrado ainda.</p>
                <button class="btn-primary" onclick="document.getElementById('add-ingredient-btn').click()">
                    Adicionar Primeiro Ingrediente
                </button>
            </div>
        `;
        return;
    }
    
    ingredients.forEach(ingredient => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-info">
                <h3>${escapeHtml(ingredient.name)}</h3>
                <div class="product-meta">
                    <span class="product-price">R$ ${ingredient.price.toFixed(2)}</span>
                    <span class="product-status ${ingredient.active ? 'available' : 'unavailable'}">
                        ${ingredient.active ? '✓ Ativo' : '✗ Inativo'}
                    </span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-edit" onclick="editIngredient('${ingredient.id}')">✏️ Editar</button>
                <button class="btn-delete" onclick="deleteIngredientConfirm('${ingredient.id}')">🗑️ Excluir</button>
            </div>
        `;
        ingredientsGrid.appendChild(card);
    });
}

// Adicionar ingrediente
if (addIngredientBtn) {
    addIngredientBtn.addEventListener('click', () => {
        editingIngredientId = null;
        ingredientModalTitle.textContent = 'Adicionar Ingrediente';
        ingredientForm.reset();
        ingredientBatchForm.reset();
        document.getElementById('ingredient-active').checked = true;
        // Ativar aba "Adicionar" por padrão
        switchModalTab('single');
        ingredientModal.classList.add('active');
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
        
        const ingredientData = {
            name: document.getElementById('ingredient-name').value.trim(),
            price: parseFloat(document.getElementById('ingredient-price').value),
            active: document.getElementById('ingredient-active').checked
        };

        try {
            if (editingIngredientId) {
                await updateIngredient(editingIngredientId, ingredientData);
                showToast('Ingrediente atualizado com sucesso!', 'success');
            } else {
                await addIngredient(ingredientData);
                showToast('Ingrediente adicionado com sucesso!', 'success');
            }
            
            ingredientModal.classList.remove('active');
            await loadIngredients();
            // Recarregar listas de ingredientes no formulário de produtos
            if (productModal && productModal.classList.contains('active')) {
                await loadProductDefaultIngredients();
                await loadProductIngredients();
                updateDescriptionFromDefaultIngredients();
            }
        } catch (error) {
            console.error('Erro ao salvar ingrediente:', error);
            showToast('Erro ao salvar ingrediente: ' + error.message, 'error');
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
            return;
        }
        
        // Remover duplicatas da lista fornecida
        const { unique: uniqueIngredients, duplicates: duplicateNames } = removeDuplicateIngredients(ingredientsList);
        
        if (uniqueIngredients.length === 0) {
            showToast('Todos os ingredientes são duplicados. Nenhum ingrediente será criado.', 'error');
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
                return;
            }
            
            // Criar ingredientes
            const created = [];
            const errors = [];
            
            for (const { name: ingredientName, price } of ingredientsToCreate) {
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
            
            // Limpar formulário e recarregar lista
            ingredientBatchForm.reset();
            document.querySelector('input[name="price-mode"][value="none"]').checked = true;
            updatePriceModeUI();
            await loadIngredients();
            
            // Recarregar listas de ingredientes no formulário de produtos se estiver aberto
            if (productModal && productModal.classList.contains('active')) {
                await loadProductDefaultIngredients();
                await loadProductIngredients();
                updateDescriptionFromDefaultIngredients();
            }
            
            // Fechar modal se todos foram criados com sucesso
            if (errors.length === 0 && alreadyExisting.length === 0) {
                ingredientModal.classList.remove('active');
            }
        } catch (error) {
            console.error('Erro ao criar ingredientes em lote:', error);
            showToast('Erro ao criar ingredientes: ' + error.message, 'error');
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
    ingredientModal.classList.add('active');
};

// Deletar ingrediente
window.deleteIngredientConfirm = async (id) => {
    const ingredient = ingredients.find(i => i.id === id);
    if (!ingredient) return;
    
    if (!confirm(`Tem certeza que deseja excluir o ingrediente "${ingredient.name}"?`)) {
        return;
    }
    
    try {
        await deleteIngredient(id);
        showToast('Ingrediente excluído com sucesso!', 'success');
        await loadIngredients();
        // Recarregar listas de ingredientes no formulário de produtos
        if (productModal && productModal.classList.contains('active')) {
            await loadProductDefaultIngredients();
            await loadProductIngredients();
            updateDescriptionFromDefaultIngredients();
        }
    } catch (error) {
        console.error('Erro ao excluir ingrediente:', error);
        showToast('Erro ao excluir ingrediente: ' + error.message, 'error');
    }
};

// Variável para rastrear a ordem de seleção dos ingredientes padrão
let defaultIngredientsOrder = [];

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
        if (selectedIds.length > 0 && defaultIngredientsOrder.length === 0) {
            defaultIngredientsOrder = [...selectedIds];
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
    
    // Buscar nomes dos ingredientes na ordem de seleção
    const ingredientNames = orderedIds
        .map(id => {
            const ingredient = ingredientsToUse.find(ing => ing.id === id);
            return ingredient ? ingredient.name : id;
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
        return paoName || 'Pão';
    }
    
    // Formatar descrição: "Pão, Ingrediente1, Ingrediente2 e Ingrediente3"
    // ou "Ingrediente1, Ingrediente2 e Ingrediente3" se não houver Pão
    const baseName = paoName || 'Pão';
    
    if (otherIngredients.length === 1) {
        return `${baseName}, ${otherIngredients[0]}`;
    } else if (otherIngredients.length === 2) {
        return `${baseName}, ${otherIngredients[0]} e ${otherIngredients[1]}`;
    } else {
        const lastIngredient = otherIngredients[otherIngredients.length - 1];
        const otherList = otherIngredients.slice(0, -1).join(', ');
        return `${baseName}, ${otherList} e ${lastIngredient}`;
    }
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
            productModal.classList.remove('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            productModal.classList.remove('active');
        });
    }
    
    // Fechar modal de ingrediente
    if (ingredientModalClose) {
        ingredientModalClose.addEventListener('click', () => {
            ingredientModal.classList.remove('active');
            ingredientForm.reset();
            ingredientBatchForm.reset();
            switchModalTab('single');
        });
    }
    
    if (cancelIngredientBtn) {
        cancelIngredientBtn.addEventListener('click', () => {
            ingredientModal.classList.remove('active');
            ingredientForm.reset();
            ingredientBatchForm.reset();
            switchModalTab('single');
        });
    }
    
    if (cancelIngredientBatchBtn) {
        cancelIngredientBatchBtn.addEventListener('click', () => {
            ingredientModal.classList.remove('active');
            ingredientForm.reset();
            ingredientBatchForm.reset();
            switchModalTab('single');
        });
    }
    
    // Fechar modais ao clicar no overlay
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
            }
        });
    }
    
    if (ingredientModal) {
        ingredientModal.addEventListener('click', (e) => {
            if (e.target === ingredientModal) {
                ingredientModal.classList.remove('active');
            }
        });
    }
    
    // Carregar ingredientes ao abrir modal de produto
    if (addProductBtn) {
        addProductBtn.addEventListener('click', async () => {
            await loadProductIngredients();
        });
    }
    
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
    
    if (feedbackModal) {
        feedbackModal.addEventListener('click', (e) => {
            if (e.target === feedbackModal) {
                feedbackModal.classList.remove('active');
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

