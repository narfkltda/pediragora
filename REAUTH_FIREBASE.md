# Reautenticação Firebase Necessária

## ⚠️ Problema

O Firebase CLI está dizendo que suas credenciais expiraram, mesmo você estando logado.

## ✅ Solução: Reautenticação

Execute no terminal:

```bash
cd pediragora
firebase login --reauth
```

**O que vai acontecer:**
- O comando vai abrir o navegador
- Você verá uma tela pedindo para autorizar novamente
- Clique em "Autorizar" ou "Allow"
- Volte ao terminal

**Se o navegador não abrir automaticamente:**
- O terminal mostrará uma URL
- Copie e cole no navegador
- Complete a autenticação
- Volte ao terminal

## 📋 Após Reautenticação

1. **Verificar login:**
   ```bash
   firebase projects:list
   ```
   Deve mostrar o projeto `temperoesabor-57382`

2. **Selecionar projeto:**
   ```bash
   firebase use temperoesabor-57382
   ```

3. **Fazer deploy:**
   ```bash
   firebase deploy --only functions
   ```

## 🆘 Alternativa: Login com Token CI

Se o login interativo não funcionar:

```bash
firebase login:ci
```

Isso gerará um token que você pode usar, mas o método `--reauth` é mais simples.

---

**Execute `firebase login --reauth` e me avise quando terminar!**
