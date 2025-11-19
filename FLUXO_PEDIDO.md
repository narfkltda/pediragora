# 📋 Fluxo Completo do Pedido

Este documento descreve o fluxo completo do processo de pedido, desde a visualização do cardápio até o envio para o WhatsApp.

---

## 🔄 Visão Geral do Fluxo

```
┌─────────────────┐
│  Visualizar     │
│   Cardápio      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Adicionar      │
│  Item ao        │
│  Carrinho       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gerenciar      │
│  Carrinho       │
│  (localStorage) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Abrir          │
│  Checkout       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Etapa 1:       │
│  Revisão        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Etapa 2:       │
│  Entrega        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Etapa 3:       │
│  Dados &        │
│  Pagamento      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validar        │
│  Dados          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Formatar       │
│  Mensagem       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Enviar para    │
│  WhatsApp       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Limpar         │
│  Dados          │
└─────────────────┘
```

---

## 📦 1. Adicionar Item ao Carrinho

### Processo:
1. **Cliente visualiza o cardápio** com produtos organizados por categoria
2. **Clica no botão "Adicionar"** de um produto
3. **Sistema executa:**
   ```javascript
   handleAddToCart(itemId)
   ├── Busca item no MENU_DATA pelo ID
   ├── Chama addItem(item) do módulo cart.js
   │   ├── Verifica se item já existe no carrinho
   │   ├── Se existe: incrementa quantidade
   │   └── Se não existe: adiciona com quantidade 1
   ├── Salva carrinho no localStorage
   └── Atualiza UI (contador, total, sidebar)
   ```

### Armazenamento:
- **localStorage key:** `pediragora_cart`
- **Formato:** Array JSON com objetos `{id, name, price, quantity, image, ...}`

---

## 🛒 2. Gerenciar Carrinho

### Funcionalidades Disponíveis:

#### Visualizar Carrinho
- **Abrir:** Clique no ícone do carrinho no header
- **Sidebar deslizante** da direita para esquerda
- **Exibe:** Lista de itens, quantidades, preços, total

#### Modificar Quantidades
- **Aumentar:** Botão `+` → `increaseItemQuantity(id)`
- **Diminuir:** Botão `-` → `decreaseItemQuantity(id)`
- **Remover:** Botão "Remover" → `removeItem(id)`

#### Persistência
- **Salvamento automático** após cada alteração
- **Restauração** ao recarregar a página
- **Dados mantidos** mesmo fechando o navegador

---

## 🚀 3. Iniciar Checkout

### Processo:
1. **Cliente clica em "Finalizar Pedido"** no carrinho
2. **Sistema valida:**
   - Carrinho não está vazio
   - Há itens adicionados
3. **Abre modal de checkout** em 4 etapas

---

## 📝 4. Etapa 1: Revisão do Carrinho

### Conteúdo:
- ✅ Lista completa de itens do pedido
- ✅ Quantidade de cada item
- ✅ Preço unitário e total por item
- ✅ **Total geral do pedido** (inclui taxa de entrega se aplicável)

### Ações:
- Cliente pode revisar todos os itens
- Pode voltar para adicionar/remover itens
- Botão **"Continuar"** para próxima etapa

---

## 🚚 5. Etapa 2: Forma de Entrega

### Opções Disponíveis:

#### A) Retirar no Local
- Cliente retira o pedido no restaurante
- Sistema adiciona link do Google Maps com coordenadas
- Coordenadas vêm de `CONFIG.restaurantLatitude` e `CONFIG.restaurantLongitude`
- **Sem taxa adicional**

#### B) Entrega
- **Campos obrigatórios:**
  - Endereço completo
- **Campos opcionais:**
  - Complemento (número, apto, referência)
- **Taxa de entrega:** R$ 3,00 (adicionada automaticamente ao total)
- Taxa exibida abaixo do campo complemento quando "Entrega" está selecionada

### Validação:
- Se "Entrega" selecionado → Endereço é obrigatório
- Taxa de R$ 3,00 é adicionada automaticamente ao total
- Dados salvos em localStorage:
  - `pediragora_delivery_method`
  - `pediragora_delivery_address`
  - `pediragora_delivery_complement`

---

## 👤 6. Etapa 3: Dados do Cliente

### Campos:

#### Obrigatórios:
- **Nome:** Texto livre (sanitizado)
- **Telefone:** Validação de formato (10 ou 11 dígitos)

#### Opcionais:
- **Observações:** Notas especiais sobre o pedido

### Validações:
- ✅ Nome não pode estar vazio
- ✅ Telefone obrigatório e válido
- ✅ Formato de telefone validado (10 ou 11 dígitos)

### Armazenamento:
- `pediragora_customer_name`
- `pediragora_customer_phone`
- `pediragora_customer_notes`

