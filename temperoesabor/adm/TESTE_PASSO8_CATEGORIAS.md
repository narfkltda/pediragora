# Guia de Teste - Passo 8: Módulo de Categorias

## Objetivo

Validar que todas as funcionalidades de categorias (ingredientes e produtos) continuam funcionando após a extração para `modules/categories.js`.

---

## Pré-requisitos

1. Ter o projeto rodando localmente
2. Estar logado no admin panel
3. Ter acesso ao console do navegador (F12)

---

## ✅ TESTE 1: Verificar Estrutura do Módulo

### 1.1: Verificar arquivo criado

1. Abra o terminal na pasta do projeto
2. Execute:
```bash
ls -la pediragora/temperoesabor/adm/modules/categories.js
```

**Resultado esperado:**
- Arquivo `categories.js` deve existir
- Arquivo deve ter aproximadamente 780 linhas

### 1.2: Verificar imports no admin.js

1. Abra `admin.js`
2. Procure por: `import { initCategories, loadCategories, ... } from './modules/categories.js'`
3. **Verificar:** Imports devem estar presentes

**O que está sendo testado:**
- Módulo foi criado corretamente
- Imports estão configurados

---

## ✅ TESTE 2: Categorias de Ingredientes - Carregamento

### 2.1: Carregar categorias ao iniciar

1. Acesse o admin panel
2. Vá para a seção "Ingredientes"
3. Abra o console do navegador (F12)
4. Digite: `state.categories`
5. **Verificar:** Deve retornar array com categorias de ingredientes

### 2.2: Verificar categoria padrão "Geral"

1. No console, digite: `state.categories.find(c => c.name.toLowerCase() === 'geral')`
2. **Verificar:** Deve retornar a categoria "Geral" (ou criar automaticamente)

### 2.3: Verificar seletor de categoria no formulário

1. Vá para "Ingredientes"
2. Clique em "Adicionar Ingrediente"
3. **Verificar:** 
   - Campo "Categoria" deve ter opções
   - Categoria "Geral" deve estar selecionada por padrão
   - Categorias devem estar ordenadas alfabeticamente

**O que está sendo testado:**
- Função `loadCategories()` do módulo
- Função `updateCategorySelector()` do módulo
- Criação automática de categoria padrão

---

## ✅ TESTE 3: Categorias de Ingredientes - CRUD

### 3.1: Abrir modal de gerenciamento

1. Vá para "Ingredientes"
2. Clique em "Gerenciar Categorias"
3. **Verificar:** 
   - Modal deve abrir como sidebar
   - Lista de categorias deve aparecer
   - Categorias devem estar ordenadas alfabeticamente

### 3.2: Adicionar nova categoria

1. Na modal de categorias, preencha o campo "Nome"
2. Digite: "Teste Categoria"
3. Clique em "Salvar"
4. **Verificar:** 
   - Toast de sucesso deve aparecer
   - Categoria deve aparecer na lista
   - Seletor de categoria no formulário deve ser atualizado

### 3.3: Editar categoria

1. Na lista de categorias, clique em "✏️ Editar" em uma categoria
2. **Verificar:** 
   - Formulário deve ser preenchido com nome da categoria
   - Título deve mudar para "Editar Categoria"
   - Botão "Cancelar" deve aparecer
3. Altere o nome
4. Clique em "Salvar"
5. **Verificar:** 
   - Toast de sucesso
   - Nome atualizado na lista
   - Seletor atualizado

### 3.4: Excluir categoria (sem uso)

1. Crie uma categoria de teste
2. Certifique-se de que nenhum ingrediente está usando ela
3. Clique em "🗑️ Excluir"
4. **Verificar:** 
   - Modal de confirmação deve aparecer
   - Clique em "Confirmar"
   - Toast de sucesso
   - Categoria deve ser removida da lista

### 3.5: Tentar excluir categoria em uso

