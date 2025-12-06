# ✅ Adicionar Permissão para a Service Account Correta

Baseado nas permissões que você mostrou, precisamos adicionar "Cloud Datastore User" para a service account que a função está usando.

## 🎯 Service Account a Configurar

A service account mais provável é:
- `firebase-adminsdk-fbsvc@temperoesabor-57382.iam.gserviceaccount.com`

## ✅ Passo a Passo

### Passo 1: Acessar IAM

1. **Acesse:** https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382

2. **Procure por:** `firebase-adminsdk-fbsvc@temperoesabor-57382.iam.gserviceaccount.com`

### Passo 2: Adicionar Role

1. **Clique no ícone de editar (lápis)** ao lado dessa service account

2. **Clique em "ADD ANOTHER ROLE"** (Adicionar outra função)

3. **Selecione a role:** `Cloud Datastore User`
   - Ou digite: `roles/datastore.user`

4. **Clique em "SAVE"** (Salvar)

### Passo 3: Alternativa - Se não encontrar essa service account

Se não encontrar `firebase-adminsdk-fbsvc@temperoesabor-57382.iam.gserviceaccount.com` no IAM, adicione a permissão para:

- `827430491530-compute@developer.gserviceaccount.com`

Siga os mesmos passos acima.

### Passo 4: Redeploy da Função

Após adicionar a permissão, faça um redeploy:

```bash
cd pediragora
firebase deploy --only functions:printOrder
```

### Passo 5: Aguardar e Testar

1. **Aguarde 2-3 minutos** após o redeploy
2. **Recarregue a página do pedido** (Ctrl+Shift+R)
3. **Tente imprimir novamente**

## 🔍 Verificação

Após adicionar a permissão, verifique se a service account agora tem:
- ✅ Cloud Functions Admin
- ✅ **Cloud Datastore User** (nova)
