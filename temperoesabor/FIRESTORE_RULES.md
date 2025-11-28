# Regras do Firestore - Tempero & Sabor

## Problema: Erro de Permissões ao Salvar Categoria

Se você está recebendo o erro `FirebaseError: Missing or insufficient permissions` ao tentar salvar uma categoria, é necessário atualizar as regras de segurança do Firestore.

## Como Atualizar as Regras

### Passo 1: Acessar o Console do Firebase
1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/firestore/rules

### Passo 2: Atualizar as Regras

Adicione a collection `ingredientCategories` às regras. As regras devem ficar assim:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para produtos
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Regras para ingredientes
    match /ingredients/{ingredientId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Regras para categorias de ingredientes
    match /ingredientCategories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Regras para configurações
    match /config/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Passo 3: Publicar as Regras

1. Clique no botão **"PUBLISH"** (Publicar) no topo da página
2. Aguarde alguns segundos para as regras serem aplicadas
3. Recarregue a página do admin (Ctrl+Shift+R ou Cmd+Shift+R)
4. Tente salvar a categoria novamente

## Explicação das Regras

- **`allow read: if true`**: Permite leitura para todos (usuários autenticados e não autenticados)
- **`allow write: if request.auth != null`**: Permite escrita apenas para usuários autenticados

Isso garante que:
- Qualquer pessoa pode ver produtos, ingredientes e categorias (necessário para o cardápio público)
- Apenas usuários autenticados podem criar, editar ou excluir dados (proteção do admin)

## Nota Importante

As regras do Firestore são aplicadas imediatamente após a publicação, mas pode levar alguns segundos para serem propagadas. Se ainda houver erro após publicar, aguarde 10-15 segundos e tente novamente.