1. Tente excluir a categoria "Geral" (ou qualquer categoria que tenha ingredientes)
2. **Verificar:** 
   - Toast de erro deve aparecer
   - Mensagem: "Não é possível excluir categoria que está sendo usada por ingredientes"
   - Categoria NÃO deve ser excluída

**O que está sendo testado:**
- Funções `setupCategoriesModal()`, `loadCategoriesList()`, `saveCategory()`
- Funções `editCategory()`, `deleteCategoryConfirm()` (window)
- Validação de exclusão com `hasIngredientsUsingCategory()`

---

## ✅ TESTE 4: Categorias de Ingredientes - Seletores

### 4.1: Seletor no formulário de adicionar

1. Vá para "Ingredientes" → "Adicionar Ingrediente"
2. **Verificar:** 
   - Campo "Categoria" deve ter todas as categorias
   - Categorias ordenadas alfabeticamente
   - Categoria padrão selecionada

### 4.2: Seletor no formulário de editar

1. Edite um ingrediente existente
2. **Verificar:** 
   - Campo "Categoria" deve ter todas as categorias
   - Categoria atual do ingrediente deve estar selecionada

### 4.3: Seletor no filtro

1. Vá para "Ingredientes"
2. Procure pelo filtro "Categoria"
3. **Verificar:** 
   - Deve ter opção "Todas as Categorias"
   - Deve listar todas as categorias
   - Filtro deve funcionar ao selecionar uma categoria

**O que está sendo testado:**
- Funções `updateCategorySelector()`, `updateCategoryEditSelector()`, `updateCategoryFilterSelector()`
- Sincronização entre módulos

---

## ✅ TESTE 5: Categorias de Produtos - Carregamento

### 5.1: Carregar categorias de produtos

1. Acesse o admin panel
2. Vá para a seção "Produtos"
3. Abra o console (F12)
4. Digite: `state.productCategories`
5. **Verificar:** Deve retornar array com categorias de produtos

### 5.2: Verificar migração de categorias padrão

1. No console, verifique se existem categorias padrão:
   - "Burguers"
   - "Hot-Dogs"
   - "Porções"
   - "Bebidas"
2. **Verificar:** Categorias padrão devem existir (criadas automaticamente na primeira vez)

### 5.3: Verificar seletor no formulário de produtos

1. Vá para "Produtos"
2. Clique em "Adicionar Produto"
3. **Verificar:** 
   - Campo "Categoria" deve ter opções
   - Categorias devem estar ordenadas alfabeticamente
   - Opção padrão: "Selecione uma categoria"

**O que está sendo testado:**
- Função `loadProductCategories()` do módulo
- Função `migrateDefaultProductCategories()`
- Função `updateProductCategorySelector()`

---

## ✅ TESTE 6: Categorias de Produtos - CRUD

### 6.1: Abrir modal de gerenciamento

1. Vá para "Produtos"
2. Clique em "Gerenciar Categorias"
3. **Verificar:** 
   - Modal deve abrir
   - Lista de categorias de produtos deve aparecer

### 6.2: Adicionar nova categoria

1. Na modal, preencha "Nome da Categoria"
2. Digite: "Teste Produto"
3. Clique em "Salvar"
4. **Verificar:** 
   - Toast de sucesso
   - Categoria aparece na lista
   - Seletor no formulário de produtos atualizado
   - Filtro de categorias atualizado

### 6.3: Editar categoria

1. Clique em "✏️ Editar" em uma categoria
2. Altere o nome
3. Salve
4. **Verificar:** 
   - Nome atualizado
   - Seletor e filtro atualizados

### 6.4: Excluir categoria (sem uso)

1. Crie uma categoria de teste
2. Certifique-se de que nenhum produto está usando ela
3. Clique em "🗑️ Excluir"
4. Confirme
5. **Verificar:** 
   - Categoria removida
   - Seletor e filtro atualizados

### 6.5: Tentar excluir categoria em uso

1. Tente excluir uma categoria que tenha produtos
2. **Verificar:** 
   - Toast de erro
   - Mensagem: "Não é possível excluir categoria que está sendo usada por produtos"
   - Categoria NÃO excluída

