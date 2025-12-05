# Guia de Teste - Refatoração Admin Panel (Passos 1-7)

## Pré-requisitos

1. Ter o projeto rodando localmente
2. Ter acesso ao admin panel (login funcionando)
3. Ter dados de teste (produtos, ingredientes, categorias)

---

## PASSO 1: Verificar Estrutura de Diretórios

### ✅ Teste 1.1: Verificar pastas criadas

1. Abra o terminal na pasta do projeto
2. Execute:
```bash
ls -la pediragora/temperoesabor/adm/modules/
ls -la pediragora/temperoesabor/adm/utils/
```

**Resultado esperado:**
- `modules/` deve conter: `products.js`, `ingredients.js`, `categories.js`, `config.js`
- `utils/` deve conter: `modals.js`, `forms.js`, `ui.js`, `image-upload.js`

---

## PASSO 2: Testar Utilitários de Modal

### ✅ Teste 2.1: Abrir/Fechar Modal de Produtos

1. Acesse o admin panel
2. Clique em "Adicionar Produto"
3. **Verificar:** Modal deve abrir como sidebar (estilo carrinho)
4. Clique no overlay ou no botão fechar
5. **Verificar:** Modal deve fechar e scroll deve ser restaurado

### ✅ Teste 2.2: Abrir/Fechar Modal de Ingredientes

1. Vá para a seção "Ingredientes"
2. Clique em "Adicionar Ingrediente"
3. **Verificar:** Modal deve abrir corretamente
4. Feche o modal
5. **Verificar:** Scroll deve ser restaurado

### ✅ Teste 2.3: Abrir/Fechar Modal de Categorias

1. Vá para a seção "Ingredientes"
2. Clique em "Gerenciar Categorias"
3. **Verificar:** Modal deve abrir corretamente
4. Feche o modal
5. **Verificar:** Scroll deve ser restaurado

**O que está sendo testado:**
- Funções `openModal()` e `closeModal()` do `utils/modals.js`
- Bloqueio/restauração de scroll do body

---

## PASSO 3: Testar Utilitários de UI

### ✅ Teste 3.1: Toast de Sucesso

1. Acesse "Configurações"
2. Altere o nome do restaurante
3. Clique em "Salvar"
4. **Verificar:** Deve aparecer toast verde com mensagem "Configurações salvas com sucesso!"

### ✅ Teste 3.2: Toast de Erro

1. Tente excluir um produto que está em uso
2. **Verificar:** Deve aparecer toast vermelho com mensagem de erro

### ✅ Teste 3.3: Modal de Confirmação

1. Vá para "Produtos"
2. Clique em "Excluir" em um produto
3. **Verificar:** Deve abrir modal de confirmação
4. Clique em "Confirmar"
5. **Verificar:** Produto deve ser excluído e toast de sucesso deve aparecer

### ✅ Teste 3.4: Modal de Confirmação - Cancelar

1. Tente excluir um produto
2. Na modal de confirmação, clique em "Cancelar"
3. **Verificar:** Modal deve fechar e produto NÃO deve ser excluído

### ✅ Teste 3.5: Modal de Feedback (Ingredientes em Lote)

1. Vá para "Ingredientes"
2. Clique em "Adicionar Ingrediente"
3. Vá para a aba "Criar em Lote"
4. Preencha alguns ingredientes e clique em "Criar Ingredientes"
5. **Verificar:** Deve abrir modal de feedback mostrando:
   - Ingredientes criados
   - Duplicatas removidas (se houver)
   - Já existentes (se houver)
   - Erros (se houver)

**O que está sendo testado:**
- Funções `showToast()`, `showConfirmModal()`, `showFeedbackModal()` do `utils/ui.js`
- Função `escapeHtml()` para prevenir XSS

---

## PASSO 4: Testar Utilitários de Formulários

### ✅ Teste 4.1: Validação de Produto - Nome Obrigatório

1. Vá para "Produtos"
2. Clique em "Adicionar Produto"
3. Deixe o campo "Nome" vazio
4. Tente salvar
5. **Verificar:** Deve aparecer mensagem "Por favor, informe o nome do produto."

