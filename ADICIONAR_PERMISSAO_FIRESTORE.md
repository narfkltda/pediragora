# 🔧 Adicionar Permissão Firestore para Cloud Function v2

O erro `PERMISSION_DENIED` acontece porque a Cloud Function não tem permissão para acessar o Firestore.

## ✅ Solução Passo a Passo

### Passo 1: Encontrar a Service Account da Cloud Function

1. **Acesse a função diretamente:**
   - https://console.cloud.google.com/functions/details/us-central1/printorder?project=temperoesabor-57382

2. **Vá para a aba "PERMISSIONS" (Permissões):**
   - No menu lateral da página da função, clique em "PERMISSIONS"

3. **Veja a lista de "Principals" (Principais):**
   - Procure por uma service account que termine com:
     - `@temperoesabor-57382.iam.gserviceaccount.com`
     - Ou `@cloudfunctions.net`
     - Ou `@gcp-sa-cloudfunctions.iam.gserviceaccount.com`

4. **Anote o nome completo da service account** (você precisará dele no próximo passo)

### Passo 2: Adicionar Permissão no IAM

1. **Acesse IAM:**
   - https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382

2. **Procure pela service account** que você anotou no Passo 1

3. **Clique no ícone de editar (lápis)** ao lado da service account

4. **Clique em "ADD ANOTHER ROLE"** (Adicionar outra função)

5. **Selecione a role:**
   - Digite: `Cloud Datastore User`
   - Ou selecione: `roles/datastore.user`
   - Esta role permite leitura e escrita no Firestore

6. **Clique em "SAVE"** (Salvar)

### Passo 3: Alternativa - Se não encontrar a service account

Se você não encontrar a service account na lista de IAM, ela pode estar sendo criada automaticamente. Nesse caso:

1. **Acesse IAM novamente:**
   - https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382

2. **Clique em "GRANT ACCESS"** (Conceder acesso) no topo

3. **No campo "New principals", digite:**
   - `temperoesabor-57382@appspot.gserviceaccount.com`
   - Ou: `printorder@temperoesabor-57382.iam.gserviceaccount.com`

4. **Selecione a role:** `Cloud Datastore User`

5. **Clique em "SAVE"**

### Passo 4: Aguardar e Testar

1. **Aguarde 2-3 minutos** para as permissões serem propagadas
2. **Recarregue a página do pedido** (Ctrl+Shift+R ou Cmd+Shift+R)
3. **Tente imprimir novamente**

## 🔍 Verificar se Funcionou

Após adicionar a permissão, o erro `PERMISSION_DENIED` deve desaparecer.

Se ainda não funcionar, me avise e podemos verificar os logs da função para mais detalhes.
