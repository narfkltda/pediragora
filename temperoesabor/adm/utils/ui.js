/**
 * UI Utilities
 * Funções reutilizáveis para interface do usuário
 */

// Callback para modal de confirmação (gerenciado externamente)
let confirmCallback = null;

/**
 * Escapar HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto escapado
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Mostrar notificação toast
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de toast ('info', 'success', 'error', 'warning')
 */
export function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Mostrar modal de confirmação
 * @param {string} title - Título da modal
 * @param {string} message - Mensagem da modal
 * @param {Function} onConfirm - Callback a ser executado ao confirmar
 */
export function showConfirmModal(title, message, onConfirm) {
    const confirmModal = document.getElementById('confirm-modal');
    const confirmModalTitle = document.getElementById('confirm-modal-title');
    const confirmModalMessage = document.getElementById('confirm-modal-message');
    
    if (confirmModalTitle) confirmModalTitle.textContent = title;
    if (confirmModalMessage) confirmModalMessage.textContent = message;
    if (confirmModal) confirmModal.classList.add('active');
    
    // Armazenar callback
    confirmCallback = onConfirm;
}

/**
 * Obter callback de confirmação e limpar
 * @returns {Function|null} Callback armazenado
 */
export function getConfirmCallback() {
    const callback = confirmCallback;
    confirmCallback = null;
    return callback;
}

/**
 * Criar seção de feedback
 * @param {string} type - Tipo de seção ('success', 'warning', 'info', 'error')
 * @param {string} title - Título da seção
 * @param {Array<string>} items - Lista de itens
 * @returns {HTMLElement} Elemento da seção criada
 */
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

/**
 * Exibir modal de feedback
 * @param {Object} data - Dados do feedback
 * @param {string} data.title - Título do feedback
 * @param {Array<string>} data.created - Itens criados
 * @param {Array<string>} data.duplicates - Itens duplicados
 * @param {Array<string>} data.existing - Itens já existentes
 * @param {Array<string>} data.errors - Erros
 */
export function showFeedbackModal(data) {
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackModalBody = document.getElementById('feedback-modal-body');
    const feedbackModalTitle = document.getElementById('feedback-modal-title');
    
    if (!feedbackModal || !feedbackModalBody) return;
    
    const {
        title = 'Resultado da Criação',
        created = [],
        duplicates = [],
        existing = [],
        errors = []
    } = data;
    
    if (feedbackModalTitle) feedbackModalTitle.textContent = title;
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
