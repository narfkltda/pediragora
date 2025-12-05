/**
 * Categories Module
 * Gerencia todas as funcionalidades relacionadas a categorias
 */

import { state } from '../admin.js';
import { 
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getOrCreateDefaultCategory
} from '../../services/categories-service.js';
import {
    getProductCategories,
    addProductCategory,
    updateProductCategory,
    deleteProductCategory
} from '../../services/product-categories-service.js';
import { hasIngredientsUsingCategory } from '../../services/ingredients-service.js';
import { openModal, closeModal } from '../utils/modals.js';
import { showToast, showConfirmModal, escapeHtml } from '../utils/ui.js';

// Estado local do módulo
let defaultCategoryId = null;
let editingCategoryId = null;
let editingProductCategoryId = null;

// Callbacks para atualizar outros módulos
let updateCallbacks = {
    onCategoriesUpdated: null,
    onProductCategoriesUpdated: null,
    getAllProducts: null
};

/**
 * Inicializar módulo de categorias
 * @param {Object} callbacks - Callbacks para atualizar outros módulos
 */
export function initCategories(callbacks = {}) {
    updateCallbacks = { ...updateCallbacks, ...callbacks };
    
    // Configurar modais
    setupCategoriesModal();
    setupProductCategoriesModal();
}

/**
 * Carregar categorias de ingredientes
 */
export async function loadCategories() {
    try {
        state.categories = await getCategories();
        
        // Buscar ID da categoria padrão "Geral"
        const defaultCategory = state.categories.find(cat => cat.name.toLowerCase() === 'geral');
        if (defaultCategory) {
            defaultCategoryId = defaultCategory.id;
        } else {
            // Criar categoria "Geral" se não existir
            defaultCategoryId = await getOrCreateDefaultCategory();
            state.categories = await getCategories(); // Recarregar após criar
        }
        
        // Atualizar seletor de categoria na modal de ingrediente
        updateCategorySelector();
        
        // Notificar outros módulos se necessário
        if (updateCallbacks.onCategoriesUpdated) {
            updateCallbacks.onCategoriesUpdated();
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        showToast('Erro ao carregar categorias', 'error');
    }
}

/**
 * Obter ID da categoria padrão
 */
export function getDefaultCategoryId() {
    return defaultCategoryId;
}

/**
 * Atualizar seletor de categoria na modal de ingrediente
 */
export function updateCategorySelector() {
    const categorySelect = document.getElementById('ingredient-category');
    if (!categorySelect) return;
    
    categorySelect.innerHTML = '';
    
    if (state.categories.length === 0) {
        categorySelect.innerHTML = '<option value="">Carregando categorias...</option>';
        return;
    }
    
    // Ordenar categorias alfabeticamente
    const sortedCategories = [...state.categories].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
    
    // Se houver categoria padrão, selecioná-la
    if (defaultCategoryId) {
        categorySelect.value = defaultCategoryId;
    }
}

/**
 * Atualizar seletor de categoria na modal de edição
 */
export function updateCategoryEditSelector() {
    const categoryEditSelect = document.getElementById('ingredient-edit-category');
    if (!categoryEditSelect) return;
    
    categoryEditSelect.innerHTML = '';
    
    if (state.categories.length === 0) {
        categoryEditSelect.innerHTML = '<option value="">Carregando categorias...</option>';
        return;
    }
    
    // Ordenar categorias alfabeticamente
    const sortedCategories = [...state.categories].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryEditSelect.appendChild(option);
    });
    
    // Se houver categoria padrão, selecioná-la
    if (defaultCategoryId) {
        categoryEditSelect.value = defaultCategoryId;
    }
}

/**
 * Atualizar seletor de categoria no filtro
 * @param {string} currentFilter - Filtro atual selecionado
 */
