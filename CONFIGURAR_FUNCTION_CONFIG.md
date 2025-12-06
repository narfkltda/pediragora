# Configurar functionConfig no Firestore

## ✅ URL da Cloud Function:
```
https://printorder-xyaibsfnra-uc.a.run.app
```

## 📋 Passo a Passo:

1. **Acesse:** https://console.firebase.google.com/project/temperoesabor-57382/firestore/data

2. **Criar coleção `functionConfig`:**
   - Clique em "Adicionar coleção"
   - **ID da coleção:** `functionConfig`
   - Clique em "Próximo"

3. **Criar documento `default`:**
   - **ID do documento:** `default`
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

## ✅ Próximo Passo:

Após configurar, configure a impressora no Admin Panel:
- Acesse: `http://localhost:8080/pediragora/temperoesabor/adm/index.html`
- Vá em "Configurações" → "Configuração de Impressora"
- Preencha IP, Máscara e Gateway
- Salvar
