/**
 * Import Static Products - Importa produtos do script.js para Firebase
 */

import { 
  signOut,
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from '../firebase-config.js';
import { 
  getProducts, 
  addProduct 
} from '../services/products-service.js';

// Dados estáticos dos produtos (copiados de script.js)
const STATIC_PRODUCTS = [
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
];

// Elementos DOM
const productsList = document.getElementById('products-list');
const selectAllCheckbox = document.getElementById('select-all-checkbox');
const importBtn = document.getElementById('import-btn');
const selectedCount = document.getElementById('selected-count');
const loadingIndicator = document.getElementById('loading-indicator');
const importProgress = document.getElementById('import-progress');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const importResults = document.getElementById('import-results');
const logoutBtn = document.getElementById('logout-btn');

// Estado
let selectedProducts = new Set();
let existingProducts = new Set(); // Nomes dos produtos já existentes no Firebase
let allProducts = [];

// Verificar autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Usuário autenticado:', user.email);
        loadProducts();
    } else {
        console.log('Usuário não autenticado');
        window.location.href = 'login.html';
    }
});

// Carregar produtos existentes do Firebase
async function loadProducts() {
    try {
        loadingIndicator.style.display = 'block';
        productsList.innerHTML = '';
        
        // Buscar produtos do Firebase
        const firebaseProducts = await getProducts();
        existingProducts = new Set(firebaseProducts.map(p => p.name.toLowerCase().trim()));
        
        // Renderizar produtos estáticos
        renderProducts();
        
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        loadingIndicator.style.display = 'none';
        productsList.innerHTML = '<div class="empty-state">Erro ao carregar produtos. Tente recarregar a página.</div>';
    }
}

// Renderizar lista de produtos
function renderProducts() {
    productsList.innerHTML = '';
    allProducts = STATIC_PRODUCTS;
    
    if (allProducts.length === 0) {
        productsList.innerHTML = '<div class="empty-state">Nenhum produto estático encontrado.</div>';
        return;
    }
    
    allProducts.forEach(product => {
        const isExisting = existingProducts.has(product.name.toLowerCase().trim());
        const item = document.createElement('div');
        item.className = `product-item ${isExisting ? 'existing' : ''}`;
        if (selectedProducts.has(product.id)) {
            item.classList.add('selected');
        }
        
        // Formatar nome com numeração (exceto Bebidas)
        const formattedName = formatProductName(product);
        
        item.innerHTML = `
            <div class="product-item-header">
                <input type="checkbox" 
                       data-product-id="${product.id}" 
                       ${isExisting ? 'disabled' : ''}
                       ${selectedProducts.has(product.id) ? 'checked' : ''}>
                <div class="product-item-info">
                    <div class="product-item-name">${escapeHtml(formattedName)}</div>
                    ${isExisting ? '<span style="color: #e65100; font-size: 0.8rem; font-weight: 600;">(Já existe no Firebase)</span>' : ''}
                    <div class="product-item-category">${escapeHtml(product.category)}</div>
                    <div class="product-item-description">${escapeHtml(product.description || '')}</div>
                    <div class="product-item-price">R$ ${product.price.toFixed(2)}</div>
                </div>
            </div>
        `;
        
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked && !isExisting) {
                selectedProducts.add(product.id);
            } else {
                selectedProducts.delete(product.id);
            }
            updateUI();
        });
        
        productsList.appendChild(item);
    });
    
    updateUI();
}

// Atualizar UI
function updateUI() {
    const selectableProducts = allProducts.filter(p => !existingProducts.has(p.name.toLowerCase().trim()));
    const allSelected = selectableProducts.length > 0 && 
                       selectableProducts.every(p => selectedProducts.has(p.id));
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = allSelected;
        selectAllCheckbox.indeterminate = selectedProducts.size > 0 && !allSelected;
    }
    
    if (selectedCount) {
        selectedCount.textContent = selectedProducts.size;
    }
    
    if (importBtn) {
        importBtn.disabled = selectedProducts.size === 0;
    }
}

// Selecionar todos
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
        const selectableProducts = allProducts.filter(p => !existingProducts.has(p.name.toLowerCase().trim()));
        
        if (e.target.checked) {
            selectableProducts.forEach(p => selectedProducts.add(p.id));
        } else {
            selectedProducts.clear();
        }
        
        // Atualizar checkboxes
        document.querySelectorAll('input[type="checkbox"][data-product-id]').forEach(checkbox => {
            if (!checkbox.disabled) {
                checkbox.checked = e.target.checked;
            }
        });
        
        // Atualizar classes dos items
        document.querySelectorAll('.product-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        updateUI();
    });
}

// Importar produtos
if (importBtn) {
    importBtn.addEventListener('click', async () => {
        if (selectedProducts.size === 0) return;
        
        const productsToImport = allProducts.filter(p => selectedProducts.has(p.id));
        
        if (!confirm(`Tem certeza que deseja importar ${productsToImport.length} produto(s)?`)) {
            return;
        }
        
        await importProducts(productsToImport);
    });
}

// Função de importação
async function importProducts(products) {
    importProgress.classList.add('active');
    importResults.style.display = 'none';
    importResults.innerHTML = '';
    
    const total = products.length;
    let success = 0;
    let errors = 0;
    let skipped = 0;
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const progress = ((i + 1) / total) * 100;
        
        progressFill.style.width = `${progress}%`;
        progressFill.textContent = `${Math.round(progress)}%`;
        progressText.textContent = `Importando ${i + 1} de ${total}: ${product.name}...`;
        
        try {
            // Verificar se já existe (dupla verificação)
            if (existingProducts.has(product.name.toLowerCase().trim())) {
                skipped++;
                addResult(product.name, 'skipped', 'Produto já existe no Firebase');
                continue;
            }
            
            // Preparar dados do produto
            const productData = {
                name: product.name,
                description: product.description || '',
                price: product.price,
                category: product.category,
                image: product.image || '',
                available: true,
                defaultIngredients: [],
                availableIngredients: [],
                number: product.id // Preservar número original do produto estático
            };
            
            await addProduct(productData);
            success++;
            existingProducts.add(product.name.toLowerCase().trim());
            addResult(product.name, 'success', 'Importado com sucesso');
            
        } catch (error) {
            console.error(`Erro ao importar ${product.name}:`, error);
            errors++;
            addResult(product.name, 'error', `Erro: ${error.message}`);
        }
        
        // Pequeno delay para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    progressText.textContent = `Importação concluída! ${success} sucesso, ${errors} erros, ${skipped} ignorados.`;
    importResults.style.display = 'block';
    
    // Atualizar lista
    selectedProducts.clear();
    renderProducts();
    
    // Scroll para resultados
    importResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Adicionar resultado
function addResult(productName, type, message) {
    const resultItem = document.createElement('div');
    resultItem.className = `result-item ${type}`;
    resultItem.textContent = `${productName}: ${message}`;
    importResults.appendChild(resultItem);
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
                alert('Erro ao fazer logout');
            }
        }
    });
}

// Formatar nome do produto com numeração (exceto Bebidas)
function formatProductName(product) {
    // Don't add ID prefix for Bebidas category
    if (product.category === 'Bebidas') {
        return product.name;
    }
    const number = product.id.padStart(2, '0');
    return `${number} - ${product.name}`;
}

// Função de escape HTML
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

