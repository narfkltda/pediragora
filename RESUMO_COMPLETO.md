# RESUMO COMPLETO DO PROJETO - PEDIRAGORA

## 📋 VISÃO GERAL

**Pediragora** é uma plataforma de cardápio digital 100% estática desenvolvida para pequenos negócios, especialmente restaurantes e lanchonetes. A plataforma permite criar páginas personalizadas de cardápio com carrinho de compras integrado e checkout via WhatsApp, sem necessidade de backend ou banco de dados.

### Características Principais

- ✅ **100% Estático**: HTML, CSS e JavaScript puro (Vanilla JS)
- ✅ **Sem Backend**: Não requer servidor ou banco de dados
- ✅ **Integração WhatsApp**: Checkout direto via WhatsApp Web/App
- ✅ **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- ✅ **Fácil Personalização**: Template base para criar novos clientes
- ✅ **Persistência Local**: Carrinho e dados salvos no localStorage
- ✅ **Segurança Implementada**: Proteções contra XSS e sanitização de inputs

---

## 🏗️ ARQUITETURA E ESTRUTURA

### Estrutura de Diretórios

```
/pediragora
│
├── index.html                    # Página inicial da plataforma
├── main.js                       # Script principal da landing page
├── styles.css                    # Estilos da landing page
├── build.js                      # Script de build (Node.js)
├── CNAME                         # Configuração de domínio (GitHub Pages)
├── README.md                     # Documentação principal
│
├── /assets                       # Recursos estáticos
│   └── /images                   # Imagens dos produtos e logos
│       ├── Burgers_*.png         # Imagens dos produtos
│       └── TemperoESaborLogo.png # Logo do cliente
│
├── /core                         # Módulos core compartilhados
│   ├── cart.js                   # Gerenciamento do carrinho
│   └── whatsapp.js               # Integração com WhatsApp
│
├── /clients                      # Páginas dos clientes
│   ├── /template                 # Template base para novos clientes
│   │   ├── index.html
│   │   ├── script.js
│   │   └── styles.css
│   │
│   └── /temperoesabor            # Cliente exemplo (Tempero & Sabor)
│       ├── index.html
│       ├── script.js
│       └── styles.css
│
└── /temperoesabor                # Build output (gerado pelo build.js)
    ├── index.html
    ├── script.js
    └── styles.css
```

---

## 🛠️ TECNOLOGIAS UTILIZADAS

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização e layout responsivo
- **JavaScript (ES6+)**: Lógica da aplicação (Vanilla JS, sem frameworks)
- **localStorage API**: Persistência de dados no navegador

### Build Tools
- **Node.js**: Script de build (`build.js`) para processar arquivos

### Integrações Externas
- **WhatsApp Web API**: Envio de pedidos via `wa.me`
- **Google Maps**: Exibição de localização do restaurante

### Dependências
- **Nenhuma**: Projeto 100% autossuficiente, sem dependências npm ou CDN

---

## 🎯 FUNCIONALIDADES PRINCIPAIS

### 1. Sistema de Cardápio Digital

#### Exibição de Produtos
- Grid responsivo de cards de produtos
- Imagens dos produtos com fallback SVG
- Informações: nome, descrição, preço
- Categorização de produtos

#### Busca em Tempo Real
- Barra de busca que filtra instantaneamente
- Busca em nome, descrição e categoria
- Case-insensitive (não diferencia maiúsculas/minúsculas)
- Botão de limpar busca

#### Filtros por Categoria
- Botões de categoria dinâmicos
- Filtro "Todos" para mostrar todos os produtos
- Integração com busca (filtros combinados)

### 2. Sistema de Carrinho de Compras

#### Funcionalidades do Carrinho
- ✅ Adicionar itens ao carrinho
- ✅ Remover itens do carrinho
- ✅ Aumentar/diminuir quantidade
- ✅ Visualizar total do pedido
- ✅ Persistência automática (localStorage)
- ✅ Restauração ao recarregar página

#### Interface do Carrinho
- Sidebar lateral deslizante
- Contador de itens no header
- Listagem de itens com imagens
- Cálculo automático de totais
- Animações de feedback visual

### 3. Processo de Checkout em 3 Etapas

#### Etapa 1: Revisão do Carrinho
- Visualização de todos os itens
- Quantidades e preços
- Total do pedido
- Botão "Continuar"

#### Etapa 2: Forma de Entrega
- Opções: "Retirar no local" ou "Entrega"
- Campos de endereço (se entrega selecionada)
- Campo de complemento (opcional)
- Validação de endereço obrigatório

#### Etapa 3: Identificação e Pagamento
- **Campos do Cliente:**
  - Nome (obrigatório)
  - Telefone (obrigatório, validado)
  - Observações (opcional)
- **Formas de Pagamento:**
  - PIX
  - Dinheiro (com cálculo de troco)
  - Cartão (Crédito/Débito)
