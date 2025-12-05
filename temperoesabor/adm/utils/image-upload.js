/**
 * Image Upload Utilities
 * Funções reutilizáveis para upload e preview de imagens
 */

// Estado local do módulo
let currentImageFile = null;

/**
 * Obter arquivo de imagem atual
 * @returns {File|null} Arquivo de imagem atual
 */
export function getCurrentImageFile() {
    return currentImageFile;
}

/**
 * Definir arquivo de imagem atual
 * @param {File|null} file - Arquivo de imagem
 */
export function setCurrentImageFile(file) {
    currentImageFile = file;
}

/**
 * Exibir preview da imagem
 * @param {File|Blob} imageFile - Arquivo ou blob da imagem
 * @param {HTMLElement} previewImg - Elemento img para preview
 */
export function showImagePreview(imageFile, previewImg) {
    if (!previewImg) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        if (previewImg) {
            previewImg.src = e.target.result;
        }
    };
    reader.readAsDataURL(imageFile);
}

/**
 * Resetar preview de imagem
 * @param {HTMLElement} imageUploadPlaceholder - Elemento placeholder
 * @param {HTMLElement} imagePreviewContainer - Container do preview
 * @param {HTMLElement} previewImg - Elemento img do preview
 * @param {HTMLInputElement} productImageUrl - Input de URL da imagem
 * @param {HTMLInputElement} productImageInput - Input file da imagem
 */
export function resetImagePreview(imageUploadPlaceholder, imagePreviewContainer, previewImg, productImageUrl, productImageInput) {
    if (!imageUploadPlaceholder || !imagePreviewContainer) return;
    
    currentImageFile = null;
    imageUploadPlaceholder.style.display = 'flex';
    imagePreviewContainer.style.display = 'none';
    if (previewImg) previewImg.src = '';
    if (productImageUrl) productImageUrl.value = '';
    if (productImageInput) {
        productImageInput.value = '';
    }
}

/**
 * Processar imagem selecionada
 * @param {File} file - Arquivo de imagem
 * @param {HTMLElement} imageUploadPlaceholder - Elemento placeholder
 * @param {HTMLElement} imagePreviewContainer - Container do preview
 * @param {HTMLElement} previewImg - Elemento img do preview
 */
export function handleImageSelection(file, imageUploadPlaceholder, imagePreviewContainer, previewImg) {
    if (!file || !imageUploadPlaceholder || !imagePreviewContainer) return;

    currentImageFile = file;
    
    // Mostrar preview
    showImagePreview(file, previewImg);
    imageUploadPlaceholder.style.display = 'none';
    imagePreviewContainer.style.display = 'block';
}

/**
 * Carregar preview da imagem existente (para edição)
 * @param {string} imageUrl - URL da imagem
 * @param {HTMLElement} previewImg - Elemento img do preview
 * @param {HTMLInputElement} productImageUrl - Input de URL da imagem
 * @param {HTMLElement} imageUploadPlaceholder - Elemento placeholder
 * @param {HTMLElement} imagePreviewContainer - Container do preview
 */
export function loadExistingImagePreview(imageUrl, previewImg, productImageUrl, imageUploadPlaceholder, imagePreviewContainer) {
    console.log('🖼️ [DEBUG] loadExistingImagePreview chamado');
    console.log('   - URL recebida:', imageUrl);
    console.log('   - Tipo:', typeof imageUrl);
    console.log('   - É string vazia?', imageUrl === '');
    console.log('   - Trim vazio?', !imageUrl || imageUrl.trim() === '');
    
    if (!imageUrl || !imageUrl.trim()) {
        console.warn('⚠️ [DEBUG] URL vazia ou inválida, resetando preview');
        resetImagePreview(imageUploadPlaceholder, imagePreviewContainer, previewImg, productImageUrl, null);
        return;
    }

    if (!previewImg || !productImageUrl) {
        console.error('❌ [DEBUG] Elementos de preview não disponíveis');
        console.error('   - previewImg existe?', !!previewImg);
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

    // Configurar handlers ANTES de definir src
    previewImg.onload = () => {
        console.log('✅ [DEBUG] Imagem carregada com sucesso no preview');
        console.log('   - Dimensões:', previewImg.naturalWidth, 'x', previewImg.naturalHeight);
        if (imageUploadPlaceholder) {
            imageUploadPlaceholder.style.display = 'none';
            console.log('   - Placeholder escondido');
        }
        if (imagePreviewContainer) {
            imagePreviewContainer.style.display = 'block';
            console.log('   - Container de preview mostrado');
        }
    };
    
    previewImg.onerror = () => {
        console.error('❌ [DEBUG] Erro ao carregar imagem no preview');
        console.error('   - URL tentada:', normalizedUrl);
        console.error('   - this.src atual:', previewImg.src);
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
    previewImg.src = normalizedUrl;
    
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