---

## 💳 7. Etapa 4: Pagamento

### Formas de Pagamento:

#### 1. PIX
- Pagamento instantâneo
- Sem campos adicionais

#### 2. Dinheiro
- **Campo adicional:** "Troco para"
- **Cálculo automático de troco:**
  ```javascript
  if (valorPago >= total) {
      troco = valorPago - total
  } else {
      exibe: "Valor insuficiente"
  }
  ```
- Troco exibido em tempo real
- Total inclui taxa de entrega (se aplicável)

#### 3. Cartão (Crédito/Débito)
- Sem campos adicionais

### Validações:
- ✅ Forma de pagamento deve ser selecionada
- ✅ Se "Dinheiro": valor pago deve ser >= total (incluindo taxa de entrega)

### Armazenamento:
- `pediragora_payment_method`
- `pediragora_change_amount`

### Exibição:
- Total do pedido exibido na etapa 4 (inclui taxa de entrega se aplicável)

---

## 📋 8. Etapa 5: Resumo do Pedido

### Conteúdo:
- ✅ **Lista de Itens:** Nome, quantidade, preço unitário e subtotal de cada item
- ✅ **Subtotal:** Soma dos itens sem taxa de entrega
- ✅ **Taxa de Entrega:** R$ 3,00 (se entrega selecionada)
- ✅ **Total:** Total final incluindo taxa de entrega (se aplicável)
- ✅ **Dados do Cliente:** Nome, telefone e observações (se houver)
- ✅ **Entrega:** Forma de entrega, endereço completo e complemento (se entrega)
- ✅ **Pagamento:** Forma de pagamento, valor pago e troco (se dinheiro)

### Funcionalidades:
- Visualização completa de todas as informações do pedido
- Possibilidade de voltar para editar qualquer etapa
- Botão "Confirmar Pedido" para finalizar e enviar para WhatsApp

### Validações:
- Todas as validações já foram feitas nas etapas anteriores
- Ao confirmar, o pedido é enviado para o WhatsApp

---

## ✅ 9. Validação e Processamento

### Sequência de Validação por Etapa:
- **Etapa 1 → 2:** Valida carrinho não vazio
- **Etapa 2 → 3:** Valida forma de entrega selecionada e endereço (se entrega)
- **Etapa 3 → 4:** Valida nome e telefone obrigatórios e formato
- **Etapa 4 → 5:** Valida forma de pagamento selecionada
- **Etapa 5 → Checkout:** Todas as validações já foram feitas, apenas confirma

### Validação Final no Checkout:
```javascript
handleCheckout()
├── Valida carrinho não vazio
├── Sanitiza todos os inputs (XSS protection)
├── Valida nome obrigatório
├── Valida telefone obrigatório e formato
├── Valida forma de pagamento selecionada
├── Se entrega: valida endereço obrigatório
├── Calcula total com taxa de entrega (se aplicável)
└── Se dinheiro: valida valor pago >= total (incluindo taxa)
```

### Sanitização:
- Todos os inputs passam por `sanitizeInput()`
- Remove caracteres perigosos
- Converte para maiúsculas (exceto telefone)
- Previne XSS attacks

---

## 📱 10. Formatação da Mensagem WhatsApp

### Estrutura da Mensagem:

```
*NOVO PEDIDO*

Data: DD/MM/AAAA às HH:MM

*Cliente:* NOME DO CLIENTE
*Telefone:* (XX) XXXXX-XXXX

*ITENS:*
──────────────────────────────
1. NOME DO PRODUTO
   Qtd: X x R$ XX.XX = R$ XX.XX
2. OUTRO PRODUTO
   Qtd: Y x R$ YY.YY = R$ YY.YY
──────────────────────────────
*TOTAL: R$ XXX.XX*

*OBSERVAÇÕES:*
OBSERVAÇÕES DO CLIENTE

*FORMA DE PAGAMENTO:*
PIX / DINHEIRO / CARTÃO

*Valor pago: R$ XX.XX* (se dinheiro)
*Troco: R$ XX.XX* (se dinheiro)

*FORMA DE ENTREGA:*
RETIRAR NO LOCAL / ENTREGA

*Endereço:* ENDEREÇO COMPLETO (se entrega)
   Complemento: COMPLEMENTO (se houver)

*LOCAL PARA RETIRADA:* (se retirar no local)
Abrir Mapa ↓
https://www.google.com/maps?q=LAT,LNG

──────────────────────────────
Aguarde confirmação do pedido por favor!
```

### Formatação do Telefone:
- Remove caracteres não numéricos
- Adiciona código do país (55) se não tiver
- Formato final: `5511999999999`

### URL Gerada:
```
https://wa.me/5511999999999?text=MENSAGEM_ENCODED
```

---

## 🚀 9. Envio para WhatsApp