### ✅ Teste 4.2: Validação de Produto - Preço Obrigatório

1. Preencha o nome do produto
2. Deixe o campo "Preço" vazio
3. Tente salvar
4. **Verificar:** Deve aparecer mensagem "Por favor, informe o preço do produto."

### ✅ Teste 4.3: Validação de Produto - Categoria Obrigatória

1. Preencha nome e preço
2. Deixe a categoria sem selecionar
3. Tente salvar
4. **Verificar:** Deve aparecer mensagem "Por favor, selecione uma categoria."

### ✅ Teste 4.4: Validação de Ingrediente

1. Vá para "Ingredientes"
2. Clique em "Adicionar Ingrediente"
3. Tente salvar sem preencher campos obrigatórios
4. **Verificar:** Mensagens de validação devem aparecer em português

### ✅ Teste 4.5: Validação de Configurações

1. Vá para "Configurações"
2. Deixe o campo "Nome do Restaurante" vazio
3. Tente salvar
4. **Verificar:** Deve aparecer mensagem "Por favor, informe o nome do restaurante."

**O que está sendo testado:**
- Função `setupFormValidationMessages()` do `utils/forms.js`
- Mensagens de validação em português para todos os formulários

---

## PASSO 5: Testar Utilitários de Upload de Imagem

### ✅ Teste 5.1: Selecionar Imagem via Input

1. Vá para "Produtos"
2. Clique em "Adicionar Produto"
3. Clique na área de upload de imagem
4. Selecione uma imagem
5. **Verificar:** 
   - Preview da imagem deve aparecer
   - Placeholder deve desaparecer
   - Container de preview deve aparecer

### ✅ Teste 5.2: Drag and Drop de Imagem

1. Abra a modal de adicionar produto
2. Arraste uma imagem para a área de upload
3. **Verificar:** 
   - Imagem deve ser aceita
   - Preview deve aparecer
   - Área deve ter feedback visual (drag-over)

### ✅ Teste 5.3: Remover Imagem

1. Com uma imagem selecionada no preview
2. Clique no botão "Remover Imagem" (X)
3. **Verificar:** 
   - Preview deve desaparecer
   - Placeholder deve voltar
   - Input de arquivo deve ser limpo

### ✅ Teste 5.4: Editar Produto com Imagem Existente

1. Vá para "Produtos"
2. Edite um produto que já tem imagem
3. **Verificar:** 
   - Imagem existente deve aparecer no preview
   - URL da imagem deve estar preenchida

### ✅ Teste 5.5: Trocar Imagem em Edição

1. Edite um produto com imagem
2. Selecione uma nova imagem
3. **Verificar:** 
   - Nova imagem deve substituir a antiga no preview
   - Ao salvar, nova imagem deve ser enviada

**O que está sendo testado:**
- Funções `showImagePreview()`, `resetImagePreview()`, `handleImageSelection()`, `loadExistingImagePreview()` do `utils/image-upload.js`
- Gerenciamento de estado `currentImageFile`

---

## PASSO 6: Testar Estado Global

### ✅ Teste 6.1: Carregar Produtos

1. Abra o console do navegador (F12)
2. Vá para "Produtos"
3. No console, digite: `state.products`
4. **Verificar:** Deve retornar array com todos os produtos

### ✅ Teste 6.2: Carregar Ingredientes

1. Vá para "Ingredientes"
2. No console, digite: `state.ingredients`
3. **Verificar:** Deve retornar array com todos os ingredientes

### ✅ Teste 6.3: Carregar Categorias

1. Vá para qualquer seção
2. No console, digite: `state.categories`
3. **Verificar:** Deve retornar array com todas as categorias de ingredientes

### ✅ Teste 6.4: Carregar Categorias de Produtos

1. No console, digite: `state.productCategories`
2. **Verificar:** Deve retornar array com todas as categorias de produtos

### ✅ Teste 6.5: Sincronização entre Módulos

1. Adicione um novo produto
2. No console, verifique: `state.products.length`
3. **Verificar:** Número deve aumentar
4. Adicione um novo ingrediente
5. Verifique: `state.ingredients.length`
6. **Verificar:** Número deve aumentar

