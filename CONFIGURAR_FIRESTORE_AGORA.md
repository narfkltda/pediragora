# Configurar Firestore AGORA

## ✅ URL do ngrok obtida:
```
https://nondeceptive-sickeningly-marylyn.ngrok-free.dev
```

## 📋 Passo 1: Configurar bridgeConfig no Firestore

1. **Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

2. **Criar coleção `bridgeConfig`:**
   - Clique em "Iniciar coleção" ou "Adicionar coleção"
   - **ID da coleção:** `bridgeConfig`
   - Clique em "Próximo"

3. **Criar documento `default`:**
   - **ID do documento:** `default`
   - Adicione os campos:

   **Campo 1:**
   - Campo: `url`
   - Tipo: `string`
   - Valor: `https://nondeceptive-sickeningly-marylyn.ngrok-free.dev`

   **Campo 2:**
   - Campo: `apiKey`
   - Tipo: `string`
   - Valor: `0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0`

   **Campo 3:**
   - Campo: `enabled`
   - Tipo: `boolean`
   - Valor: `true`

4. **Clique em "Salvar"**

## 📋 Passo 2: Fazer Login no Firebase

Execute no terminal:

```bash
cd pediragora
firebase login
```

Isso abrirá o navegador. Faça login e autorize.

## 📋 Passo 3: Deploy da Cloud Function

Após fazer login:

```bash
cd pediragora
firebase deploy --only functions
```

**Copie a URL da Cloud Function gerada** (algo como: `https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder`)

## 📋 Passo 4: Configurar functionConfig no Firestore

1. **Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

2. **Criar coleção `functionConfig`:**
   - Clique em "Adicionar coleção"
   - **ID da coleção:** `functionConfig`
   - Clique em "Próximo"

3. **Criar documento `default`:**
   - **ID do documento:** `default`
   - Adicione os campos:

   **Campo 1:**
   - Campo: `url`
   - Tipo: `string`
   - Valor: `COLE_A_URL_DA_CLOUD_FUNCTION_AQUI` (do Passo 3)

   **Campo 2:**
   - Campo: `enabled`
   - Tipo: `boolean`
   - Valor: `true`

4. **Clique em "Salvar"**

## ✅ Quando terminar, me avise!
