# 📱 Fluxo dos Botões: "Pedir Agora" e "Adicionar"

Este documento descreve o fluxo completo dos botões "Pedir Agora" e "Adicionar" no cardápio.

---

## 🔘 Botão "Adicionar"

### Localização
- Aparece em cada card de produto no cardápio
- Cor: Amarelo dourado (#eeb534)
- Ícone: Carrinho de compras SVG
- Texto: "Adicionar"

### Fluxo Completo

```
┌─────────────────────┐
│ Cliente clica em    │
│ "Adicionar"         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ handleAddToCart()   │
│ é chamado           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Verifica horário    │
│ de atendimento      │
│ (checkIfCanPurchase)│
└──────────┬──────────┘
           │
           ├─❌ Fora do horário
           │  └─> Exibe modal de aviso
           │      └─> Para aqui
           │
           └─✅ Dentro do horário
              │
              ▼
┌─────────────────────┐
│ Busca item no        │
│ MENU_DATA pelo ID    │
└──────────┬──────────┘
           │
           ├─❌ Item não encontrado
           │  └─> Nada acontece
           │
           └─✅ Item encontrado
              │
              ▼
┌─────────────────────┐
│ addItem(item)        │
│ (core/cart.js)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Verifica se item    │
│ já existe no        │
│ carrinho            │
└──────────┬──────────┘
           │
           ├─✅ Item já existe
           │  └─> Incrementa quantidade (+1)
           │
           └─❌ Item não existe
              └─> Adiciona novo item (qtd: 1)
           │
           ▼
┌─────────────────────┐
│ saveCart()          │
│ Salva no localStorage│
│ (pediragora_cart)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ renderCartUI()      │
│ Atualiza interface  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Atualiza contador   │
│ no header           │
│ (cart-count)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Atualiza total      │
│ no header           │
│ (cart-total)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Animação pulse no   │
│ contador (se mudou) │
└─────────────────────┘
```

### Comportamento
- ✅ Adiciona item ao carrinho
- ✅ Atualiza contador no header
- ✅ Atualiza total no header
- ✅ Salva no localStorage (persistência)
- ✅ Animação visual no contador
- ❌ **NÃO abre o carrinho automaticamente**
- ❌ **NÃO redireciona para checkout**

### Código
```javascript
// Botão "Adicionar"
addBtn.addEventListener('click', () => {
    handleAddToCart(item.id);
});

// Função handleAddToCart
function handleAddToCart(itemId) {
    // 1. Verifica horário de atendimento
    const purchaseCheck = checkIfCanPurchase();
    if (!purchaseCheck.canPurchase) {
        showAlertModal('Aviso', purchaseCheck.message);
        return;
    }
    
    // 2. Busca item no MENU_DATA
    const item = MENU_DATA.items.find(i => i.id === itemId);
    if (item) {
        // 3. Adiciona ao carrinho
        addItem(item);
        // 4. Atualiza UI
        renderCartUI();
    }
}
```

---

## 🚀 Botão "Pedir Agora"

### Localização
- Aparece em cada card de produto no cardápio
- Cor: Vermelho/Laranja (#df4c2d)
- Texto: "Pedir Agora"
- Posição: Acima do botão "Adicionar"

### Fluxo Completo

```
┌─────────────────────┐
│ Cliente clica em    │
│ "Pedir Agora"       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Verifica horário    │
│ de atendimento      │
│ (checkIfCanPurchase)│
└──────────┬──────────┘
           │
           ├─❌ Fora do horário
           │  └─> Exibe modal de aviso
           │      └─> Para aqui
           │
           └─✅ Dentro do horário
              │
              ▼
┌─────────────────────┐
│ handleAddToCart()   │
│ Adiciona item       │
│ ao carrinho         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ openCart()          │
│ Abre carrinho       │
│ automaticamente     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ goToCartStep(1)     │
│ Vai para etapa 1    │
│ (Revisão)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Carrinho aberto     │
│ Cliente pode        │
│ continuar checkout  │
└─────────────────────┘
```

### Comportamento
- ✅ Adiciona item ao carrinho
- ✅ Atualiza contador no header
- ✅ Atualiza total no header
- ✅ Salva no localStorage
- ✅ **Abre o carrinho automaticamente**
- ✅ **Redireciona para etapa 1 do checkout**
- ✅ Bloqueia scroll da página (mobile)

### Código
```javascript
// Botão "Pedir Agora"
buyNowBtn.addEventListener('click', () => {
    // 1. Verifica horário de atendimento
    const purchaseCheck = checkIfCanPurchase();
    if (!purchaseCheck.canPurchase) {
        showAlertModal('Aviso', purchaseCheck.message);
        return;
    }
    // 2. Adiciona ao carrinho
    handleAddToCart(item.id);
    // 3. Abre carrinho automaticamente
    openCart();
});
```

---

## 🔄 Diferenças Principais

| Característica | "Adicionar" | "Pedir Agora" |
|----------------|-------------|---------------|
| **Adiciona ao carrinho** | ✅ Sim | ✅ Sim |
| **Atualiza contador** | ✅ Sim | ✅ Sim |
| **Salva no localStorage** | ✅ Sim | ✅ Sim |
| **Abre carrinho** | ❌ Não | ✅ Sim |
| **Verifica horário** | ✅ Sim | ✅ Sim |
| **Uso recomendado** | Adicionar múltiplos itens | Compra rápida de 1 item |

---

## 📋 Função `handleAddToCart(itemId)`

### Processo Interno:

1. **Validação de Horário:**
   ```javascript
   const purchaseCheck = checkIfCanPurchase();
   if (!purchaseCheck.canPurchase) {
       showAlertModal('Aviso', purchaseCheck.message);
       return; // Para aqui se fora do horário
   }
   ```

2. **Busca do Item:**
   ```javascript
   const item = MENU_DATA.items.find(i => i.id === itemId);
   ```

3. **Adição ao Carrinho:**
   ```javascript
   if (item) {
       addItem(item);  // Adiciona ou incrementa quantidade
       renderCartUI();  // Atualiza interface
   }
   ```

### Função `addItem(item)` (core/cart.js):

```javascript
function addItem(item) {
    // Verifica se item já existe
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        // Incrementa quantidade
        existingItem.quantity += 1;
    } else {
        // Adiciona novo item com quantidade 1
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    saveCart(); // Salva no localStorage
}
```

---

## 🎯 Função `openCart()`

### Processo:

1. **Verifica se sidebar existe:**
   ```javascript
   if (!cartSidebar) {
       console.error('Cart sidebar not found');
       return;
   }
   ```

2. **Salva posição do scroll:**
   ```javascript
   scrollPosition = window.pageYOffset || document.documentElement.scrollTop || window.scrollY;
   ```

3. **Abre sidebar e overlay:**
   ```javascript
   cartSidebar.classList.add('open');
   cartOverlay.classList.add('active');
   ```

4. **Reseta para etapa 1:**
   ```javascript
   goToCartStep(1);
   ```

5. **Bloqueia scroll (mobile):**
   ```javascript
   document.body.classList.add('cart-open');
   document.body.style.overflow = 'hidden';
   document.body.style.position = 'fixed';
   // ... mais estilos para bloquear scroll
   ```

---

## 🎨 Estilos dos Botões

### Botão "Pedir Agora" (`.btn-buy-now`):
- **Cor de fundo:** #df4c2d (Vermelho/Laranja)
- **Cor hover:** #c43d20 (Vermelho mais escuro)
- **Largura:** 100% do container
- **Altura:** 44px (desktop) / 40px (mobile)
- **Padding:** 12px
- **Fonte:** 1rem, peso 600

### Botão "Adicionar" (`.btn-add-cart`):
- **Cor de fundo:** #eeb534 (Amarelo dourado)
- **Cor hover:** #d69826 (Amarelo mais escuro)
- **Largura:** 100% do container
- **Altura:** 44px (desktop) / 40px (mobile)
- **Padding:** 12px
- **Fonte:** 1rem, peso 600
- **Ícone:** SVG de carrinho (20x20px)

---

## 🔍 Validação de Horário

Ambos os botões verificam o horário de atendimento antes de executar:

```javascript
const purchaseCheck = checkIfCanPurchase();
if (!purchaseCheck.canPurchase) {
    showAlertModal('Aviso', purchaseCheck.message);
    return;
}
```

### Mensagens possíveis:
- "Loja fechada, abre hoje das XXh as XXh" (antes do horário)
- "Loja Fechada" (depois do horário ou fechado no dia)
- "Loja Fechada!" (dia fechado)

---

## 💾 Persistência

### localStorage:
- **Chave:** `pediragora_cart`
- **Formato:** Array JSON de itens
- **Estrutura:**
  ```javascript
  [
      {
          id: "1",
          name: "VÓ MIMA",
          price: 22.00,
          quantity: 2,
          category: "Burguers",
          image: "../assets/images/...",
          description: "..."
      },
      // ... mais itens
  ]
  ```

### Salvamento Automático:
- Após cada `addItem()`, `saveCart()` é chamado
- Carrinho persiste mesmo fechando o navegador
- Restaurado automaticamente ao recarregar a página

---

## 🎬 Exemplo de Uso

### Cenário 1: Cliente quer adicionar vários itens
1. Cliente clica "Adicionar" no item 1 → Item adicionado, contador atualizado
2. Cliente clica "Adicionar" no item 2 → Item adicionado, contador atualizado
3. Cliente clica "Adicionar" no item 1 novamente → Quantidade incrementada
4. Cliente clica no ícone do carrinho → Carrinho abre com todos os itens

### Cenário 2: Cliente quer comprar rápido
1. Cliente clica "Pedir Agora" no item → Item adicionado E carrinho abre automaticamente
2. Cliente já está na etapa 1 do checkout → Pode continuar imediatamente

---

## 📝 Notas Importantes

- **Ambos os botões** verificam horário de atendimento
- **Ambos os botões** usam a mesma função `handleAddToCart()`
- **Apenas "Pedir Agora"** abre o carrinho automaticamente
- **Quantidade é incrementada** se item já existe no carrinho
- **Carrinho persiste** no localStorage
- **Interface é atualizada** automaticamente após adicionar

---

## 🔧 Funções Relacionadas

### `handleAddToCart(itemId)`
- Valida horário
- Busca item
- Adiciona ao carrinho
- Atualiza UI

### `addItem(item)` (core/cart.js)
- Adiciona ou incrementa item
- Salva no localStorage

### `renderCartUI()`
- Atualiza contador
- Atualiza total
- Anima contador se mudou

### `openCart()`
- Abre sidebar do carrinho
- Bloqueia scroll
- Reseta para etapa 1

### `checkIfCanPurchase()`
- Verifica horário de atendimento
- Retorna `{ canPurchase: boolean, message: string }`

