#!/bin/bash

# Script para preparar deploy das Cloud Functions

echo "🔍 Verificando ambiente..."

# Verificar se está no diretório correto
if [ ! -f "firebase.json" ]; then
    echo "❌ Execute este script da pasta pediragora/"
    exit 1
fi

# Verificar Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado. Instale com: npm install -g firebase-tools"
    exit 1
fi

# Verificar login
echo "🔐 Verificando login no Firebase..."
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Não está logado. Execute: firebase login"
    echo "   Isso abrirá o navegador para autenticação."
    exit 1
fi

# Verificar projeto
echo "📦 Verificando projeto Firebase..."
firebase use temperoesabor-57382

# Verificar dependências
echo "📦 Verificando dependências das Functions..."
cd functions
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
fi
cd ..

echo ""
echo "✅ Ambiente pronto para deploy!"
echo ""
echo "📋 Próximo passo:"
echo "   firebase deploy --only functions"
echo ""
