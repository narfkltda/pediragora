# Firestore Security Rules

Adicione estas regras no Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras existentes do projeto...
    
    // Configuração da Impressora
    match /printerConfig/{configId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Configuração do Bridge Server
    match /bridgeConfig/{configId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Configuração da Cloud Function
    match /functionConfig/{configId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Explicação das Regras

- **read: if true** - Permite leitura pública (necessário para o frontend buscar configurações)
- **write: if request.auth != null** - Permite escrita apenas para usuários autenticados (admin)

## Como Aplicar

1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/firestore/rules
2. Cole as regras acima
3. Clique em "Publicar"