- Validação de todos os campos obrigatórios

### 4. Integração com WhatsApp

#### Formato da Mensagem
A mensagem enviada ao WhatsApp inclui:
- 📅 Data e hora do pedido
- 👤 Nome do cliente
- 📱 Telefone do cliente
- 📋 Lista completa de itens (nome, quantidade, preço)
- 💰 Total do pedido
- 🚚 Forma de entrega
- 📍 Endereço (se entrega)
- 💳 Forma de pagamento
- 💵 Valor pago e troco (se dinheiro)
- 📝 Observações do cliente

#### Implementação
- URL formatada: `https://wa.me/55{DDD}{NUMERO}?text={MENSAGEM_ENCODED}`
- Abertura em nova aba/janela
- Mensagem pré-formatada e codificada

### 5. Horários de Funcionamento

- Exibição de horários por dia da semana
- Destaque do dia atual
- Indicação de dias fechados
- Formato compacto (ex: "18h às 23h")

### 6. Localização

- Botão de mapa no header
- Integração com Google Maps
- Abertura com coordenadas GPS do restaurante

---

## 🔒 SEGURANÇA IMPLEMENTADA

### Proteções Contra XSS (Cross-Site Scripting)

#### Substituição de innerHTML
- ✅ `renderItems()`: Mensagens de erro usando `createElement`
- ✅ `createItemCard()`: Construção segura do DOM
- ✅ `renderCartItems()`: Mensagens usando `createElement`
- ✅ `createCartItemElement()`: Construção segura do DOM

#### Funções de Sanitização
- `sanitizeHTML()`: Escapa caracteres `<` e `>`
- `sanitizeInput()`: Remove tags HTML e caracteres de controle

### Content Security Policy (CSP)

Meta tag CSP implementada:
```html
<meta http-equiv="Content-Security-Policy" 
content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; 
img-src 'self' data:; connect-src https://wa.me https://www.google.com;">
```

### Validação de Inputs

- **Validação de Telefone**: Formato brasileiro (10 ou 11 dígitos)
- **Sanitização**: Todos os inputs do usuário são sanitizados
- **Validação em Tempo Real**: Durante digitação e no checkout

### Limpeza de Dados Sensíveis

- Função `clearSensitiveData()` remove dados após checkout:
  - Nome do cliente
  - Telefone
  - Endereço de entrega
  - Complemento
  - Método de pagamento
  - Valor pago (troco)

---

## 📦 MÓDULOS CORE

### core/cart.js

**Responsabilidades:**
- Gerenciamento do carrinho (adicionar, remover, atualizar)
- Persistência no localStorage
- Cálculo de totais
- Gerenciamento de dados do cliente
- Limpeza de dados sensíveis

**Funções Principais:**
- `addItem(item)`: Adiciona item ao carrinho
- `removeItem(id)`: Remove item do carrinho
- `getCart()`: Retorna cópia do carrinho
- `getTotal()`: Calcula total do pedido
- `saveCustomerData(name, notes)`: Salva dados do cliente
- `clearSensitiveData()`: Remove dados sensíveis

### core/whatsapp.js

**Responsabilidades:**
- Formatação da mensagem do pedido
- Codificação da URL do WhatsApp
- Abertura do WhatsApp Web/App

**Função Principal:**
- `sendToWhatsApp(phoneNumber, orderObject)`: Envia pedido ao WhatsApp

---

## 🎨 PERSONALIZAÇÃO

### Criar Nova Página de Cliente

1. **Copiar Template:**
   ```bash
   cp -r clients/template clients/novocliente
   ```

2. **Personalizar Configuração** (`script.js`):
   ```javascript
   const CONFIG = {
       restaurantName: 'Nome do Restaurante',
       whatsappNumber: 'DDDNUMERO', // Ex: '11999999999'
       logoPath: '../../assets/images/logo.png',
       restaurantLatitude: -20.366398,
       restaurantLongitude: -51.419600,
       openingHours: {
           segunda: { open: '18:00', close: '23:00' },
           // ... outros dias
       }
   };
   ```

3. **Adicionar Produtos** (`script.js`):
   ```javascript
   const MENU_DATA = {
       categories: ['Todos', 'Categoria1', 'Categoria2'],
       items: [
           {
               id: '1',
               name: 'Nome do Produto',
               description: 'Descrição do produto',
               price: 18.00,
               category: 'Categoria1',
               image: '../../assets/images/produto.png'
           },
           // ... mais itens
       ]
   };
   ```

4. **Personalizar Estilos** (`styles.css`):
   - Cores do tema
   - Fontes
   - Layout e espaçamentos

### Estrutura de um Item do Menu

