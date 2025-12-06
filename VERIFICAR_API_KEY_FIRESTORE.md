# 🔑 Verificar e Corrigir API Key no Firestore

## ✅ API Key Correta do Bridge Server

A API Key que deve estar no Firestore é:
```
0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0
```

## 📋 Passo a Passo para Corrigir

### Passo 1: Acessar Firestore

1. **Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

2. **Navegue até:**
   - Coleção: `bridgeConfig`
   - Documento: `default`

### Passo 2: Verificar e Atualizar API Key

1. **Verifique o campo `apiKey`:**
   - Deve conter: `0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0`

2. **Se estiver diferente:**
   - Clique no campo `apiKey`
   - Apague o valor atual
   - Cole: `0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0`
   - Clique em "Atualizar" ou "Salvar"

### Passo 3: Verificar URL do ngrok

Também verifique se o campo `url` está correto:
- Deve ser a URL atual do ngrok (ex: `https://nondeceptive-sickeningly-marylyn.ngrok-free.dev`)

### Passo 4: Testar

1. **Recarregue a página do pedido** (Ctrl+Shift+R)
2. **Tente imprimir novamente**

## ⚠️ Importante

- A API Key no Firestore deve ser **exatamente igual** à do arquivo `.env`
- Sem espaços antes ou depois
- Sem quebras de linha

Avise quando terminar para testarmos!
