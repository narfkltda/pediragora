# ✅ Checklist Completo - Fluxo de Impressão

## 🔍 Verificação Completa do Fluxo

### 1️⃣ Bridge Server Local

**Status:** ⬜ Verificar

- [ ] Bridge server está rodando na porta 3002
- [ ] Comando: `cd pediragora/temperoesabor/pedido-server && npm start`
- [ ] Deve mostrar: `🚀 Bridge Server iniciado` e `📡 Servidor rodando em http://localhost:3002`

**Configuração no arquivo `.env`:**
- [ ] `API_KEY=0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0`
- [ ] `PRINTER_IP=192.168.68.101`
- [ ] `PRINTER_PORT=9100`
- [ ] `PORT=3002`

---

### 2️⃣ ngrok (Túnel para Bridge Server)

**Status:** ⬜ Verificar

- [ ] ngrok está rodando
- [ ] Comando: `ngrok http 3002`
- [ ] URL HTTPS gerada (ex: `https://xxxx-xxxx-xxxx.ngrok-free.app`)
- [ ] **COPIE A URL COMPLETA DO NGROK AQUI:** `___________________________`

**IMPORTANTE:** A URL do ngrok muda toda vez que você reinicia o ngrok (exceto com plano pago).

---

### 3️⃣ Firestore - bridgeConfig

**Status:** ⬜ Verificar

**Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

**Coleção:** `bridgeConfig`  
**Documento:** `default`

**Campos necessários:**
- [ ] `url` (string): Deve ser a URL do ngrok do Passo 2
  - Valor atual: `___________________________`
  - Deve ser: `https://xxxx-xxxx-xxxx.ngrok-free.app` (sem barra no final)
  
- [ ] `apiKey` (string): Deve ser exatamente igual ao `.env` do bridge server
  - Valor atual: `___________________________`
  - Deve ser: `0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0`
  
- [ ] `enabled` (boolean): Deve ser `true`
  - Valor atual: `___________________________`

---

### 4️⃣ Firestore - functionConfig

**Status:** ⬜ Verificar

**Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

**Coleção:** `functionConfig`  
**Documento:** `default`

**Campos necessários:**
- [ ] `url` (string): Deve ser a URL da Cloud Function
  - Valor atual: `___________________________`
  - Deve ser: `https://printorder-xyaibsfnra-uc.a.run.app` (sem barra no final)
  
- [ ] `enabled` (boolean): Deve ser `true`
  - Valor atual: `___________________________`

---

### 5️⃣ Cloud Function - Permissões

**Status:** ⬜ Verificar

**Acesse:** https://console.cloud.google.com/functions/details/us-central1/printorder?project=temperoesabor-57382

**Aba "SECURITY":**
- [ ] "Allow public access" está marcado (não "Require authentication")

**Aba "PERMISSIONS":**
- [ ] Service account `firebase-adminsdk-fbsvc@temperoesabor-57382.iam.gserviceaccount.com` tem:
  - [ ] Cloud Datastore User
  - [ ] Cloud Functions Admin
  - [ ] Firebase Admin SDK Administrator Service Agent

- [ ] Service account `827430491530-compute@developer.gserviceaccount.com` tem:
  - [ ] Cloud Datastore User
  - [ ] Cloud Functions Developer

---

### 6️⃣ Cloud Function - Deploy

**Status:** ⬜ Verificar

- [ ] Cloud Function está deployada
- [ ] URL da função: `https://printorder-xyaibsfnra-uc.a.run.app`
- [ ] Último deploy foi bem-sucedido

**Para verificar:**
```bash
cd pediragora
firebase functions:list
```

---

### 7️⃣ Firestore - Regras de Segurança

**Status:** ⬜ Verificar

**Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/rules

**Verifique se as regras incluem:**
```javascript
match /bridgeConfig/{configId} {
  allow read: if true;
  allow write: if request.auth != null;
}

match /functionConfig/{configId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

- [ ] Regras estão publicadas (botão "Publicar" foi clicado)

---

## 🔄 Fluxo Completo

1. **Frontend** (`pedido.js`) → Chama Cloud Function
2. **Cloud Function** → Busca `bridgeConfig` no Firestore
3. **Cloud Function** → Chama Bridge Server via ngrok (com API Key)
4. **Bridge Server** → Valida API Key
5. **Bridge Server** → Conecta na impressora via TCP/IP
6. **Bridge Server** → Envia comandos ESC/POS
7. **Impressora** → Imprime o pedido

---

## 🐛 Diagnóstico do Erro Atual

**Erro:** "API Key inválida"

**Possíveis causas:**
1. ❌ API Key no Firestore diferente da API Key no `.env` do bridge server
2. ❌ Bridge server não está rodando
3. ❌ ngrok não está rodando ou URL mudou
4. ❌ URL do ngrok no Firestore está incorreta
5. ❌ Bridge server rejeitou a requisição por outro motivo

**Para diagnosticar:**
1. Verifique se o bridge server está rodando: `curl http://localhost:3002/health`
2. Verifique se o ngrok está rodando e qual é a URL atual
3. Compare a API Key do Firestore com a do `.env`
4. Verifique os logs do bridge server quando a requisição chegar

---

## 📋 Preencha os Valores Atuais

**URL do ngrok (atual):** `___________________________`

**API Key no Firestore (bridgeConfig/default/apiKey):** `___________________________`

**URL da Cloud Function no Firestore (functionConfig/default/url):** `___________________________`

**Bridge server está rodando?** ⬜ Sim ⬜ Não

**ngrok está rodando?** ⬜ Sim ⬜ Não