export function updateCategoryFilterSelector(currentFilter = 'all') {
    const categoryFilterSelect = document.getElementById('ingredient-category-filter');
    if (!categoryFilterSelect) return;
    
    // Manter opção "Todas as Categorias"
    const allOption = categoryFilterSelect.querySelector('option[value="all"]');
    categoryFilterSelect.innerHTML = '';
    if (allOption) {
        categoryFilterSelect.appendChild(allOption);
    } else {
        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = 'Todas as Categorias';
        categoryFilterSelect.appendChild(defaultOption);
    }
    
    if (state.categories.length === 0) {
        return;
    }
    
    // Ordenar categorias alfabeticamente
    const sortedCategories = [...state.categories].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilterSelect.appendChild(option);
    });
    
    // Restaurar seleção atual
    categoryFilterSelect.value = currentFilter;
}

/**
 * Configurar modal de categorias de ingredientes
 */
function setupCategoriesModal() {
    const manageCategoriesBtn = document.getElementById('manage-categories-btn');
    const categoriesModal = document.getElementById('categories-modal');
    const categoriesModalClose = document.getElementById('categories-modal-close');
    const closeCategoriesModalBtn = document.getElementById('close-categories-modal-btn');
    let categoriesModalContent = null;
    
    if (categoriesModal) {
        categoriesModalContent = categoriesModal.querySelector('.modal-content');
    }
    
    // Abrir modal
    if (manageCategoriesBtn && categoriesModal) {
        manageCategoriesBtn.addEventListener('click', async () => {
            await loadCategoriesList();
            openModal(categoriesModal, categoriesModalContent);
        });
    }
    
    // Fechar modal
    if (categoriesModalClose) {
        categoriesModalClose.addEventListener('click', () => {
            closeModal(categoriesModal, categoriesModalContent);
        });
    }
    
    if (closeCategoriesModalBtn) {
        closeCategoriesModalBtn.addEventListener('click', () => {
            closeModal(categoriesModal, categoriesModalContent);
        });
    }
    
    // Formulário de categoria
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveCategory();
        });
    }
    
    // Botão cancelar categoria
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', () => {
            resetCategoryForm();
        });
    }
}

/**
 * Carregar lista de categorias
 */
async function loadCategoriesList() {
    const categoriesList = document.getElementById('categories-list');
    const categoriesLoading = document.getElementById('categories-loading');
    
    if (!categoriesList) return;
    
    try {
        if (categoriesLoading) categoriesLoading.style.display = 'block';
        categoriesList.innerHTML = '';
        
        await loadCategories();
        
        if (state.categories.length === 0) {
            categoriesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhuma categoria cadastrada ainda.</p>';
        } else {
            const sortedCategories = [...state.categories].sort((a, b) => a.name.localeCompare(b.name));
            
            sortedCategories.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.innerHTML = `
                    <span class="category-name">${escapeHtml(category.name)}</span>
                    <div class="category-actions">
                        <button class="btn-edit" onclick="editCategory('${category.id}')">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteCategoryConfirm('${category.id}')">🗑️ Excluir</button>
                    </div>
                `;
                categoriesList.appendChild(categoryItem);
            });
        }
        
        if (categoriesLoading) categoriesLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        showToast('Erro ao carregar categorias', 'error');
        if (categoriesLoading) categoriesLoading.style.display = 'none';
    }
}

/**
 * Salvar categoria
 */
