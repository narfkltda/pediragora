#!/bin/bash

# Script para configurar e iniciar ngrok

echo "🔍 Verificando ngrok..."

if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok não encontrado. Instalando..."
    brew install ngrok
fi

# Verificar se já tem authtoken configurado
if ngrok config check &> /dev/null; then
    echo "✅ ngrok já configurado"
else
    echo ""
    echo "⚠️  ngrok precisa de autenticação!"
    echo ""
    echo "📋 Passos para configurar:"
    echo "   1. Acesse: https://dashboard.ngrok.com/signup"
    echo "   2. Crie uma conta (gratuita)"
    echo "   3. Acesse: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "   4. Copie o authtoken"
    echo "   5. Execute: ngrok config add-authtoken SEU_TOKEN"
    echo ""
    read -p "Já configurou o authtoken? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Configure o authtoken primeiro e execute este script novamente."
        exit 1
    fi
fi

# Verificar se bridge server está rodando
if ! curl -s http://localhost:3002/health &> /dev/null; then
    echo "⚠️  Bridge server não está rodando na porta 3002"
    echo "   Inicie com: cd pedido-server && npm start"
    exit 1
fi

echo "🚀 Iniciando ngrok na porta 3002..."
echo "   Acesse http://localhost:4040 para ver a URL pública"
echo ""

ngrok http 3002
