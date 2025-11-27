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
  getRestaurantConfig, 
  saveRestaurantConfig 
} from '../services/config-service.js';

// Elementos DOM
const productsGrid = document.getElementById('products-grid');
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const cancelBtn = document.getElementById('cancel-btn');
const logoutBtn = document.getElementById('logout-btn');
const navButtons = document.querySelectorAll('.nav-btn');
const adminSections = document.querySelectorAll('.admin-section');
const productsLoading = document.getElementById('products-loading');
const configForm = document.getElementById('config-form');

// Estado
let products = [];
let editingProductId = null;

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
addProductBtn.addEventListener('click', () => {
    editingProductId = null;
    modalTitle.textContent = 'Adicionar Produto';
    productForm.reset();
    document.getElementById('product-available').checked = true;
    productModal.classList.add('active');
});

// Salvar produto
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('product-name').value.trim(),
        description: document.getElementById('product-description').value.trim(),
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value.trim(),
        available: document.getElementById('product-available').checked
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
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image || '';
    document.getElementById('product-available').checked = product.available !== false;
    
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

// Setup event listeners
function setupEventListeners() {
    // Fechar modal
    modalClose.addEventListener('click', () => {
        productModal.classList.remove('active');
    });
    
    cancelBtn.addEventListener('click', () => {
        productModal.classList.remove('active');
    });
    
    // Fechar modal ao clicar no overlay
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.remove('active');
        }
    });
    
    // Logout
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

