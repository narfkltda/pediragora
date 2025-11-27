/**
 * Storage Service - Firebase Storage Operations
 * Gerencia upload de imagens para Firebase Storage
 */

import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { storage, auth } from '../firebase-config.js';

// Bucket name from Firebase config
const STORAGE_BUCKET = 'temperoesabor-57382.firebasestorage.app';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Valida o arquivo de imagem
 * @param {File} file - Arquivo a ser validado
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF.' 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `Arquivo muito grande. Tamanho máximo: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB` 
    };
  }

  return { valid: true };
}

/**
 * Faz upload da imagem do produto para Firebase Storage
 * @param {File} file - Arquivo de imagem
 * @param {string} productId - ID do produto (opcional, para edição)
 * @returns {Promise<string>} URL de download da imagem
 */
export async function uploadProductImage(file, productId = null) {
  try {
    console.log('uploadProductImage chamado com:', { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type,
      productId 
    });
    
    // Verificar se o storage está disponível
    if (!storage) {
      console.error('Storage não está disponível');
      throw new Error('Firebase Storage não está configurado corretamente.');
    }
    
    // Verificar se o usuário está autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('Usuário não autenticado');
      throw new Error('Você precisa estar autenticado para fazer upload de imagens. Por favor, faça login novamente.');
    }
    console.log('Usuário autenticado:', currentUser.email);
    console.log('UID do usuário:', currentUser.uid);
    
    // Forçar atualização do token antes do upload
    // Isso é crítico para garantir que o token está válido e será enviado corretamente
    try {
      const token = await currentUser.getIdToken(true); // true = força refresh
      console.log('Token de autenticação obtido e atualizado:', token ? 'Sim' : 'Não');
      if (!token) {
        throw new Error('Não foi possível obter o token de autenticação. Faça login novamente.');
      }
    } catch (tokenError) {
      console.error('Erro ao obter token:', tokenError);
      throw new Error('Erro ao obter token de autenticação. Por favor, faça login novamente.');
    }
    
    // Validar arquivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      console.error('Validação falhou:', validation.error);
      throw new Error(validation.error);
    }

    console.log('Arquivo validado com sucesso');

    // Criar caminho no storage - usar caminho mais simples para evitar problemas
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    // Simplificar o caminho - remover o subdiretório temp para evitar problemas
    const storagePath = productId 
      ? `products/${productId}/${fileName}`
      : `products/${fileName}`;

    console.log('Caminho no storage:', storagePath);
    console.log('Bucket:', STORAGE_BUCKET);

    const storageRef = ref(storage, storagePath);
    console.log('StorageRef criado:', storageRef);
    console.log('Storage configurado:', storage ? 'Sim' : 'Não');
    console.log('Auth configurado:', auth ? 'Sim' : 'Não');
    console.log('Usuário atual:', auth.currentUser ? auth.currentUser.email : 'Nenhum');

    // Fazer upload com timeout mais curto para detectar CORS mais rapidamente
    console.log('Iniciando uploadBytes...', new Date().toISOString());
    const uploadStartTime = Date.now();
    
    try {
      await uploadBytes(storageRef, file);
    } catch (uploadError) {
      // Se for erro de CORS, fornecer instruções detalhadas
      if (uploadError.message && (
        uploadError.message.includes('CORS') || 
        uploadError.message.includes('preflight') ||
        uploadError.message.includes('blocked')
      )) {
        console.error('\n🚨 ERRO DE CORS DETECTADO NO UPLOAD');
        console.error('========================================');
        console.error('O Firebase Storage está bloqueando o upload devido às regras de segurança.');
        console.error('\n📋 PASSO A PASSO PARA RESOLVER:');
        console.error('1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/storage/rules');
        console.error('2. Certifique-se de que as regras estão EXATAMENTE assim:');
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
        console.error('3. IMPORTANTE: Clique no botão "PUBLISH" (Publicar) no topo da página');
        console.error('4. Aguarde alguns segundos para as regras serem aplicadas');
        console.error('5. Recarregue esta página (Ctrl+Shift+R ou Cmd+Shift+R)');
        console.error('6. Tente fazer upload novamente');
        console.error('========================================\n');
      }
      throw uploadError;
    }
    
    const uploadDuration = Date.now() - uploadStartTime;
    console.log(`uploadBytes concluído em ${uploadDuration}ms`);

    // Obter URL de download
    console.log('Obtendo URL de download...', new Date().toISOString());
    const urlStartTime = Date.now();
    
    const downloadURL = await getDownloadURL(storageRef);
    
    const urlDuration = Date.now() - urlStartTime;
    console.log(`URL obtida em ${urlDuration}ms:`, downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Erro detalhado ao fazer upload da imagem:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem do erro:', error.message);
    console.error('Stack:', error.stack);
    
    // Melhorar mensagem de erro
    let errorMessage = 'Erro ao fazer upload';
    
    // Verificar se é erro de CORS (pode vir na mensagem, no código, ou no stack)
    const errorString = JSON.stringify(error).toLowerCase();
    const isCorsError = (error.message && (error.message.includes('CORS') || error.message.includes('blocked by CORS') || error.message.includes('preflight'))) ||
                       (error.code && error.code.includes('CORS')) ||
                       (errorString.includes('cors')) ||
                       (errorString.includes('preflight')) ||
                       (error.message && error.message.includes('XMLHttpRequest'));
    
    if (isCorsError) {
      errorMessage = 'ERRO DE CORS: O upload está sendo bloqueado pelas regras do Firebase Storage.\n\n' +
                    'SOLUÇÃO:\n' +
                    '1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/storage/rules\n' +
                    '2. Configure as regras para permitir uploads:\n\n' +
                    'rules_version = \'2\';\n' +
                    'service firebase.storage {\n' +
                    '  match /b/{bucket}/o {\n' +
                    '    match /products/{allPaths=**} {\n' +
                    '      allow read: if true;\n' +
                    '      allow write: if request.auth != null;\n' +
                    '    }\n' +
                    '  }\n' +
                    '}\n\n' +
                    '3. Clique em "Publish" para publicar as regras.';
    } else if (error.code) {
      switch (error.code) {
        case 'storage/unauthorized':
          errorMessage = 'Sem permissão para fazer upload. Verifique as regras do Firebase Storage. As regras devem permitir uploads para usuários autenticados.';
          break;
        case 'storage/canceled':
          errorMessage = 'Upload cancelado.';
          break;
        case 'storage/unknown':
          errorMessage = 'Erro desconhecido no Firebase Storage. Verifique as regras do Storage e sua conexão.';
          break;
        case 'storage/quota-exceeded':
          errorMessage = 'Quota do Firebase Storage excedida.';
          break;
        case 'storage/unauthenticated':
          errorMessage = 'Usuário não autenticado. Faça login novamente.';
          break;
        default:
          errorMessage = `Erro no Firebase Storage (${error.code}): ${error.message}`;
      }
    } else {
      errorMessage = error.message || 'Erro desconhecido ao fazer upload';
    }
    
    throw new Error(errorMessage);
  }
}

