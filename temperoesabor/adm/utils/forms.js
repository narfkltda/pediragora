/**
 * Form Utilities
 * Funções reutilizáveis para validação de formulários
 */

/**
 * Configurar mensagens de validação em português para campos obrigatórios
 */
export function setupFormValidationMessages() {
    // Mensagens para campos de produto
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productCategory = document.getElementById('product-category');
    
    if (productName) {
        productName.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o nome do produto.');
            }
        });
        productName.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    if (productPrice) {
        productPrice.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o preço do produto.');
            } else if (e.target.validity.rangeUnderflow) {
                e.target.setCustomValidity('O preço deve ser maior ou igual a zero.');
            }
        });
        productPrice.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    if (productCategory) {
        productCategory.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, selecione uma categoria.');
            }
        });
        productCategory.addEventListener('change', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    // Mensagens para campos de ingrediente
    const ingredientName = document.getElementById('ingredient-name');
    const ingredientCategory = document.getElementById('ingredient-category');
    const ingredientPrice = document.getElementById('ingredient-price');
    
    if (ingredientName) {
        ingredientName.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o nome do ingrediente.');
            }
        });
        ingredientName.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    if (ingredientCategory) {
        ingredientCategory.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, selecione uma categoria.');
            }
        });
        ingredientCategory.addEventListener('change', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    if (ingredientPrice) {
        ingredientPrice.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o preço do ingrediente.');
            } else if (e.target.validity.rangeUnderflow) {
                e.target.setCustomValidity('O preço deve ser maior ou igual a zero.');
            }
        });
        ingredientPrice.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    // Mensagens para campos de ingrediente (edição)
    const ingredientEditName = document.getElementById('ingredient-edit-name');
    const ingredientEditCategory = document.getElementById('ingredient-edit-category');
    const ingredientEditPrice = document.getElementById('ingredient-edit-price');
    
    if (ingredientEditName) {
        ingredientEditName.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o nome do ingrediente.');
            }
        });
        ingredientEditName.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    if (ingredientEditCategory) {
        ingredientEditCategory.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, selecione uma categoria.');
            }
        });
        ingredientEditCategory.addEventListener('change', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    if (ingredientEditPrice) {
        ingredientEditPrice.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o preço do ingrediente.');
            } else if (e.target.validity.rangeUnderflow) {
                e.target.setCustomValidity('O preço deve ser maior ou igual a zero.');
            }
        });
        ingredientEditPrice.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    // Mensagens para campos de categoria
    const categoryName = document.getElementById('category-name');
    if (categoryName) {
        categoryName.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o nome da categoria.');
            }
        });
        categoryName.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    // Mensagens para campos de configuração
    const configName = document.getElementById('config-name');
    const configWhatsapp = document.getElementById('config-whatsapp');
    
    if (configName) {
        configName.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o nome do restaurante.');
            }
        });
        configName.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
    
    if (configWhatsapp) {
        configWhatsapp.addEventListener('invalid', function(e) {
            if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, informe o número do WhatsApp.');
            }
        });
        configWhatsapp.addEventListener('input', function(e) {
            e.target.setCustomValidity('');
        });
    }
}
