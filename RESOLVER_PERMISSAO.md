# Resolver Problema de Permissão no Deploy

## ❌ Erro Encontrado

```
Build failed with status: FAILURE. Could not build the function due to a missing permission on the build service account.
```

## 🔧 Soluções

### Solução 1: Habilitar Permissões no Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382

2. **Encontrar a Service Account:**
   - Procure por: `cloudbuild.gserviceaccount.com` ou `@cloudbuild.gserviceaccount.com`
   - Ou procure por: `827430491530-compute@developer.gserviceaccount.com`

3. **Adicionar Permissões:**
   - Clique na service account
   - Clique em "Adicionar outra função"
   - Adicione as seguintes roles:
     - `Cloud Functions Developer`
     - `Service Account User`
     - `Artifact Registry Writer`

4. **Salvar e tentar deploy novamente**

### Solução 2: Usar Cloud Functions v1 (Alternativa)

Se a Solução 1 não funcionar, podemos migrar para v1 temporariamente.

### Solução 3: Verificar Organization Policies

1. **Acesse:** https://console.cloud.google.com/iam-admin/orgpolicies?project=temperoesabor-57382
2. Verifique se há políticas que bloqueiam o build
3. Se necessário, entre em contato com o administrador do projeto

## 📋 Próximos Passos

1. Tente a **Solução 1** primeiro (mais comum)
2. Se não funcionar, me avise e podemos tentar v1
3. Após resolver, execute novamente:
   ```bash
   cd pediragora
   firebase deploy --only functions
   ```

## 🔗 Links Úteis

- Logs do Build: https://console.cloud.google.com/cloud-build/builds?project=827430491530
- IAM: https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382
