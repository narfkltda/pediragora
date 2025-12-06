# ✅ Sistema Pronto para Deploy

## Status Atual

✅ Bridge Server configurado e rodando na porta 3002
✅ API Key gerada automaticamente
✅ Cloud Functions criadas e prontas para deploy
✅ Frontend atualizado para usar Cloud Function
✅ Painel Admin com configuração de impressora
✅ Serviços de configuração criados

## API Key Gerada

**IMPORTANTE:** Anote esta API Key - você precisará configurá-la no Firestore:

```
0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0
```

Esta mesma chave deve ser configurada em:
1. Firestore → `bridgeConfig/default` → campo `apiKey`
2. (Opcional) Variável de ambiente da Cloud Function

## Próximos Passos para Deploy

### 1. Expor Bridge Server via ngrok

```bash
# Em um novo terminal
ngrok http 3002
```

Copie a URL HTTPS gerada (ex: `https://xxxx-xxxx-xxxx.ngrok-free.app`)

### 2. Configurar Firestore

#### 2.1 Aplicar Regras de Segurança
- Siga as instruções em `FIRESTORE_RULES.md`

#### 2.2 Criar `bridgeConfig/default`
```json
{
  "url": "https://SEU-NGROK-URL.ngrok-free.app",
  "apiKey": "0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0",
  "enabled": true
}
```

### 3. Deploy Cloud Function

```bash
cd pediragora
firebase login
firebase deploy --only functions
```

Após o deploy, copie a URL gerada (ex: `https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder`)

### 4. Configurar `functionConfig/default` no Firestore

```json
{
  "url": "https://us-central1-temperoesabor-57382.cloudfunctions.net/printOrder",
  "enabled": true
}
```

### 5. Configurar Impressora no Admin

1. Acesse: `http://localhost:8080/pediragora/temperoesabor/adm/index.html`
2. Vá em "Configurações" → "Configuração de Impressora"
3. Preencha:
   - IP: `192.168.68.101`
   - Máscara: `255.255.255.0`
   - Gateway: `192.168.68.1`
4. Clique em "Salvar Configuração"

## Teste Completo

1. Acesse: `http://localhost:8080/pediragora/temperoesabor/pedido/`
2. Cole um pedido do WhatsApp
3. Clique em "Formatar Pedido"
4. Clique em "Imprimir Pedido" → "OK"
5. O fluxo será: Frontend → Cloud Function → Bridge (ngrok) → Impressora

## Arquivos Importantes

- `SETUP_BRIDGE_CLOUD.md` - Guia completo de setup
- `FIRESTORE_RULES.md` - Regras de segurança do Firestore
- `pedido-server/.env` - Configurações do bridge (API Key)
- `functions/.env.example` - Exemplo de variáveis para Cloud Function

## Notas

- O bridge server deve estar sempre rodando na rede local
- O ngrok deve estar ativo para a Cloud Function acessar o bridge
- Para produção, considere ngrok pago ou Cloudflare Tunnel para URL permanente