**O que está sendo testado:**
- Funções `setupProductCategoriesModal()`, `loadProductCategoriesList()`, `saveProductCategory()`
- Funções `editProductCategory()`, `deleteProductCategoryConfirm()` (window)
- Função `hasProductsUsingCategory()`

---

## ✅ TESTE 7: Sincronização entre Módulos

### 7.1: Adicionar categoria e verificar em ingredientes

1. Vá para "Ingredientes" → "Gerenciar Categorias"
2. Adicione uma nova categoria: "Nova Categoria Teste"
3. Vá para "Adicionar Ingrediente"
4. **Verificar:** Nova categoria deve aparecer no seletor

### 7.2: Adicionar categoria de produto e verificar em produtos

1. Vá para "Produtos" → "Gerenciar Categorias"
2. Adicione uma nova categoria: "Nova Categoria Produto"
3. Vá para "Adicionar Produto"
4. **Verificar:** Nova categoria deve aparecer no seletor

### 7.3: Verificar estado global

1. No console, digite: `state.categories.length`
2. Adicione uma categoria de ingrediente
3. Digite novamente: `state.categories.length`
4. **Verificar:** Número deve aumentar

5. Digite: `state.productCategories.length`
6. Adicione uma categoria de produto
7. Digite novamente: `state.productCategories.length`
8. **Verificar:** Número deve aumentar

**O que está sendo testado:**
- Compartilhamento de estado via `state` global
- Callbacks de atualização (`onCategoriesUpdated`, `onProductCategoriesUpdated`)

---

## ✅ TESTE 8: Validações e Mensagens de Erro

### 8.1: Validação de nome obrigatório

1. Tente salvar categoria sem nome
2. **Verificar:** 
   - Mensagem de validação deve aparecer
   - "Por favor, informe o nome da categoria." (se houver validação HTML5)
   - Ou toast: "Nome da categoria é obrigatório"

### 8.2: Validação de permissões (se aplicável)

1. Se houver erro de permissões do Firestore
2. **Verificar:** 
   - Toast de erro deve aparecer
   - Mensagem deve mencionar FIRESTORE_RULES.md
   - Console deve mostrar instruções detalhadas

### 8.3: Mensagens de sucesso

1. Ao salvar categoria com sucesso
2. **Verificar:** Toast verde com mensagem apropriada:
   - "Categoria adicionada com sucesso!" (ao adicionar)
   - "Categoria atualizada com sucesso!" (ao editar)
   - "Categoria excluída com sucesso!" (ao excluir)

**O que está sendo testado:**
- Validações de formulário
- Tratamento de erros
- Mensagens de feedback

---

## ✅ TESTE 9: Filtro de Categorias em Produtos

### 9.1: Filtrar produtos por categoria

1. Vá para "Produtos"
2. Use o filtro "Categoria" no topo
3. Selecione uma categoria (ex: "Burguers")
4. **Verificar:** 
   - Apenas produtos dessa categoria devem aparecer
   - Contador deve atualizar

### 9.2: Limpar filtro

1. Com filtro ativo, selecione "Todas as Categorias"
2. **Verificar:** Todos os produtos devem aparecer novamente

**O que está sendo testado:**
- Função `populateCategoryFilter()` (ainda no admin.js, mas usa `state.productCategories`)
- Função `filterByCategory()` (ainda no admin.js)

---

## ✅ TESTE 10: Renderização de Ingredientes por Categoria

### 10.1: Verificar agrupamento

1. Vá para "Ingredientes"
2. **Verificar:** 
   - Ingredientes devem estar agrupados por categoria
   - Cada categoria deve ter um título
   - Ingredientes sem categoria devem aparecer em "Sem categoria"

### 10.2: Verificar ordenação

1. **Verificar:** 
   - Categorias devem estar ordenadas alfabeticamente
   - Ingredientes dentro de cada categoria devem estar ordenados alfabeticamente

