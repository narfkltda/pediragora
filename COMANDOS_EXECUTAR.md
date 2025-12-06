# Comandos para Executar Manualmente

## ✅ Passos Automatizados (Já Executados)

- ✅ Bridge Server iniciado na porta 3002
- ✅ ngrok instalado

## 📋 Passos que Precisam de Interação

### 1. Login no Firebase

Execute no terminal:

```bash
cd pediragora
firebase login
```

Isso abrirá o navegador para autenticação. Complete o login.

### 2. Verificar URL do ngrok

O ngrok está rodando em background. Para ver a URL:

```bash
curl http://localhost:4040/api/tunnels
```

Ou acesse no navegador: http://localhost:4040

Copie a URL HTTPS (ex: `https://xxxx-xxxx-xxxx.ngrok-free.app`)

### 3. Deploy da Cloud Function

Após fazer login no Firebase:

```bash
cd pediragora
firebase deploy --only functions
```

Aguarde o deploy terminar e copie a URL da Cloud Function gerada.

## 🔍 Verificar Status

### Bridge Server
```bash
curl http://localhost:3002/health
```

### ngrok
```bash
curl http://localhost:4040/api/tunnels
```

### Processos Rodando
```bash
# Ver processos
lsof -i :3002  # Bridge server
lsof -i :4040  # ngrok
```

## 📝 Próximos Passos Após Deploy

1. Configurar `bridgeConfig/default` no Firestore com a URL do ngrok
2. Configurar `functionConfig/default` no Firestore com a URL da Cloud Function
3. Configurar impressora no Admin Panel
