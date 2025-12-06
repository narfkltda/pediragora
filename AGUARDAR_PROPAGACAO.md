# ⏳ Aguardar Propagação de Permissões

As permissões foram adicionadas corretamente, mas podem levar **5-10 minutos** para serem totalmente propagadas no Google Cloud.

## ✅ O que foi feito:

1. ✅ Permissão "Cloud Datastore User" adicionada para:
   - `firebase-adminsdk-fbsvc@temperoesabor-57382.iam.gserviceaccount.com`

2. ✅ Redeploy da função realizado

## ⏳ Próximos Passos:

### Aguardar 5-10 minutos

As permissões IAM no Google Cloud podem levar alguns minutos para serem propagadas em todos os serviços.

### Depois de aguardar:

1. **Recarregue a página do pedido** (Ctrl+Shift+R ou Cmd+Shift+R)
2. **Tente imprimir novamente**

## 🔍 Se ainda não funcionar após 10 minutos:

Pode ser que a Cloud Function v2 esteja usando uma service account diferente. Nesse caso:

1. **Verifique os logs da função** para ver qual service account está sendo usada
2. **Ou me avise** e podemos verificar outras possíveis causas

## 📝 Nota:

Para Cloud Functions v2, a service account padrão pode variar. Se o erro persistir, podemos tentar:
- Adicionar a permissão para todas as service accounts relacionadas
- Ou verificar se há alguma configuração adicional necessária
