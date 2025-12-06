# Passo a Passo Manual - O Que Fazer Agora

## ✅ O Que Já Foi Feito Automaticamente

- ✅ Bridge Server rodando na porta 3002
- ✅ ngrok instalado
- ✅ Dependências instaladas
- ✅ Scripts de automação criados
- ✅ Código pronto para deploy

## 📋 Passos Manuais Necessários

### PASSO 1: Configurar ngrok (5 minutos)

**Por que precisa ser manual:** ngrok requer autenticação com conta.

**Como fazer:**

1. **Criar conta no ngrok:**
   - Acesse: https://dashboard.ngrok.com/signup
   - Crie uma conta gratuita (ou faça login se já tiver)

2. **Obter authtoken:**
   - Acesse: https://dashboard.ngrok.com/get-started/your-authtoken
   - Copie o **authtoken** (string longa)

3. **Configurar ngrok no terminal:**
   ```bash
   ngrok config add-authtoken SEU_AUTHTOKEN_AQUI
   ```
   (Substitua `SEU_AUTHTOKEN_AQUI` pelo token copiado)

4. **Iniciar ngrok:**
   ```bash
   cd pediragora
   ngrok http 3002
   ```

5. **Copiar URL gerada:**
   - Você verá algo como: `https://xxxx-xxxx-xxxx.ngrok-free.app`
   - **COPIE ESTA URL COMPLETA** (você precisará dela depois)

**✅ Quando terminar:** Anote a URL do ngrok e me avise!

---

### PASSO 2: Login no Firebase (2 minutos)

**Por que precisa ser manual:** Requer autenticação no navegador.

**Como fazer:**

1. **Executar login:**
   ```bash
   cd pediragora
   firebase login
   ```

2. **Autenticar no navegador:**
   - O comando abrirá o navegador automaticamente
   - Faça login com sua conta Google
   - Autorize o acesso

3. **Verificar:**
   ```bash
   firebase projects:list
   ```
   Deve mostrar o projeto `temperoesabor-57382`

**✅ Quando terminar:** Me avise que está logado!

---

### PASSO 3: Deploy da Cloud Function (5 minutos)

**Como fazer:**

1. **Executar deploy:**
   ```bash
   cd pediragora
   firebase deploy --only functions
   ```

2. **Aguardar deploy:**
   - Pode levar alguns minutos
   - Você verá mensagens de progresso

3. **Copiar URL gerada:**
   - No final, você verá algo como:
     ```
     Function URL (printOrder): https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder
     ```
   - **COPIE ESTA URL COMPLETA**

**✅ Quando terminar:** Anote a URL da Cloud Function e me avise!

---

### PASSO 4: Configurar Firestore (10 minutos)

Você tem 2 opções:

#### Opção A: Via Console Web (Mais Fácil)

1. **Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

2. **Criar `bridgeConfig/default`:**
   - Clique em "Iniciar coleção" ou "Adicionar coleção"
   - ID da coleção: `bridgeConfig`
   - ID do documento: `default`
   - Adicione campos:
     - `url` (string): URL do ngrok do Passo 1
     - `apiKey` (string): `0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0`
     - `enabled` (boolean): `true`
   - Salvar

3. **Criar `functionConfig/default`:**
   - Clique em "Adicionar coleção"
   - ID da coleção: `functionConfig`
   - ID do documento: `default`
   - Adicione campos:
     - `url` (string): URL da Cloud Function do Passo 3
     - `enabled` (boolean): `true`
   - Salvar

#### Opção B: Via Script (Mais Rápido)

Se você já tem as URLs do ngrok e Cloud Function:

```bash
cd pediragora
NGROK_URL="https://sua-url-ngrok.ngrok-free.app" \
FUNCTION_URL="https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder" \
node scripts/config-firestore.js
```

**✅ Quando terminar:** Me avise que configurou!

---

### PASSO 5: Configurar Impressora no Admin (2 minutos)

1. **Acessar Admin:**
   - Abra: `http://localhost:8080/pediragora/temperoesabor/adm/index.html`
   - Faça login (se necessário)

2. **Configurar Impressora:**
   - Vá em "⚙️ Configurações" no menu lateral
   - Role até "Configuração de Impressora"
   - Preencha:
     - **IP da Impressora:** `192.168.68.101`
     - **Máscara de Sub-rede:** `255.255.255.0`
     - **Gateway:** `192.168.68.1`
   - Clique em "Salvar Configuração"

**✅ Quando terminar:** Me avise!

---

## 🎯 Ordem Recomendada

1. ✅ **Passo 1** (ngrok) - 5 min
2. ✅ **Passo 2** (Firebase login) - 2 min
3. ✅ **Passo 3** (Deploy) - 5 min
4. ✅ **Passo 4** (Firestore) - 10 min
5. ✅ **Passo 5** (Admin) - 2 min

**Tempo total: ~25 minutos**

---

## 🆘 Precisa de Ajuda?

- **ngrok não funciona?** Veja `CONFIGURAR_NGROK.md`
- **Firebase login falha?** Tente: `firebase login --reauth`
- **Deploy falha?** Verifique se está logado e se o projeto está correto
- **Firestore não salva?** Verifique se as regras foram aplicadas

---

## ✅ Checklist Final

- [ ] ngrok configurado e URL copiada
- [ ] Firebase login realizado
- [ ] Cloud Function deployada e URL copiada
- [ ] bridgeConfig criado no Firestore
- [ ] functionConfig criado no Firestore
- [ ] Impressora configurada no Admin
- [ ] Teste de impressão realizado

**Quando completar todos os passos, me avise para testarmos tudo!**
