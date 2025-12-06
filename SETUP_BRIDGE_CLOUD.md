# Setup: Bridge Server + Cloud Function

## Passo 1: Configurar Bridge Server Local

### 1.1 Instalar Dependências
```bash
cd pediragora/temperoesabor/pedido-server
npm install
```

### 1.2 Configurar Variáveis de Ambiente
O arquivo `.env` já foi criado com uma API Key gerada automaticamente.

**Importante:** Anote a API Key gerada, você precisará dela para configurar no Firestore.

Para ver a API Key:
```bash
cd pediragora/temperoesabor/pedido-server
grep API_KEY .env
```

### 1.3 Iniciar Bridge Server
```bash
npm start
```

O servidor iniciará na porta 3002 e estará disponível em `http://localhost:3002`

## Passo 2: Expor Bridge Server via ngrok

### 2.1 Instalar ngrok (se ainda não tiver)
```bash
# macOS
brew install ngrok

# Ou baixar de: https://ngrok.com/download
```

### 2.2 Iniciar túnel
```bash
ngrok http 3002
```

### 2.3 Copiar URL HTTPS gerada
O ngrok gerará uma URL como: `https://xxxx-xxxx-xxxx.ngrok-free.app`

**IMPORTANTE:** Copie esta URL completa (com https://)

## Passo 3: Configurar Firestore

### 3.1 Aplicar Regras de Segurança
1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/firestore/rules
2. Cole as regras do arquivo `FIRESTORE_RULES.md`
3. Clique em "Publicar"

### 3.2 Criar Coleção `bridgeConfig`
1. Acesse: https://console.firebase.google.com/project/temperoesabor-57382/firestore/data
2. Clique em "Iniciar coleção"
3. ID da coleção: `bridgeConfig`
4. Adicione documento com ID: `default`
5. Campos:
   - `url` (string): URL do ngrok (ex: `https://xxxx-xxxx-xxxx.ngrok-free.app`)
   - `apiKey` (string): A mesma API Key do arquivo `.env` do bridge server
   - `enabled` (boolean): `true`

### 3.3 Criar Coleção `printerConfig` (Opcional - pode ser feito via admin)
1. ID da coleção: `printerConfig`
2. Documento ID: `default`
3. Campos:
   - `ip` (string): IP da impressora (ex: `192.168.68.101`)
   - `subnetMask` (string): Máscara de sub-rede (ex: `255.255.255.0`)
   - `gateway` (string): Gateway (ex: `192.168.68.1`)
   - `port` (number): `9100`
   - `enabled` (boolean): `true`

## Passo 4: Deploy da Cloud Function

### 4.1 Instalar Dependências
```bash
cd pediragora/functions
npm install
```

### 4.2 Fazer Login no Firebase
```bash
cd pediragora
firebase login
```

### 4.3 Deploy
```bash
firebase deploy --only functions
```

### 4.4 Copiar URL da Cloud Function
Após o deploy, você verá uma URL como:
```
https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder
```

## Passo 5: Configurar Cloud Function no Firestore

### 5.1 Criar Coleção `functionConfig`
1. Acesse o Firestore Console
2. Coleção: `functionConfig`
3. Documento ID: `default`
4. Campos:
   - `url` (string): URL da Cloud Function após deploy
   - `enabled` (boolean): `true`

## Passo 6: Configurar no Admin Panel

### 6.1 Acessar Admin
1. Acesse: `http://localhost:8080/pediragora/temperoesabor/adm/index.html`
2. Faça login

### 6.2 Configurar Impressora
1. Vá em "Configurações" → "Configuração de Impressora"
2. Preencha:
   - IP da Impressora: `192.168.68.101`
   - Máscara de Sub-rede: `255.255.255.0`
   - Gateway: `192.168.68.1`
3. Clique em "Salvar Configuração"

## Passo 7: Testar

### 7.1 Testar Bridge Server
```bash
curl http://localhost:3002/health
```

### 7.2 Testar via ngrok
```bash
curl https://SEU-NGROK-URL.ngrok-free.app/health
```

### 7.3 Testar Impressão
1. Acesse: `http://localhost:8080/pediragora/temperoesabor/pedido/`
2. Cole um pedido do WhatsApp
3. Clique em "Formatar Pedido"
4. Clique em "Imprimir Pedido" → escolha "OK"
5. O pedido deve ser enviado via Cloud Function → Bridge → Impressora

## Troubleshooting

### Bridge Server não inicia
- Verifique se a porta 3002 está livre: `lsof -i :3002`
- Verifique se o arquivo `.env` existe e tem a API_KEY

### ngrok não conecta
- Verifique se o bridge server está rodando
- Verifique se a porta está correta (3002)

### Cloud Function retorna erro
- Verifique se o `bridgeConfig` está configurado no Firestore
- Verifique se a API Key no Firestore é a mesma do `.env`
- Verifique se o ngrok está rodando e a URL está correta

### Impressora não imprime
- Verifique se a impressora está ligada e na mesma rede
- Verifique se o IP está correto
- Teste conectividade: `ping 192.168.68.101`

## Notas Importantes

- O ngrok gratuito gera uma nova URL a cada reinício. Para produção, considere ngrok pago ou Cloudflare Tunnel
- A API Key deve ser mantida em segredo
- O bridge server deve estar sempre rodando na rede local
- Para produção, considere usar um serviço de túnel permanente

