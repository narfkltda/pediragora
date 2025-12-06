# Corrigir URL da Cloud Function no Firestore

## ❌ Problema

O frontend está tentando usar a URL do emulador local:
```
http://localhost:5001/temperoesabor-57382/us-central1/printOrder
```

Mas deveria usar a URL de produção:
```
https://printorder-xyaibsfnra-uc.a.run.app
```

## ✅ Solução

### Opção 1: Editar functionConfig existente

1. **Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

2. **Encontrar o documento:**
   - Coleção: `functionConfig`
   - Documento: `default`

3. **Editar o campo `url`:**
   - Clique no campo `url`
   - Altere o valor para: `https://printorder-xyaibsfnra-uc.a.run.app`
   - Salve

### Opção 2: Criar functionConfig (se não existir)

1. **Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

2. **Criar coleção `functionConfig`:**
   - Clique em "Adicionar coleção"
   - ID da coleção: `functionConfig`
   - Clique em "Próximo"

3. **Criar documento `default`:**
   - ID do documento: `default`
   - Adicione os campos:

   **Campo 1:**
   - Campo: `url`
   - Tipo: `string`
   - Valor: `https://printorder-xyaibsfnra-uc.a.run.app`

   **Campo 2:**
   - Campo: `enabled`
   - Tipo: `boolean`
   - Valor: `true`

4. **Clique em "Salvar"**

## ✅ Após Configurar

1. **Recarregue a página** do pedido (Ctrl+Shift+R ou Cmd+Shift+R)
2. **Tente imprimir novamente**
3. Agora deve usar a URL de produção correta

## 🔍 Verificar

No console do navegador, você deve ver:
```
📡 Usando Cloud Function: https://printorder-xyaibsfnra-uc.a.run.app
```

Em vez de:
```
📡 Usando Cloud Function: http://localhost:5001/...
```
