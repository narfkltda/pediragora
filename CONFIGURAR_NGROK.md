# Configurar ngrok

## Passo 1: Criar Conta e Obter Authtoken

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie uma conta gratuita (ou faça login se já tiver)
3. Acesse: https://dashboard.ngrok.com/get-started/your-authtoken
4. Copie o **authtoken** (algo como: `2abc123def456ghi789jkl012mno345pqr678stu`)

## Passo 2: Configurar ngrok

Execute no terminal:

```bash
ngrok config add-authtoken SEU_AUTHTOKEN_AQUI
```

Substitua `SEU_AUTHTOKEN_AQUI` pelo token que você copiou.

## Passo 3: Iniciar ngrok

Após configurar o authtoken, execute:

```bash
cd pediragora
ngrok http 3002
```

Você verá algo como:

```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:3002
```

**Copie a URL HTTPS** (ex: `https://xxxx-xxxx-xxxx.ngrok-free.app`)

## Passo 4: Verificar

Em outro terminal, teste:

```bash
curl https://SEU-NGROK-URL.ngrok-free.app/health
```

Deve retornar: `{"status":"ok",...}`

## Alternativa: Cloudflare Tunnel (Gratuito e Permanente)

Se preferir uma alternativa gratuita e com URL permanente:

1. Instale: `brew install cloudflare/cloudflare/cloudflared`
2. Execute: `cloudflared tunnel --url http://localhost:3002`
3. Use a URL gerada (permanente enquanto o túnel estiver ativo)