```javascript
{
    id: 'unique-id',              // ID único (string)
    name: 'Nome do Produto',      // Nome exibido
    description: 'Descrição...',  // Descrição do produto
    price: 18.00,                 // Preço (número)
    category: 'Categoria',        // Categoria para filtro
    image: 'path/to/image.png'    // Caminho da imagem
}
```

---

## 🚀 DEPLOY E HOSPEDAGEM

### GitHub Pages

O projeto está configurado para GitHub Pages:
- Arquivo `CNAME` para domínio customizado
- Estrutura estática pronta para deploy
- Build script para processar arquivos

### Build Process

O script `build.js` processa arquivos de clientes:
- Copia arquivos de `clients/temperoesabor/` para `temperoesabor/`
- Ajusta caminhos relativos (../../assets/ → ../assets/)
- Prepara para deploy na raiz do repositório

---

## 📊 DADOS E PERSISTÊNCIA

### localStorage Keys

O projeto utiliza as seguintes chaves no localStorage:

- `pediragora_cart`: Itens do carrinho
- `pediragora_customer_name`: Nome do cliente
- `pediragora_customer_phone`: Telefone do cliente
- `pediragora_customer_notes`: Observações do pedido
- `pediragora_payment_method`: Método de pagamento
- `pediragora_change_amount`: Valor pago (para troco)
- `pediragora_delivery_method`: Forma de entrega
- `pediragora_delivery_address`: Endereço de entrega
- `pediragora_delivery_complement`: Complemento do endereço

### Ciclo de Vida dos Dados

1. **Durante Navegação**: Dados salvos automaticamente
2. **Após Checkout**: Dados sensíveis removidos
3. **Persistência**: Dados não sensíveis mantidos para próximos pedidos

---

## 🎯 CASOS DE USO

### Cliente: Tempero & Sabor

**Configuração:**
- 13 produtos (hambúrgueres artesanais)
- 1 categoria: "Lanches"
- Horário: 18h às 23h (todos os dias)
- WhatsApp: 67982077085
- Localização: Coordenadas GPS configuradas

**Funcionalidades Utilizadas:**
- ✅ Cardápio completo
- ✅ Busca de produtos
- ✅ Carrinho com persistência
- ✅ Checkout em 3 etapas
- ✅ Integração WhatsApp
- ✅ Horários de funcionamento
- ✅ Link para Google Maps

---

## 🔧 MANUTENÇÃO E EXTENSIBILIDADE

### Adicionar Novos Clientes

1. Copiar template
2. Configurar CONFIG e MENU_DATA
3. Adicionar imagens em `/assets/images`
4. Personalizar estilos se necessário

### Adicionar Funcionalidades

- **Novos Campos no Checkout**: Adicionar em `handleCheckout()` e `whatsapp.js`
- **Novas Categorias**: Adicionar em `MENU_DATA.categories`
- **Novos Métodos de Pagamento**: Adicionar radio buttons no HTML e lógica no JS
- **Integrações Externas**: Adicionar em `core/` como módulo separado

### Melhorias Futuras Sugeridas

- [ ] Sistema de cupons/descontos
- [ ] Múltiplos métodos de entrega
- [ ] Histórico de pedidos
- [ ] Favoritos do cliente
- [ ] Avaliações e comentários
- [ ] Integração com sistemas de pagamento online
- [ ] Dashboard administrativo (se adicionar backend)

---

## 📝 NOTAS TÉCNICAS

### Compatibilidade

- **Navegadores**: Todos os navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Dispositivos**: Desktop, tablet e mobile
- **Requisitos**: JavaScript habilitado, localStorage suportado

### Performance

- **Carregamento**: Rápido (arquivos estáticos)
- **Sem Dependências Externas**: Não há chamadas a CDNs
- **Otimização**: Imagens devem ser otimizadas antes de adicionar

### Limitações

- **Sem Backend**: Não há validação server-side
- **localStorage**: Dados limitados ao navegador (não sincronizam entre dispositivos)
- **WhatsApp**: Requer que o usuário tenha WhatsApp instalado/aberto

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **README.md**: Documentação principal do projeto
- **RESUMO.txt**: Resumo técnico de segurança
- **Código**: Comentários extensivos em todos os arquivos principais

---

## ✅ STATUS DO PROJETO

**Versão**: MVP (Minimum Viable Product)  
**Status**: ✅ Funcional e em produção  
**Segurança**: ✅ Implementada (XSS, CSP, Validação)  
**Cliente Ativo**: Tempero & Sabor  

---

## 👥 CONTRIBUIÇÃO

Para contribuir com o projeto:
1. Use o template em `/clients/template` como base
2. Siga os padrões de código existentes
3. Mantenha a estrutura de módulos core
4. Teste em múltiplos navegadores
5. Documente novas funcionalidades

---

**Última Atualização**: 2024  
**Desenvolvido com**: HTML5, CSS3, JavaScript (Vanilla)  
**Licença**: Ver arquivo LICENSE (se existir)