**O que está sendo testado:**
- Objeto `state` exportado do `admin.js`
- Compartilhamento de estado entre módulos
- Sincronização de dados

---

## PASSO 7: Testar Módulo de Configurações

### ✅ Teste 7.1: Carregar Configurações

1. Acesse o admin panel
2. Vá para a seção "Configurações"
3. **Verificar:** 
   - Campos devem estar preenchidos com valores salvos
   - Nome do restaurante
   - WhatsApp
   - Latitude/Longitude (se houver)

### ✅ Teste 7.2: Salvar Configurações

1. Altere o nome do restaurante
2. Clique em "Salvar"
3. **Verificar:** 
   - Toast de sucesso deve aparecer
   - Dados devem ser salvos no Firebase
4. Recarregue a página
5. **Verificar:** Dados salvos devem persistir

### ✅ Teste 7.3: Validação de Configurações

1. Deixe o campo "Nome do Restaurante" vazio
2. Tente salvar
3. **Verificar:** Mensagem de validação deve aparecer

### ✅ Teste 7.4: Atualizar WhatsApp

1. Altere o número do WhatsApp
2. Salve
3. **Verificar:** 
   - Toast de sucesso
   - Valor deve ser salvo
4. Recarregue a página
5. **Verificar:** Novo valor deve aparecer

### ✅ Teste 7.5: Atualizar Coordenadas

1. Altere latitude e longitude
2. Salve
3. **Verificar:** Valores devem ser salvos corretamente

**O que está sendo testado:**
- Módulo `modules/config.js`
- Funções `initConfig()`, `loadConfig()`, `saveConfig()`
- Integração com Firebase

---

## Checklist de Validação Completa

### Estrutura
- [ ] Pastas `modules/` e `utils/` criadas
- [ ] Todos os arquivos de módulos existem
- [ ] Todos os arquivos de utils existem

### Modals
- [ ] Modals abrem corretamente
- [ ] Modals fecham corretamente
- [ ] Scroll é bloqueado/restaurado corretamente

### UI
- [ ] Toasts aparecem (sucesso, erro, info)
- [ ] Modal de confirmação funciona
- [ ] Modal de feedback funciona
- [ ] Escape HTML funciona (sem XSS)

### Formulários
- [ ] Validação de produtos funciona
- [ ] Validação de ingredientes funciona
- [ ] Validação de categorias funciona
- [ ] Validação de configurações funciona
- [ ] Mensagens em português

### Upload de Imagem
- [ ] Seleção via input funciona
- [ ] Drag and drop funciona
- [ ] Preview aparece corretamente
- [ ] Remoção de imagem funciona
- [ ] Edição com imagem existente funciona

### Estado Global
- [ ] `state.products` acessível
- [ ] `state.ingredients` acessível
- [ ] `state.categories` acessível
- [ ] `state.productCategories` acessível
- [ ] Estado sincroniza entre módulos

### Configurações
- [ ] Carregamento funciona
- [ ] Salvamento funciona
- [ ] Validação funciona
- [ ] Persistência funciona

---

## Problemas Comuns e Soluções

### Erro: "Cannot read property of undefined"
- **Causa:** Estado não foi inicializado
- **Solução:** Verificar se `state` está sendo exportado corretamente

### Erro: "Function is not defined"
- **Causa:** Import não foi feito corretamente
- **Solução:** Verificar imports no `admin.js`

### Modal não abre
- **Causa:** Elementos DOM não encontrados
- **Solução:** Verificar se IDs dos elementos estão corretos

### Toast não aparece
- **Causa:** Elemento `#toast` não existe no HTML
- **Solução:** Verificar se elemento existe no `index.html`

### Imagem não carrega no preview
- **Causa:** Elementos DOM não passados corretamente
- **Solução:** Verificar chamadas de funções de imagem

---

## Próximos Passos

Após validar os passos 1-7, podemos prosseguir com:
- Passo 8: Módulo de Categorias (refinamento)
- Passo 9: Módulo de Ingredientes
- Passo 10: Módulo de Produtos
- Passo 11: Limpeza final do `admin.js`