async function saveCategory() {
    const categoryNameInput = document.getElementById('category-name');
    const categoryFormTitle = document.getElementById('category-form-title');
    
    if (!categoryNameInput) return;
    
    const categoryName = categoryNameInput.value.trim();
    if (!categoryName) {
        showToast('Nome da categoria é obrigatório', 'error');
        return;
    }
    
    try {
        if (editingCategoryId) {
            await updateCategory(editingCategoryId, categoryName);
            showToast('Categoria atualizada com sucesso!', 'success');
        } else {
            await addCategory(categoryName);
            showToast('Categoria adicionada com sucesso!', 'success');
        }
        
        resetCategoryForm();
        await loadCategoriesList();
        await loadCategories(); // Recarregar categorias para atualizar seletor
        updateCategorySelector();
        updateCategoryEditSelector();
        updateCategoryFilterSelector();
    } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        
        // Verificar se é erro de permissões
        if (error.code === 'permission-denied' || error.message.includes('permission') || error.message.includes('insufficient permissions')) {
            showToast('Erro de permissões: Atualize as regras do Firestore. Veja FIRESTORE_RULES.md', 'error');
            console.error('\n🚨 ERRO DE PERMISSÕES DETECTADO');
            console.error('========================================');
            console.error('É necessário atualizar as regras do Firestore para permitir operações na collection "ingredientCategories"');
            console.error('\n📋 PASSO A PASSO:');
            console.error('1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/firestore/rules');
            console.error('2. Adicione as seguintes regras para ingredientCategories:');
            console.error(`
    match /ingredientCategories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }`);
            console.error('3. Clique em "PUBLISH" (Publicar)');
            console.error('4. Aguarde alguns segundos e tente novamente');
            console.error('\n📄 Para mais detalhes, veja o arquivo: FIRESTORE_RULES.md');
            console.error('========================================\n');
        } else {
            showToast(error.message || 'Erro ao salvar categoria', 'error');
        }
    }
}

/**
 * Editar categoria
 */
