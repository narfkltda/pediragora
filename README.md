# Menu - Plataforma de Cardápio Digital

Uma plataforma simples e gratuita para criar cardápios digitais para pequenos negócios.

## 🎯 Características

- ✅ 100% estático (HTML, CSS, JavaScript puro)
- ✅ Sem necessidade de backend ou banco de dados
- ✅ Integração gratuita com WhatsApp
- ✅ Design responsivo e moderno
- ✅ Fácil de personalizar

## 📁 Estrutura do Projeto

```
/menu
│── index.html                      # Página inicial
│── /clients                        # Páginas dos clientes
│     └── /template                 # Template base para novos clientes
│         └── index.html
│         └── styles.css
│         └── script.js
│── /assets
│     └── /images                   # Imagens dos produtos
│── /core
│     └── cart.js                   # Lógica do carrinho
│     └── whatsapp.js               # Integração com WhatsApp
│── styles.css
│── main.js
│── README.md
```

## 🚀 Como Usar

### Criar uma Nova Página de Cliente

1. Copie a pasta `/clients/template`
2. Renomeie para o nome do cliente (ex: `/clients/temperoesabor`)
3. Personalize o conteúdo em `index.html`
4. Adicione os produtos e categorias
5. Configure o número do WhatsApp em `script.js`

### Estrutura de um Item

Cada item do menu deve seguir esta estrutura:

```javascript
{
    id: 'unique-id',
    name: 'Nome do Produto',
    description: 'Descrição do produto',
    price: 18.00,
    category: 'Burgers',
    image: 'path/to/image.jpg'
}
```

## 🛒 Funcionalidades do Carrinho

O carrinho é gerenciado pelo módulo `core/cart.js` e oferece:

- Adicionar itens
- Remover itens
- Listar itens
- Calcular total
- Limpar carrinho
- **Persistência com localStorage**: O carrinho é salvo automaticamente e restaurado ao recarregar a página
- **Campos do cliente**: Nome e observações opcionais que também são persistidos

## 📱 Integração WhatsApp

O checkout envia uma mensagem formatada para o WhatsApp contendo:

- Nome do cliente (se preenchido)
- Lista de itens
- Quantidades
- Observações (se preenchidas)
- Preço total

A mensagem é enviada via URL: `https://wa.me/55DDDNUMERO?text=MENSAGEM_ENCODED`

### Campos do Cliente

Antes de finalizar o pedido, o cliente pode preencher (opcionalmente):

- **Nome**: Campo de texto para identificar o cliente
- **Observações**: Campo de texto longo para instruções especiais ou observações sobre o pedido

Esses campos aparecem no carrinho, acima do botão "Finalizar Pedido", e são incluídos na mensagem do WhatsApp se preenchidos.

## 🔍 Busca de Itens (FASE 3)

O template inclui uma barra de busca em tempo real para facilitar a localização de itens no cardápio.

### Como Funciona

- **Localização**: A barra de busca aparece acima dos filtros de categoria
- **Busca em Tempo Real**: Os resultados são filtrados instantaneamente conforme o usuário digita
- **Campos de Busca**: A busca verifica:
  - Nome do item
  - Descrição do item
  - Categoria do item
- **Case-Insensitive**: A busca não diferencia maiúsculas de minúsculas
- **Botão Limpar**: Um botão (×) aparece quando há texto na busca para limpar rapidamente

### Integração com Filtros de Categoria

A busca funciona em conjunto com os filtros de categoria:

- Se uma categoria estiver selecionada, a busca filtra apenas os itens dessa categoria
- Se "Todos" estiver selecionado, a busca filtra todos os itens
- Os dois filtros (categoria + busca) funcionam simultaneamente (AND logic)

### Exemplo de Uso

1. Usuário seleciona categoria "Burgers"
2. Usuário digita "bacon" na busca
3. Sistema mostra apenas itens da categoria "Burgers" que contenham "bacon" no nome, descrição ou categoria

## 🎨 Personalização

- Edite `styles.css` para alterar cores e estilos
- Modifique `index.html` para adicionar/remover seções
- Atualize `script.js` para adicionar funcionalidades customizadas

## 📝 Notas

### Persistência de Dados

- **Carrinho**: Os itens do carrinho são salvos automaticamente no `localStorage` do navegador e restaurados ao recarregar a página
- **Dados do Cliente**: Nome e observações também são salvos e restaurados automaticamente
- **Desabilitar Persistência**: Para desabilitar a persistência, edite `core/cart.js` e remova as chamadas para `saveCart()` e `saveCustomerData()`, ou comente a linha `loadCartFromStorage()` na inicialização do módulo

### Outras Notas

- Todas as imagens devem ser adicionadas em `/assets/images`
- O template inclui dados de exemplo para teste
- Os dados persistem apenas no navegador onde foram salvos (não sincronizam entre dispositivos)

## 🔄 Próximos Passos

- [ ] Implementar lógica completa do carrinho
- [ ] Adicionar mais funcionalidades de UI
- [ ] Criar sistema de personalização por cliente
- [ ] Adicionar mais exemplos de templates

