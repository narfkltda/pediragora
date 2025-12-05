/**
 * Modal Utilities
 * Funções reutilizáveis para gerenciamento de modais
 */

/**
 * Abrir modal como sidebar (estilo carrinho)
 * @param {HTMLElement} modalOverlay - Elemento overlay da modal
 * @param {HTMLElement} modalContent - Elemento content da modal
 */
export function openModal(modalOverlay, modalContent) {
    if (!modalOverlay || !modalContent) return;
    
    // Resetar scroll para 0
    window.scrollTo(0, 0);
    
    // Adicionar classes para abrir
    modalOverlay.classList.add('active');
    modalContent.classList.add('open');
    
    // Bloquear scroll do body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';
}

/**
 * Fechar modal sidebar
 * @param {HTMLElement} modalOverlay - Elemento overlay da modal
 * @param {HTMLElement} modalContent - Elemento content da modal
 */
export function closeModal(modalOverlay, modalContent) {
    if (!modalOverlay || !modalContent) return;
    
    // Remover classes
    modalOverlay.classList.remove('active');
    modalContent.classList.remove('open');
    
    // Remover estilos inline
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    
    // Resetar scroll para 0
    window.scrollTo(0, 0);
}
