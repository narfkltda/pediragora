# 🔍 Verificar Service Account da Cloud Function

Mesmo com as permissões adicionadas, o erro persiste. Vamos verificar se as permissões foram adicionadas para a service account **correta**.

## ✅ Passo 1: Verificar Qual Service Account a Função Está Usando

1. **Acesse a função:**
   - https://console.cloud.google.com/functions/details/us-central1/printorder?project=temperoesabor-57382

2. **Vá para a aba "PERMISSIONS"** (Permissões)

3. **Procure na seção "Principals" (Principais):**
   - Veja qual service account está listada
   - Anote o nome completo (ex: `printorder@temperoesabor-57382.iam.gserviceaccount.com`)

## ✅ Passo 2: Verificar se Essa Service Account Tem as Permissões

1. **Acesse IAM:**
   - https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382

2. **Procure pela service account** que você anotou no Passo 1

3. **Verifique se ela tem a role "Cloud Datastore User"**

4. **Se NÃO tiver:**
   - Clique no ícone de editar (lápis)
   - Adicione a role "Cloud Datastore User"
   - Salve

## ✅ Passo 3: Alternativa - Adicionar Permissão Diretamente na Função

Se a service account não aparecer no IAM, você pode adicionar a permissão diretamente na função:

1. **Na aba "PERMISSIONS" da função**, clique em **"ADD PRINCIPAL"** (Adicionar Principal)

2. **No campo "New principals", digite:**
   - `allUsers` (para acesso público - já feito)
   - Ou a service account específica

3. **Selecione a role:** `Cloud Datastore User`

4. **Clique em "SAVE"**

## ✅ Passo 4: Aguardar Propagação

As permissões podem levar alguns minutos para serem aplicadas. Aguarde 2-3 minutos e teste novamente.

## 🔍 Se Ainda Não Funcionar

Pode ser que o problema seja com a inicialização do Firebase Admin. Nesse caso, podemos tentar:

1. Verificar os logs da função para mais detalhes
2. Tentar uma abordagem diferente de inicialização do Firebase Admin

Avise qual service account está listada na aba "PERMISSIONS" da função!
