# 🔓 Configurar Permissão Pública da Cloud Function

O erro de CORS está acontecendo porque a Cloud Function não está configurada como **pública**.

## ⚠️ Problema Atual

A função está retornando `403 Forbidden` porque apenas usuários autenticados podem acessá-la.

## ✅ Solução: Tornar a Função Pública

### Opção 1: Via Google Cloud Console (Recomendado)

1. **Acesse o Google Cloud Console:**
   - https://console.cloud.google.com/functions/list?project=temperoesabor-57382

2. **Encontre a função `printOrder`:**
   - Procure por `printOrder` na lista
   - Clique no nome da função

3. **Vá para a aba "PERMISSIONS" (Permissões):**
   - No menu lateral, clique em "PERMISSIONS"

4. **Adicionar permissão pública:**
   - Clique no botão **"ADD PRINCIPAL"** (Adicionar Principal)
   - No campo **"New principals"**, digite: `allUsers`
   - No campo **"Select a role"**, selecione: **"Cloud Functions Invoker"**
   - Clique em **"SAVE"** (Salvar)

5. **Confirmar:**
   - Uma mensagem de aviso aparecerá perguntando se você tem certeza
   - Clique em **"ALLOW PUBLIC ACCESS"** (Permitir Acesso Público)

### Opção 2: Via Terminal (se gcloud estiver configurado)

```bash
gcloud functions add-invoker-policy-binding printOrder \
  --region=us-central1 \
  --member="allUsers" \
  --gen2
```

## ✅ Verificar se Funcionou

Após configurar, teste novamente:

1. Recarregue a página do pedido (Ctrl+Shift+R)
2. Tente imprimir novamente

O erro de CORS deve desaparecer!

## 📝 Nota

A função agora está pública, o que significa que qualquer pessoa com a URL pode chamá-la. Isso é seguro porque:
- A função ainda valida os dados
- A função chama o bridge server local (que tem API Key)
- O bridge server só funciona se estiver rodando na sua rede local
