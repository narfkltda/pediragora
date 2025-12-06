# 🔑 Corrigir API Key no Firestore

O erro "API Key inválida" significa que a API Key configurada no Firestore não corresponde à API Key do bridge server.

## ✅ Solução: Verificar e Corrigir API Key no Firestore

### Passo 1: Verificar API Key do Bridge Server

1. **Acesse o diretório do bridge server:**
   ```bash
   cd pediragora/temperoesabor/pedido-server
   ```

2. **Veja a API Key no arquivo `.env`:**
   ```bash
   grep API_KEY .env
   ```
   
   Você verá algo como:
   ```
   API_KEY=0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0
   ```
   
   **Copie essa API Key completa** (sem espaços)

### Passo 2: Atualizar API Key no Firestore

1. **Acesse o Firestore:**
   - https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

2. **Navegue até:**
   - Coleção: `bridgeConfig`
   - Documento: `default`

3. **Edite o campo `apiKey`:**
   - Clique no campo `apiKey`
   - Cole a API Key que você copiou do arquivo `.env` do bridge server
   - **IMPORTANTE:** Certifique-se de que não há espaços extras no início ou fim

4. **Clique em "Atualizar" ou "Salvar"**

### Passo 3: Verificar se o Bridge Server Está Rodando

Certifique-se de que o bridge server está rodando:

```bash
cd pediragora/temperoesabor/pedido-server
npm start
```

O servidor deve mostrar:
```
🚀 Bridge Server iniciado
📡 Servidor rodando em http://localhost:3002
🔐 Autenticação: API Key configurada
```

### Passo 4: Verificar se o ngrok Está Rodando

Certifique-se de que o ngrok está expondo o bridge server:

```bash
ngrok http 3002
```

A URL do ngrok deve corresponder à URL configurada no Firestore (`bridgeConfig/default/url`).

### Passo 5: Testar Novamente

1. **Aguarde alguns segundos** para o Firestore atualizar
2. **Recarregue a página do pedido** (Ctrl+Shift+R)
3. **Tente imprimir novamente**

## 🔍 Verificação

Após corrigir, a API Key no Firestore deve ser **exatamente igual** à API Key no arquivo `.env` do bridge server.

## ⚠️ Importante

- A API Key é sensível a maiúsculas/minúsculas
- Não deve ter espaços no início ou fim
- Deve ser a mesma em ambos os lugares (Firestore e `.env`)
