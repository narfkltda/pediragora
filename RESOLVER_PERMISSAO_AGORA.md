# Resolver Permissão - PASSO A PASSO

## ❌ Problema

O deploy falhou porque a service account do Cloud Build não tem permissões suficientes.

## ✅ Solução Rápida (Via Console Web)

### Passo 1: Acessar IAM

1. **Acesse:** https://console.cloud.google.com/iam-admin/iam?project=temperoesabor-57382

2. **Procurar Service Account:**
   - Na lista de "Principals", procure por uma das seguintes:
     - `827430491530-compute@developer.gserviceaccount.com`
     - Ou qualquer conta que contenha `@cloudbuild.gserviceaccount.com`
     - Ou `@cloudbuild.iam.gserviceaccount.com`

### Passo 2: Adicionar Permissões

1. **Clique na service account** encontrada

2. **Clique em "EDITAR" ou "GRANT ACCESS"**

3. **Adicione as seguintes Roles (permissões):**
   - `Cloud Functions Developer` (roles/cloudfunctions.developer)
   - `Service Account User` (roles/iam.serviceAccountUser)
   - `Artifact Registry Writer` (roles/artifactregistry.writer)
   - `Cloud Build Service Account` (roles/cloudbuild.builds.builder)

4. **Clique em "SALVAR"**

### Passo 3: Tentar Deploy Novamente

Após adicionar as permissões, execute:

```bash
cd pediragora
firebase deploy --only functions
```

## 🔧 Solução Alternativa (Via Terminal - Se tiver gcloud)

Se você tiver o Google Cloud SDK instalado:

```bash
# Obter project number
PROJECT_NUMBER=$(gcloud projects describe temperoesabor-57382 --format="value(projectNumber)")

# Adicionar permissão
gcloud projects add-iam-policy-binding temperoesabor-57382 \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.builder"
```

## 📋 Checklist

- [ ] Acessei o IAM Console
- [ ] Encontrei a service account do Cloud Build
- [ ] Adicionei as permissões necessárias
- [ ] Tentei deploy novamente

## 🆘 Se Não Encontrar a Service Account

1. **Criar nova Service Account:**
   - Acesse: https://console.cloud.google.com/iam-admin/serviceaccounts?project=temperoesabor-57382
   - Clique em "CREATE SERVICE ACCOUNT"
   - Nome: `cloud-build-service`
   - Adicione as roles listadas acima

2. **Ou usar a default:**
   - Procure por: `temperoesabor-57382@appspot.gserviceaccount.com`

---

**Execute o Passo 1 e 2, depois me avise quando terminar para tentarmos o deploy novamente!**