### Processo:
1. **Formata mensagem** com todos os dados do pedido
2. **Codifica mensagem** com `encodeURIComponent()`
3. **Gera URL** do WhatsApp Web/App
4. **Abre em nova aba** com `window.open(url, '_blank')`
5. **Cliente confirma** e envia mensagem

### Dados Incluídos:
- ✅ Data e hora do pedido
- ✅ Nome e telefone do cliente
- ✅ Lista completa de itens (nome, quantidade, preço)
- ✅ Taxa de entrega (R$ 3,00 se entrega selecionada)
- ✅ Total do pedido (inclui taxa de entrega se aplicável)
- ✅ Observações
- ✅ Forma de pagamento
- ✅ Valor pago e troco (se dinheiro)
- ✅ Forma de entrega
- ✅ Endereço completo (se entrega)
- ✅ Link do mapa (se retirar no local)

---

## 🧹 11. Limpeza de Dados

### Após Envio Bem-Sucedido:

#### Dados Removidos:
- ✅ Carrinho (`pediragora_cart`)
- ✅ Observações (`pediragora_customer_notes`)
- ✅ Forma de pagamento (`pediragora_payment_method`)
- ✅ Valor pago (`pediragora_change_amount`)

#### Dados Mantidos (para compras recorrentes):
- ✅ Nome do cliente (`pediragora_customer_name`)
- ✅ Telefone (`pediragora_customer_phone`)
- ✅ Forma de entrega (`pediragora_delivery_method`)
- ✅ Endereço (`pediragora_delivery_address`)
- ✅ Complemento (`pediragora_delivery_complement`)

### UI Resetada:
- Carrinho fechado
- Volta para etapa 1 do checkout
- Campos de formulário limpos
- Contador do carrinho zerado

---

## 🔒 Segurança Implementada

### Proteções:
- ✅ **Sanitização de inputs:** Previne XSS
- ✅ **Validação de formato:** Telefone, valores numéricos
- ✅ **Validação de obrigatórios:** Campos críticos
- ✅ **Limpeza de dados sensíveis:** Após checkout
- ✅ **localStorage seguro:** Apenas dados não sensíveis

---

## 📊 Resumo das Funções Principais

### Módulo `cart.js`:
- `addItem(item)` - Adiciona item ao carrinho
- `removeItem(id)` - Remove item do carrinho
- `getCart()` - Retorna todos os itens
- `getTotal()` - Calcula total do pedido
- `updateItemQuantity(id, quantity)` - Atualiza quantidade
- `saveCart()` - Salva no localStorage
- `loadCartFromStorage()` - Carrega do localStorage
- `clearCart()` - Limpa carrinho
- `clearTemporaryData()` - Limpa dados temporários
- `clearSensitiveData()` - Limpa dados sensíveis

### Módulo `whatsapp.js`:
- `sendToWhatsApp(phoneNumber, orderObject)` - Envia pedido para WhatsApp

### Funções do `script.js`:
- `handleAddToCart(itemId)` - Handler para adicionar item
- `renderCartUI()` - Atualiza interface do carrinho
- `handleCheckout()` - Processa checkout completo
- `goToCartStep(step)` - Navega entre etapas
- `calculateChange()` - Calcula troco

---

## 🎯 Fluxo Simplificado

```
1. Cliente vê produto → Clica "Adicionar"
2. Item vai para carrinho (localStorage)
3. Cliente gerencia carrinho (quantidades, remover)
4. Cliente clica "Finalizar Pedido"
5. Etapa 1: Revisa itens → Continua
6. Etapa 2: Escolhe entrega (se entrega, taxa R$ 3,00 adicionada) → Continua
7. Etapa 3: Preenche dados (nome, telefone, observações) → Continua
8. Etapa 4: Escolhe forma de pagamento → Continua
9. Etapa 5: Revisa resumo completo do pedido → Confirma
10. Sistema valida tudo
11. Formata mensagem WhatsApp (inclui taxa se aplicável)
12. Abre WhatsApp com mensagem pré-preenchida
13. Cliente confirma e envia
14. Sistema limpa dados temporários
15. Mantém dados do cliente para próximas compras
```

---

## 📝 Notas Importantes

- **Persistência:** Carrinho persiste mesmo fechando o navegador
- **Dados do Cliente:** Nome, telefone e endereço são mantidos para facilitar compras recorrentes
- **Validação:** Todos os campos críticos são validados antes do envio
- **Segurança:** Todos os inputs são sanitizados para prevenir XSS
- **UX:** Interface em 5 etapas facilita o processo de checkout com resumo final
- **Taxa de Entrega:** R$ 3,00 adicionada automaticamente quando "Entrega" é selecionada
- **Mobile-First:** Design otimizado para dispositivos móveis

