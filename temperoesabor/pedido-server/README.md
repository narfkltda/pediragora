# Servidor de Impressão Local

Servidor Node.js local para enviar pedidos diretamente para impressora térmica Bematech MP-4200 HS via TCP/IP.

## Instalação

```bash
cd pedido-server
npm install
```

## Configuração

A impressora está configurada com:
- **IP:** 192.168.68.101
- **Porta:** 9100 (TCP/IP Raw)
- **Largura do papel:** 80mm

Para alterar a configuração, edite as constantes no arquivo `server.js`:
```javascript
const PRINTER_IP = '192.168.68.101';
const PRINTER_PORT = 9100;
```

## Uso

### Iniciar o servidor

```bash
npm start
```

O servidor iniciará na porta **3002** e estará disponível em:
- **Endpoint de impressão:** `http://localhost:3002/print`
- **Health check:** `http://localhost:3002/health`

### Testar conexão

```bash
curl http://localhost:3001/health
```

## Como funciona

1. O frontend (`pedido/pedido.js`) faz parse do pedido do WhatsApp
2. Quando o usuário clica em "Imprimir Pedido" e escolhe "Enviar para Impressora Térmica"
3. Os dados do pedido são enviados via POST para `http://localhost:3001/print`
4. O servidor gera comandos ESC/POS formatados
5. Conecta via TCP/IP socket na porta 9100 da impressora
6. Envia os comandos e corta o papel

## Formato do Recibo

O recibo inclui:
- Logo/Título "TEMPERO & SABOR"
- "PEDIDO" centralizado
- Data, Hora, Cliente, Telefone
- Lista de itens com quantidade, preço e total
- Customizações (remover/adicionar)
- Taxa de entrega (se houver)
- TOTAL
- Observações
- Forma de pagamento e troco
- Forma de entrega e endereço
- Rodapé "Obrigado Pela Preferência!"
- Corte automático do papel

## Troubleshooting

### Erro: "Servidor de impressão não está rodando"
- Certifique-se de que o servidor está iniciado: `npm start`
- Verifique se a porta 3002 está livre

### Erro: "Timeout ao conectar com impressora"
- Verifique se o IP da impressora está correto (192.168.68.101)
- Verifique se a impressora está ligada e na mesma rede
- Teste conectividade: `ping 192.168.68.101`

### Erro: "Erro de conexão"
- Verifique se a porta 9100 está acessível
- Verifique firewall/antivírus que possam bloquear a conexão

## Requisitos

- Node.js >= 14.0.0
- Express.js
- Impressora na mesma rede local

