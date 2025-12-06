# 🔧 Corrigir Permissão do Firestore para Cloud Function

O erro `PERMISSION_DENIED` significa que a Cloud Function não tem permissão para acessar o Firestore.

## ✅ Solução: Adicionar Permissão IAM

### Passo 1: Acessar IAM do Projeto

1. **Acesse:** https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382

2. **Procure pela Service Account da Cloud Function:**
   - Procure por: `temperoesabor-57382@appspot.gserviceaccount.com`
   - Ou: `@cloudfunctions.net` ou `@gcp-sa-cloudfunctions.iam.gserviceaccount.com`
   - Ou procure por contas que contenham "compute" ou "functions"

### Passo 2: Adicionar Role "Cloud Datastore User"

1. **Encontre a service account** (geralmente algo como `temperoesabor-57382@appspot.gserviceaccount.com`)

2. **Clique no ícone de editar (lápis)** ao lado da service account

3. **Clique em "ADD ANOTHER ROLE"** (Adicionar outra função)

4. **Selecione a role:** `Cloud Datastore User`
   - Ou digite: `roles/datastore.user`
   - Esta role permite leitura e escrita no Firestore

5. **Clique em "SAVE"** (Salvar)

### Passo 3: Alternativa - Usar "Firestore User"

Se não encontrar "Cloud Datastore User", use:
- **Role:** `Firestore User` ou `roles/datastore.user`

### Passo 4: Aguardar e Testar

1. **Aguarde 1-2 minutos** para as permissões serem aplicadas
2. **Recarregue a página do pedido** (Ctrl+Shift+R)
3. **Tente imprimir novamente**

## 🔍 Se não encontrar a Service Account

A Cloud Function pode estar usando uma service account diferente. Para verificar:

1. **Acesse a função:** https://console.cloud.google.com/functions/details/us-central1/printorder?project=temperoesabor-57382
2. **Vá para a aba "PERMISSIONS"** (Permissões)
3. **Veja qual service account está listada**
4. **Adicione a role "Cloud Datastore User" para essa service account**

## ✅ Verificar se Funcionou

Após adicionar a permissão, o erro `PERMISSION_DENIED` deve desaparecer e a função deve conseguir acessar o Firestore.
