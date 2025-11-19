# Layout do Carrinho - Pediragora

## Estrutura Geral

```
┌─────────────────────────────────────────────────────────┐
│                    CART OVERLAY                         │
│              (Fundo escuro semi-transparente)           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │            CART SIDEBAR (400px width)            │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │  CART HEADER                               │ │   │
│  │  │  ┌─────┐  ┌──────────────┐  ┌──────────┐  │ │   │
│  │  │  │ ←   │  │   Título     │  │    ×     │  │ │   │
│  │  │  │Back │  │  (Carrinho)  │  │  Close   │  │ │   │
│  │  │  └─────┘  └──────────────┘  └──────────┘  │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │         CART STEP CONTENT                  │ │   │
│  │  │         (Scrollable area)                  │ │   │
│  │  │                                            │ │   │
│  │  │  [Conteúdo específico de cada step]        │ │   │
│  │  │                                            │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │         CART STEP FOOTER                   │ │   │
│  │  │  [Total / Botões de navegação]             │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## STEP 1: Revisão (Cart Items)

```
┌─────────────────────────────────────────┐
│  ←  Carrinho                    ×       │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Itens                              │ │
│  │ ─────────────────────────────────  │ │
│  │                                     │ │
│  │  ┌─────┐  ┌────────────────────┐  │ │
│  │  │ IMG │  │ Nome do Item       │  │ │
│  │  │ 60x │  │ R$ XX.XX           │  │ │
│  │  │ 60  │  │ [-] 2 [+] [Remover]│  │ │
│  │  └─────┘  └────────────────────┘  │ │
│  │                                     │ │
│  │  ┌─────┐  ┌────────────────────┐  │ │
│  │  │ IMG │  │ Outro Item         │  │ │
│  │  │ 60x │  │ R$ XX.XX           │  │ │
│  │  │ 60  │  │ [-] 1 [+] [Remover]│  │ │
│  │  └─────┘  └────────────────────┘  │ │
│  │                                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Com Alterações                    │ │
│  │ ─────────────────────────────────  │ │
│  │ (Apenas se houver itens            │ │
│  │  personalizados)                  │ │
│  │                                     │ │
│  │  ┌─────┐  ┌────────────────────┐  │ │
│  │  │ IMG │  │ Item Personalizado │  │ │
│  │  │ 60x │  │ (Customizações)    │  │ │
│  │  │ 60  │  │ R$ XX.XX           │  │ │
│  │  │     │  │ [-] 1 [+] [Remover]│  │ │
│  │  └─────┘  └────────────────────┘  │ │
│  │                                     │ │
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│  Total: R$ XX.XX                        │
│  [Continuar]                            │
└─────────────────────────────────────────┘
```

**Elementos:**
- **Seção "Itens"**: Itens sem customizações
- **Seção "Com Alterações"**: Itens com customizações (aparece apenas se houver)
- Cada item mostra: imagem (60x60px), nome, preço, controles de quantidade, botão remover
- Footer: Total e botão "Continuar"

---

## STEP 2: Entrega (Delivery Method)

```
┌─────────────────────────────────────────┐
│  ←  Entrega                     ×       │
├─────────────────────────────────────────┤
│                                         │
│  Forma de Entrega                       │
│  ┌───────────────────────────────────┐ │
│  │  ( ) Retirar no local            │ │
│  │  ( ) Entrega                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Endereço                          │ │
│  │ [Rua, número, bairro          ]  │ │
│  │                                   │ │
│  │ Complemento                       │ │
│  │ [Apto, bloco, referência      ]  │ │
│  │                                   │ │
│  │ Taxa de entrega: R$ 3,00          │ │
│  │ (Aparece apenas se "Entrega")    │ │
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│  [Continuar]                            │
└─────────────────────────────────────────┘
```

**Elementos:**
- Radio buttons para escolher entrega
- Campos de endereço (aparecem apenas se "Entrega" selecionado)
- Exibição da taxa de entrega (R$ 3,00) quando "Entrega" está selecionado
- Botão "Continuar"

---

## STEP 3: Dados (Customer Data)

```
┌─────────────────────────────────────────┐
│  ←  Dados                        ×       │
├─────────────────────────────────────────┤
│                                         │
│  Nome                                   │
│  [Seu nome                          ]  │
│                                         │
│  Telefone                               │
│  [(00) 00000-0000                  ]  │
│                                         │
│  Observações                            │
│  [Observações sobre o pedido        ]  │
│  [                                    ]  │
│                                         │
├─────────────────────────────────────────┤
│  [Continuar]                            │
└─────────────────────────────────────────┘
```

**Elementos:**
- Campo de texto para Nome
- Campo de telefone (com máscara)
- Textarea para Observações
- Botão "Continuar"

---

## STEP 4: Pagamento (Payment)

```
┌─────────────────────────────────────────┐
│  ←  Pagamento                   ×       │
├─────────────────────────────────────────┤
│                                         │
│  Forma de Pagamento                     │
│  ┌───────────────────────────────────┐ │
│  │  ( ) PIX                          │ │
│  │  ( ) Dinheiro                     │ │
│  │  ( ) Cartão (Crédito/Débito)      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Troco para:                        │ │
│  │ [Ex: 50,00                     ]  │ │
│  │                                   │ │
│  │ Troco: R$ XX.XX                   │ │
│  │ (Aparece apenas se "Dinheiro")    │ │
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│  Total: R$ XX.XX                        │
│  [Continuar]                            │
└─────────────────────────────────────────┘
```

**Elementos:**
- Radio buttons para forma de pagamento
- Campo "Troco para" (aparece apenas se "Dinheiro" selecionado)
- Exibição do valor do troco calculado
- Footer com Total e botão "Continuar"

---

## STEP 5: Resumo (Order Summary)

```
┌─────────────────────────────────────────┐
│  ←  Resumo do Pedido            ×       │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Resumo do Pedido                  │ │
│  │                                   │ │
│  │ Itens                              │ │
│  │ ─────────────────────────────────  │ │
│  │                                     │ │
│  │  • Item 1 x 2          R$ XX.XX   │ │
│  │  • Item 2 x 1          R$ XX.XX   │ │
│  │  • Item Personalizado  R$ XX.XX   │ │
│  │    (Customizações)                 │ │
│  │                                     │ │
│  │  Subtotal:              R$ XX.XX   │ │
│  │  Taxa de entrega:       R$ 3,00    │ │
│  │  ─────────────────────────────────  │ │
│  │  Total:                 R$ XX.XX   │ │
│  │                                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Dados do Cliente                   │ │
│  │ ─────────────────────────────────  │ │
│  │                                     │ │
│  │  Nome:        João Silva           │ │
│  │  Telefone:    (11) 98765-4321     │ │
│  │  Observações: Sem cebola           │ │
│  │                                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Entrega                             │ │
│  │ ─────────────────────────────────  │ │
│  │                                     │ │
│  │  Forma:        Entrega             │ │
│  │  Endereço:     Rua X, 123          │ │
│  │  Complemento: Apto 45             │ │
│  │                                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Pagamento                          │ │
│  │ ─────────────────────────────────  │ │
│  │                                     │ │
│  │  Forma:        PIX                 │ │
│  │  Troco:        -                   │ │
│  │                                     │ │
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│  [Finalizar Pedido]                     │
└─────────────────────────────────────────┘
```

**Elementos:**
- **Seção Itens**: Lista de todos os itens com quantidades e preços
- **Subtotal**: Soma dos itens
- **Taxa de entrega**: R$ 3,00 (se aplicável)
- **Total**: Subtotal + Taxa de entrega
- **Dados do Cliente**: Nome, telefone, observações
- **Entrega**: Forma e endereço (se aplicável)
- **Pagamento**: Forma e troco (se aplicável)
- Botão "Finalizar Pedido"

---

## Características Visuais

### Dimensões
- **Largura do Sidebar**: 400px
- **Altura**: 100vh (100dvh para mobile)
- **Posição**: Fixed à direita da tela
- **Animação**: Slide-in da direita (right: -400px → right: 0)

### Cores
- **Background**: Branco (#ffffff)
- **Header Border**: #e0e0e0
- **Título "Itens"**: #eeb534 (amarelo)
- **Título "Com Alterações"**: #df4c2d (vermelho)
- **Botão Continuar**: #eeb534 (amarelo)
- **Botão Finalizar**: #df4c2d (vermelho)
- **Overlay**: rgba(0, 0, 0, 0.5)

### Tipografia
- **Título do Header**: 1.5rem, font-weight: 700
- **Título das Seções**: 1.1rem, font-weight: 600
- **Texto dos Itens**: font-weight: 600

### Interatividade
- **Botão Voltar (←)**: Aparece apenas nos steps 2-5
- **Overlay**: Fecha o carrinho ao clicar
- **Scroll**: Conteúdo dos steps é scrollável
- **Transições**: 0.3s ease para abertura/fechamento

---

## Responsividade

O carrinho é otimizado para:
- **Desktop**: Sidebar fixo à direita (400px)
- **Mobile**: Sidebar ocupa toda a largura da tela
- **Viewport Height**: Usa `100dvh` para melhor compatibilidade mobile

