# Próximos Passos - Configuração Completa

## ✅ Passo 1: Regras do Firestore - CONCLUÍDO

## 📋 Passo 2: Configurar Bridge Server no Firestore

### 2.1 Obter URL do ngrok

Primeiro, você precisa expor o bridge server via ngrok:

```bash
# Em um novo terminal (deixe o bridge server rodando)
ngrok http 3002
```

Você verá algo como:
```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:3002
```

**Copie a URL HTTPS completa** (ex: `https://xxxx-xxxx-xxxx.ngrok-free.app`)

### 2.2 Criar Coleção `bridgeConfig` no Firestore

1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/firestore/data
2. Clique em "Iniciar coleção" (se for a primeira vez) ou "Adicionar coleção"
3. **ID da coleção:** `bridgeConfig`
4. Clique em "Próximo"
5. **ID do documento:** `default`
6. Adicione os campos:

   **Campo 1:**
   - Campo: `url`
   - Tipo: `string`
   - Valor: `https://SEU-NGROK-URL.ngrok-free.app` (cole a URL do ngrok)

   **Campo 2:**
   - Campo: `apiKey`
   - Tipo: `string`
   - Valor: `0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0`

   **Campo 3:**
   - Campo: `enabled`
   - Tipo: `boolean`
   - Valor: `true`

7. Clique em "Salvar"

## 📋 Passo 3: Deploy da Cloud Function

### 3.1 Fazer Login no Firebase

```bash
cd pediragora
firebase login
```

### 3.2 Deploy

```bash
firebase deploy --only functions
```

**Aguarde o deploy terminar.** Você verá uma mensagem como:

```
✔  functions[printOrder(us-central1)] Successful create operation.
Function URL (printOrder): https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder
```

**Copie a URL da Cloud Function** (ex: `https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder`)

## 📋 Passo 4: Configurar Cloud Function no Firestore

### 4.1 Criar Coleção `functionConfig`

1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/firestore/data
2. Clique em "Adicionar coleção"
3. **ID da coleção:** `functionConfig`
4. Clique em "Próximo"
5. **ID do documento:** `default`
6. Adicione os campos:

   **Campo 1:**
   - Campo: `url`
   - Tipo: `string`
   - Valor: `https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder` (cole a URL do deploy)

   **Campo 2:**
   - Campo: `enabled`
   - Tipo: `boolean`
   - Valor: `true`

7. Clique em "Salvar"

## 📋 Passo 5: Configurar Impressora no Admin Panel

### 5.1 Acessar Admin

1. Acesse: `http://localhost:8080/pediragora/temperoesabor/adm/index.html`
2. Faça login (se necessário)

### 5.2 Configurar Impressora

1. Vá em "⚙️ Configurações" no menu lateral
2. Role até "Configuração de Impressora"
3. Preencha os campos:
   - **IP da Impressora:** `192.168.68.101`
   - **Máscara de Sub-rede:** `255.255.255.0`
   - **Gateway:** `192.168.68.1`
4. Clique em "Salvar Configuração"

## ✅ Passo 6: Testar Tudo

### 6.1 Verificar Bridge Server

```bash
curl http://localhost:3002/health
```

Deve retornar: `{"status":"ok",...}`

### 6.2 Verificar ngrok

```bash
curl https://SEU-NGROK-URL.ngrok-free.app/health
```

Deve retornar: `{"status":"ok",...}`

### 6.3 Testar Impressão Completa

1. Acesse: `http://localhost:8080/pediragora/temperoesabor/pedido/`
2. Cole um pedido do WhatsApp no campo de texto
3. Clique em "Formatar Pedido"
4. Clique em "Imprimir Pedido"
5. Escolha "OK" (para enviar para impressora térmica)
6. O fluxo será:
   - Frontend → Cloud Function → Bridge (ngrok) → Impressora

## 🔍 Checklist Final

- [x] Regras do Firestore aplicadas
- [ ] ngrok rodando e URL copiada
- [ ] `bridgeConfig/default` criado no Firestore
- [ ] Cloud Function deployada
- [ ] `functionConfig/default` criado no Firestore
- [ ] Impressora configurada no Admin Panel
- [ ] Teste de impressão realizado

## ⚠️ Importante

- O **bridge server** deve estar sempre rodando na porta 3002
- O **ngrok** deve estar ativo para a Cloud Function acessar o bridge
- Se reiniciar o ngrok, atualize a URL no Firestore (`bridgeConfig/default`)

## 🆘 Problemas Comuns

### ngrok não conecta
- Verifique se o bridge server está rodando: `curl http://localhost:3002/health`
- Verifique se a porta está correta (3002)

### Cloud Function retorna erro
- Verifique se `bridgeConfig` está configurado no Firestore
- Verifique se a API Key no Firestore é a mesma do `.env`
- Verifique se o ngrok está rodando

### Impressora não imprime
- Verifique se a impressora está ligada
- Verifique se está na mesma rede
- Teste: `ping 192.168.68.101`

