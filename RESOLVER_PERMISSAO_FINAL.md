# 🔧 Resolver Permissão Firestore - Passo Final

O erro `PERMISSION_DENIED` ainda persiste mesmo com as permissões adicionadas. Vamos verificar e corrigir:

## ⚠️ Possíveis Causas

1. **Permissões adicionadas para service account errada**
2. **Necessário redeploy após adicionar permissões**
3. **Propagação ainda não concluída**

## ✅ Solução Passo a Passo

### Passo 1: Verificar Service Account da Função

1. **Acesse a função:**
   - https://console.cloud.google.com/functions/details/us-central1/printorder?project=temperoesabor-57382

2. **Vá para a aba "PERMISSIONS"** (Permissões)

3. **Na seção "Principals" (Principais), procure por:**
   - Service accounts que terminam com `@temperoesabor-57382.iam.gserviceaccount.com`
   - Ou `@cloudfunctions.net`
   - **Anote o nome completo da service account**

### Passo 2: Verificar Permissões no IAM

1. **Acesse IAM:**
   - https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382

2. **Procure pela service account** que você anotou no Passo 1

3. **Verifique se ela tem:**
   - ✅ `Cloud Datastore User`
   - ✅ `Firebase Admin SDK Administrator Service Agent` (já tem)

4. **Se NÃO tiver "Cloud Datastore User":**
   - Clique no ícone de editar (lápis)
   - Adicione a role `Cloud Datastore User`
   - Salve

### Passo 3: Redeploy da Função (IMPORTANTE!)

Após adicionar as permissões, é necessário fazer um redeploy:

```bash
cd pediragora
firebase deploy --only functions:printOrder
```

### Passo 4: Aguardar e Testar

1. **Aguarde 2-3 minutos** após o redeploy
2. **Recarregue a página do pedido** (Ctrl+Shift+R)
3. **Tente imprimir novamente**

## 🔍 Se Ainda Não Funcionar

Pode ser que a service account padrão do Cloud Functions v2 seja diferente. Nesse caso:

1. **Verifique os logs da função** para ver qual service account está sendo usada
2. **Ou me envie o nome da service account** que aparece na aba "PERMISSIONS" da função

## 📝 Nota Importante

Para Cloud Functions v2, a service account padrão geralmente é:
- `PROJECT_ID@appspot.gserviceaccount.com`
- Ou uma service account específica criada automaticamente

Certifique-se de que as permissões foram adicionadas para a service account **correta**!
