#!/usr/bin/env node

/**
 * Build Script - Copia arquivos de clients/ para raiz e ajusta caminhos relativos
 * 
 * Este script copia os arquivos de clients/temperoesabor/ para temperoesabor/
 * na raiz do projeto, ajustando os caminhos relativos para funcionar na nova
 * localização (../../assets/ → ../assets/ e ../../core/ → ../core/)
 */

const fs = require('fs');
const path = require('path');

// Configuração
const SOURCE_DIR = path.join(__dirname, 'clients', 'temperoesabor');
const TARGET_DIR = path.join(__dirname, 'temperoesabor');

// Arquivos a copiar
const FILES_TO_COPY = ['index.html', 'script.js', 'styles.css'];

/**
 * Ajusta caminhos relativos no conteúdo do arquivo
 */
function adjustPaths(content) {
    // Ajusta ../../assets/ para ../assets/
    content = content.replace(/\.\.\/\.\.\/assets\//g, '../assets/');
    
    // Ajusta ../../core/ para ../core/
    content = content.replace(/\.\.\/\.\.\/core\//g, '../core/');
    
    return content;
}

/**
 * Copia e processa um arquivo
 */
function copyAndProcessFile(filename) {
    const sourcePath = path.join(SOURCE_DIR, filename);
    const targetPath = path.join(TARGET_DIR, filename);
    
    // Lê o arquivo original
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // Ajusta os caminhos relativos
    content = adjustPaths(content);
    
    // Cria o diretório de destino se não existir
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }
    
    // Escreve o arquivo processado
    fs.writeFileSync(targetPath, content, 'utf8');
    
    console.log(`✓ Processado: ${filename}`);
}

/**
 * Função principal
 */
function main() {
    console.log('🚀 Iniciando build...\n');
    console.log(`📁 Origem: ${SOURCE_DIR}`);
    console.log(`📁 Destino: ${TARGET_DIR}\n`);
    
    // Verifica se o diretório de origem existe
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Erro: Diretório de origem não encontrado: ${SOURCE_DIR}`);
        process.exit(1);
    }
    
    // Processa cada arquivo
    FILES_TO_COPY.forEach(filename => {
        const sourcePath = path.join(SOURCE_DIR, filename);
        if (!fs.existsSync(sourcePath)) {
            console.warn(`⚠️  Aviso: Arquivo não encontrado: ${filename}`);
            return;
        }
        copyAndProcessFile(filename);
    });
    
    console.log('\n✅ Build concluído com sucesso!');
    console.log(`📦 Arquivos gerados em: ${TARGET_DIR}`);
}

// Executa o script
main();