window.editCategory = async (id) => {
    const category = state.categories.find(c => c.id === id);
    if (!category) return;
    
    editingCategoryId = id;
    const categoryNameInput = document.getElementById('category-name');
    const categoryIdInput = document.getElementById('category-id');
    const categoryFormTitle = document.getElementById('category-form-title');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    
    if (categoryNameInput) categoryNameInput.value = category.name;
    if (categoryIdInput) categoryIdInput.value = id;
    if (categoryFormTitle) categoryFormTitle.textContent = 'Editar Categoria';
    if (cancelCategoryBtn) cancelCategoryBtn.style.display = 'inline-block';
    
    // Scroll para o formulário
    const categoryFormContainer = document.querySelector('.category-form-container');
    if (categoryFormContainer) {
        categoryFormContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

/**
 * Resetar formulário de categoria
 */
function resetCategoryForm() {
    editingCategoryId = null;
    const categoryNameInput = document.getElementById('category-name');
    const categoryIdInput = document.getElementById('category-id');
    const categoryFormTitle = document.getElementById('category-form-title');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    
    if (categoryNameInput) categoryNameInput.value = '';
    if (categoryIdInput) categoryIdInput.value = '';
    if (categoryFormTitle) categoryFormTitle.textContent = 'Adicionar Categoria';
    if (cancelCategoryBtn) cancelCategoryBtn.style.display = 'none';
}

/**
 * Confirmar exclusão de categoria
 */
window.deleteCategoryConfirm = async (id) => {
    const category = state.categories.find(c => c.id === id);
    if (!category) return;
    
    try {
        // Verificar se há ingredientes usando esta categoria
        const inUse = await hasIngredientsUsingCategory(id);
        if (inUse) {
            showToast('Não é possível excluir categoria que está sendo usada por ingredientes', 'error');
            return;
        }
        
        showConfirmModal(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir a categoria "${escapeHtml(category.name)}"?`,
            async () => {
                try {
                    await deleteCategory(id, hasIngredientsUsingCategory);
                    showToast('Categoria excluída com sucesso!', 'success');
                    await loadCategoriesList();
                    await loadCategories();
                    updateCategorySelector();
                    updateCategoryEditSelector();
                    updateCategoryFilterSelector();
                } catch (error) {
                    console.error('Erro ao excluir categoria:', error);
                    showToast(error.message || 'Erro ao excluir categoria', 'error');
                }
            }
        );
    } catch (error) {
        console.error('Erro ao verificar categoria:', error);
        showToast('Erro ao verificar categoria', 'error');
    }
};

// ==================== CATEGORIAS DE PRODUTOS ====================

/**
 * Carregar categorias de produtos
 */
export async function loadProductCategories() {
    try {
        state.productCategories = await getProductCategories();
        console.log('✅ Categorias de produtos carregadas:', state.productCategories.length);
        
        // Migrar categorias padrão se necessário
        await migrateDefaultProductCategories();
        
        // Recarregar categorias após migração
        state.productCategories = await getProductCategories();
        
        // Atualizar seletor de categorias no formulário
        updateProductCategorySelector();
        
        // Notificar outros módulos se necessário
        if (updateCallbacks.onProductCategoriesUpdated) {
            updateCallbacks.onProductCategoriesUpdated();
        }
    } catch (error) {
        console.error('Erro ao carregar categorias de produtos:', error);
    }
}

/**
 * Migrar categorias padrão para o Firebase
 */
async function migrateDefaultProductCategories() {
    const migrationKey = 'product_categories_migration_done';
    if (localStorage.getItem(migrationKey) === 'true') {
        return; // Migração já foi executada
    }
    
    try {
        // Categorias padrão que devem existir
        const defaultCategories = ['Burguers', 'Hot-Dogs', 'Porções', 'Bebidas'];
        
        // Verificar quais categorias já existem
        const existingCategoryNames = state.productCategories.map(cat => cat.name);
        
        // Criar categorias que não existem
        let createdCount = 0;
        for (const categoryName of defaultCategories) {
            if (!existingCategoryNames.includes(categoryName)) {
                try {
                    await addProductCategory(categoryName);
                    createdCount++;
                    console.log(`✅ Categoria padrão criada: ${categoryName}`);
                } catch (error) {
                    console.error(`Erro ao criar categoria ${categoryName}:`, error);
                }
            }
        }
        
        if (createdCount > 0) {
            console.log(`Migração de categorias concluída: ${createdCount} categoria(s) criada(s).`);
        }
        
        // Marcar migração como concluída
        localStorage.setItem(migrationKey, 'true');
    } catch (error) {
        console.error('Erro na migração de categorias de produtos:', error);
    }
}

/**
 * Configurar modal de categorias de produtos
 */
function setupProductCategoriesModal() {
    const manageProductCategoriesBtn = document.getElementById('manage-product-categories-btn');
    const productCategoriesModal = document.getElementById('product-categories-modal');
    const productCategoriesModalClose = document.getElementById('product-categories-modal-close');
    const closeProductCategoriesModalBtn = document.getElementById('close-product-categories-modal-btn');
    let productCategoriesModalContent = null;
    
    if (productCategoriesModal) {
        productCategoriesModalContent = productCategoriesModal.querySelector('.modal-content');
    }
    
    // Abrir modal
    if (manageProductCategoriesBtn && productCategoriesModal) {
        manageProductCategoriesBtn.addEventListener('click', async () => {
            await loadProductCategoriesList();
            openModal(productCategoriesModal, productCategoriesModalContent);
        });
    }
    
    // Fechar modal
    if (productCategoriesModalClose) {
        productCategoriesModalClose.addEventListener('click', () => {
            closeModal(productCategoriesModal, productCategoriesModalContent);
        });
    }
    
    if (closeProductCategoriesModalBtn) {
        closeProductCategoriesModalBtn.addEventListener('click', () => {
            closeModal(productCategoriesModal, productCategoriesModalContent);
        });
    }
    
    // Formulário de categoria
    const productCategoryForm = document.getElementById('product-category-form');
    if (productCategoryForm) {
        productCategoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProductCategory();
        });
    }
    
    // Botão cancelar categoria
    const cancelProductCategoryBtn = document.getElementById('cancel-product-category-btn');
    if (cancelProductCategoryBtn) {
        cancelProductCategoryBtn.addEventListener('click', () => {
            resetProductCategoryForm();
        });
    }
}

/**
 * Carregar lista de categorias de produtos
 */
async function loadProductCategoriesList() {
    const productCategoriesList = document.getElementById('product-categories-list');
    const productCategoriesLoading = document.getElementById('product-categories-loading');
    
    if (!productCategoriesList) return;
    
    try {
        if (productCategoriesLoading) productCategoriesLoading.style.display = 'block';
        productCategoriesList.innerHTML = '';
        
        await loadProductCategories();
        
        if (state.productCategories.length === 0) {
            productCategoriesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhuma categoria cadastrada ainda.</p>';
        } else {
            const sortedCategories = [...state.productCategories].sort((a, b) => a.name.localeCompare(b.name));
            
            sortedCategories.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.innerHTML = `
                    <span class="category-name">${escapeHtml(category.name)}</span>
                    <div class="category-actions">
                        <button class="btn-edit" onclick="editProductCategory('${category.id}')">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteProductCategoryConfirm('${category.id}')">🗑️ Excluir</button>
                    </div>
                `;
                productCategoriesList.appendChild(categoryItem);
            });
        }
        
        if (productCategoriesLoading) productCategoriesLoading.style.display = 'none';
    } catch (error) {
        console.error('Erro ao carregar categorias de produtos:', error);
        showToast('Erro ao carregar categorias de produtos', 'error');
        if (productCategoriesLoading) productCategoriesLoading.style.display = 'none';
    }
}

/**
 * Salvar categoria de produto
 */
async function saveProductCategory() {
    const productCategoryNameInput = document.getElementById('product-category-name');
    const productCategoryFormTitle = document.getElementById('product-category-form-title');
    
    if (!productCategoryNameInput) return;
    
    const categoryName = productCategoryNameInput.value.trim();
    if (!categoryName) {
        showToast('Nome da categoria é obrigatório', 'error');
        return;
    }
    
    try {
        if (editingProductCategoryId) {
            await updateProductCategory(editingProductCategoryId, categoryName);
            showToast('Categoria atualizada com sucesso!', 'success');
        } else {
            await addProductCategory(categoryName);
            showToast('Categoria adicionada com sucesso!', 'success');
        }
        
        resetProductCategoryForm();
        await loadProductCategoriesList();
        await loadProductCategories();
        updateProductCategorySelector();
        
        // Notificar outros módulos
        if (updateCallbacks.onProductCategoriesUpdated) {
            updateCallbacks.onProductCategoriesUpdated();
        }
    } catch (error) {
        console.error('Erro ao salvar categoria de produto:', error);
        
        // Verificar se é erro de permissões
        if (error.code === 'permission-denied' || error.message.includes('permission') || error.message.includes('insufficient permissions')) {
            showToast('Erro de permissões: Atualize as regras do Firestore. Veja FIRESTORE_RULES.md', 'error');
            console.error('\n🚨 ERRO DE PERMISSÕES DETECTADO');
            console.error('========================================');
            console.error('É necessário atualizar as regras do Firestore para permitir operações na collection "productCategories"');
            console.error('\n📋 PASSO A PASSO:');
            console.error('1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/firestore/rules');
            console.error('2. Adicione as seguintes regras para productCategories:');
            console.error(`
    match /productCategories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }`);
            console.error('3. Clique em "PUBLISH" (Publicar)');
            console.error('4. Aguarde alguns segundos e tente novamente');
            console.error('========================================\n');
        } else {
            showToast(error.message || 'Erro ao salvar categoria de produto', 'error');
        }
    }
}

/**
 * Editar categoria de produto
 */
window.editProductCategory = async (id) => {
    const category = state.productCategories.find(c => c.id === id);
    if (!category) return;
    
    editingProductCategoryId = id;
    const productCategoryNameInput = document.getElementById('product-category-name');
    const productCategoryIdInput = document.getElementById('product-category-id');
    const productCategoryFormTitle = document.getElementById('product-category-form-title');
    const cancelProductCategoryBtn = document.getElementById('cancel-product-category-btn');
    
    if (productCategoryNameInput) productCategoryNameInput.value = category.name;
    if (productCategoryIdInput) productCategoryIdInput.value = id;
    if (productCategoryFormTitle) productCategoryFormTitle.textContent = 'Editar Categoria';
    if (cancelProductCategoryBtn) cancelProductCategoryBtn.style.display = 'inline-block';
    
    // Scroll para o formulário
    const productCategoryFormContainer = document.querySelector('#product-categories-modal .category-form-container');
    if (productCategoryFormContainer) {
        productCategoryFormContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

/**
 * Resetar formulário de categoria de produto
 */
function resetProductCategoryForm() {
    editingProductCategoryId = null;
    const productCategoryNameInput = document.getElementById('product-category-name');
    const productCategoryIdInput = document.getElementById('product-category-id');
    const productCategoryFormTitle = document.getElementById('product-category-form-title');
    const cancelProductCategoryBtn = document.getElementById('cancel-product-category-btn');
    
    if (productCategoryNameInput) productCategoryNameInput.value = '';
    if (productCategoryIdInput) productCategoryIdInput.value = '';
    if (productCategoryFormTitle) productCategoryFormTitle.textContent = 'Adicionar Categoria';
    if (cancelProductCategoryBtn) cancelProductCategoryBtn.style.display = 'none';
}

/**
 * Confirmar exclusão de categoria de produto
 */
window.deleteProductCategoryConfirm = async (id) => {
    const category = state.productCategories.find(c => c.id === id);
    if (!category) return;
    
    try {
        // Verificar se há produtos usando esta categoria
        const inUse = await hasProductsUsingCategory(category.name);
        if (inUse) {
            showToast('Não é possível excluir categoria que está sendo usada por produtos', 'error');
            return;
        }
        
        showConfirmModal(
            'Confirmar Exclusão',
            `Tem certeza que deseja excluir a categoria "${escapeHtml(category.name)}"?`,
            async () => {
                try {
                    // Criar função wrapper que recebe ID e verifica por nome
                    const checkProductsInUse = async (categoryId) => {
                        const cat = state.productCategories.find(c => c.id === categoryId);
                        if (!cat) return false;
                        return await hasProductsUsingCategory(cat.name);
                    };
                    
                    await deleteProductCategory(id, checkProductsInUse);
                    showToast('Categoria excluída com sucesso!', 'success');
                    await loadProductCategoriesList();
                    await loadProductCategories();
                    updateProductCategorySelector();
                    
                    // Notificar outros módulos
                    if (updateCallbacks.onProductCategoriesUpdated) {
                        updateCallbacks.onProductCategoriesUpdated();
                    }
                } catch (error) {
                    console.error('Erro ao excluir categoria de produto:', error);
                    showToast(error.message || 'Erro ao excluir categoria de produto', 'error');
                }
            }
        );
    } catch (error) {
        console.error('Erro ao verificar categoria de produto:', error);
        showToast('Erro ao verificar categoria de produto', 'error');
    }
};

/**
 * Verificar se há produtos usando uma categoria
 * @param {string} categoryName - Nome da categoria
 * @returns {Promise<boolean>} True se há produtos usando a categoria
 */
export async function hasProductsUsingCategory(categoryName) {
    if (!categoryName) return false;
    
    try {
        // Obter produtos do callback ou usar state
        const products = updateCallbacks.getAllProducts ? updateCallbacks.getAllProducts() : state.products;
        const productsUsingCategory = products.filter(p => p.category === categoryName);
        return productsUsingCategory.length > 0;
    } catch (error) {
        console.error('Erro ao verificar uso de categoria:', error);
        return false;
    }
}

/**
 * Atualizar seletor de categorias no formulário de produtos
 */
export function updateProductCategorySelector() {
    const productCategorySelect = document.getElementById('product-category');
    if (!productCategorySelect) return;
    
    // Salvar valor atual
    const currentValue = productCategorySelect.value;
    
    // Limpar opções existentes
    productCategorySelect.innerHTML = '';
    
    // Adicionar opção padrão
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione uma categoria';
    productCategorySelect.appendChild(defaultOption);
    
    // Adicionar categorias do Firebase
    if (state.productCategories && state.productCategories.length > 0) {
        const sortedCategories = [...state.productCategories].sort((a, b) => a.name.localeCompare(b.name));
        sortedCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            productCategorySelect.appendChild(option);
        });
    }
    
    // Restaurar valor anterior se ainda existir
    if (currentValue) {
        productCategorySelect.value = currentValue;
    }
}
