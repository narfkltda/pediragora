# Deploy da Cloud Function - AGORA

## ✅ Status Atual

- ✅ ngrok configurado e funcionando
- ✅ bridgeConfig configurado no Firestore
- ⏳ Próximo: Deploy da Cloud Function

## 📋 Passo 1: Login no Firebase

Execute no terminal:

```bash
cd pediragora
firebase login
```

**O que vai acontecer:**
- O comando abrirá o navegador automaticamente
- Você verá uma tela de autenticação do Google
- Faça login com a conta que tem acesso ao projeto `temperoesabor-57382`
- Autorize o acesso
- Volte ao terminal e verá "Success! Logged in as..."

**✅ Quando terminar:** Me avise que está logado!

---

## 📋 Passo 2: Deploy da Cloud Function

Após fazer login, execute:

```bash
cd pediragora
firebase deploy --only functions
```

**O que vai acontecer:**
- O Firebase vai compilar as Cloud Functions
- Vai fazer upload para o Firebase
- Pode levar 2-5 minutos
- No final, você verá algo como:

```
✔  functions[printOrder(us-central1)] Successful create operation.
Function URL (printOrder): https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder
```

**⚠️ IMPORTANTE:** Copie a URL completa da Cloud Function!

**✅ Quando terminar:** Me envie a URL da Cloud Function!

---

## 📋 Passo 3: Configurar functionConfig no Firestore

Após obter a URL da Cloud Function:

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
   - Valor: `COLE_A_URL_DA_CLOUD_FUNCTION_AQUI`

   **Campo 2:**
   - Campo: `enabled`
   - Tipo: `boolean`
   - Valor: `true`

4. **Clique em "Salvar"**

**✅ Quando terminar:** Me avise!

---

## 📋 Passo 4: Configurar Impressora no Admin

1. **Acesse:** `http://localhost:8080/pediragora/temperoesabor/adm/index.html`
2. **Faça login** (se necessário)
3. **Vá em "⚙️ Configurações"** no menu lateral
4. **Role até "Configuração de Impressora"**
5. **Preencha:**
   - IP da Impressora: `192.168.68.101`
   - Máscara de Sub-rede: `255.255.255.0`
   - Gateway: `192.168.68.1`
6. **Clique em "Salvar Configuração"**

**✅ Quando terminar:** Me avise!

---

## 🎯 Ordem de Execução

1. ✅ bridgeConfig configurado
2. ⏳ **Login Firebase** ← VOCÊ ESTÁ AQUI
3. ⏳ Deploy Cloud Function
4. ⏳ Configurar functionConfig
5. ⏳ Configurar Impressora no Admin
6. ⏳ Testar tudo

---

## 🆘 Problemas Comuns

### Firebase login não abre navegador
- Tente: `firebase login --no-localhost`
- Ou: `firebase login --reauth`

### Deploy falha com erro de permissão
- Verifique se está logado: `firebase projects:list`
- Verifique se o projeto está correto: `firebase use temperoesabor-57382`

### Deploy demora muito
- Normal, pode levar até 5 minutos
- Aguarde até ver "Successful create operation"

---

**Comece pelo Passo 1 (Login Firebase). Quando terminar, me avise!**