**O que está sendo testado:**
- Função `renderCategorySection()` (ainda no admin.js, mas usa `state.categories`)

---

## Checklist de Validação Completa

### Estrutura
- [ ] Arquivo `modules/categories.js` existe
- [ ] Imports estão corretos no `admin.js`
- [ ] Módulo tem aproximadamente 780 linhas

### Categorias de Ingredientes
- [ ] Carregamento funciona
- [ ] Categoria padrão "Geral" é criada automaticamente
- [ ] Seletor no formulário funciona
- [ ] Seletor na edição funciona
- [ ] Seletor no filtro funciona
- [ ] Adicionar categoria funciona
- [ ] Editar categoria funciona
- [ ] Excluir categoria funciona (sem uso)
- [ ] Não permite excluir categoria em uso

### Categorias de Produtos
- [ ] Carregamento funciona
- [ ] Migração de categorias padrão funciona
- [ ] Seletor no formulário funciona
- [ ] Filtro de categorias funciona
- [ ] Adicionar categoria funciona
- [ ] Editar categoria funciona
- [ ] Excluir categoria funciona (sem uso)
- [ ] Não permite excluir categoria em uso

### Sincronização
- [ ] Estado global (`state.categories`) funciona
- [ ] Estado global (`state.productCategories`) funciona
- [ ] Callbacks de atualização funcionam
- [ ] Seletores são atualizados automaticamente

### Validações
- [ ] Validação de nome obrigatório funciona
- [ ] Mensagens de erro aparecem corretamente
- [ ] Mensagens de sucesso aparecem corretamente

### Funcionalidades Relacionadas
- [ ] Filtro de categorias em produtos funciona
- [ ] Renderização de ingredientes por categoria funciona
- [ ] Ordenação funciona corretamente

---

## Problemas Comuns e Soluções

### Erro: "Cannot read property 'categories' of undefined"
- **Causa:** `state` não está sendo exportado corretamente
- **Solução:** Verificar se `export const state = {...}` está no `admin.js`

### Erro: "initCategories is not a function"
- **Causa:** Import incorreto ou módulo não carregado
- **Solução:** Verificar imports no `admin.js`

### Categorias não aparecem nos seletores
- **Causa:** Funções de atualização não estão sendo chamadas
- **Solução:** Verificar se callbacks estão configurados em `initCategories()`

### Modal não abre
- **Causa:** Elementos DOM não encontrados
- **Solução:** Verificar se IDs dos elementos estão corretos no HTML

### Erro de referência circular
- **Causa:** Módulo importa `state` do admin.js que importa o módulo
- **Solução:** Se houver problemas, mover `state` para arquivo separado (`state.js`)

---

## Testes Rápidos (5 minutos)

1. **Abrir modal de categorias de ingredientes**
   - Ingredientes → Gerenciar Categorias → Deve abrir

2. **Adicionar categoria**
   - Preencher nome → Salvar → Deve aparecer toast de sucesso

3. **Verificar seletor**
   - Adicionar Ingrediente → Campo Categoria deve ter a nova categoria

4. **Abrir modal de categorias de produtos**
   - Produtos → Gerenciar Categorias → Deve abrir

5. **Verificar estado no console**
   - `state.categories` e `state.productCategories` devem retornar arrays

---

## Próximos Passos

Após validar o Passo 8, podemos prosseguir com:
- Passo 9: Módulo de Ingredientes
- Passo 10: Módulo de Produtos
- Passo 11: Limpeza final do `admin.js`

---

## Notas Técnicas

- O módulo importa `state` do `admin.js` (referência circular potencial)
- Funções `populateCategoryFilter()` e `filterByCategory()` permanecem no `admin.js` (dependem de `allProducts`)
- Função `renderCategorySection()` permanece no `admin.js` (parte da renderização de ingredientes)
- Funções `window.editCategory` e `window.deleteCategoryConfirm` são exportadas globalmente pelo módulo

