/**
 * Conversor de HTML formatado para comandos ESC/POS
 * Converte o pedido formatado em comandos de impressão térmica
 */

class ESCPOSConverter {
    constructor() {
        // Comandos ESC/POS básicos
        this.ESC = '\x1B';
        this.GS = '\x1D';
        this.LF = '\x0A';
        this.CR = '\x0D';
        
        // Configuração para papel térmico 80mm
        this.PAPER_WIDTH = 80; // mm
        this.CHARS_PER_LINE = 50; // caracteres por linha (otimizado para 80mm)
    }

    /**
     * Converte HTML formatado em comandos ESC/POS
     * @param {string} html - HTML do pedido formatado
     * @returns {Uint8Array} - Dados em formato ESC/POS
     */
    convertHTMLToESCPOS(html) {
        // Criar elemento temporário para parse do HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Array para armazenar os comandos
        const commands = [];

        // Inicializar impressora com configurações para 80mm
        commands.push(this.initialize());
        commands.push(this.setPaperWidth80mm());

        // Processar elementos
        this.processElement(tempDiv, commands);

        // Adicionar alimentação e corte
        commands.push(this.feedLines(3));
        commands.push(this.cut(1)); // Corte total

        // Converter para Uint8Array
        const fullCommand = commands.join('');
        return this.stringToUint8Array(fullCommand);
    }

    /**
     * Processa elemento HTML recursivamente
     */
    processElement(element, commands) {
        const children = Array.from(element.childNodes);

        for (const child of children) {
            if (child.nodeType === Node.TEXT_NODE) {
                // Texto simples
                const text = this.sanitizeText(child.textContent);
                if (text.trim()) {
                    commands.push(text);
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toLowerCase();
                const className = child.className || '';

                // Processar diferentes elementos
                switch (tagName) {
                    case 'div':
                        this.processDiv(child, className, commands);
                        break;
                    case 'p':
                        this.processParagraph(child, commands);
                        break;
                    case 'strong':
                        commands.push(this.setBold(true));
                        this.processElement(child, commands);
                        commands.push(this.setBold(false));
                        break;
                    case 'img':
                        // Imagens não são suportadas em ESC/POS básico
                        // Pular por enquanto
                        break;
                    default:
                        this.processElement(child, commands);
                }
            }
        }
    }

    /**
     * Processa div com base na classe
     */
    processDiv(element, className, commands) {
        if (className.includes('order-header')) {
            // Cabeçalho do pedido
            commands.push(this.setAlign('center'));
            commands.push(this.setBold(true));
            commands.push(this.setFontSize(1, 1));
            this.processElement(element, commands);
            commands.push(this.setFontSize(0, 0));
            commands.push(this.setBold(false));
            commands.push(this.setAlign('left'));
            commands.push(this.feedLines(1));
            commands.push(this.drawLine());
            commands.push(this.feedLines(1));
        } else if (className.includes('order-title')) {
            // Título do pedido
            commands.push(this.setAlign('center'));
            commands.push(this.setBold(true));
            commands.push(this.setFontSize(2, 2));
            this.processElement(element, commands);
            commands.push(this.setFontSize(0, 0));
            commands.push(this.setBold(false));
            commands.push(this.feedLines(1));
        } else if (className.includes('order-info')) {
            // Informações do pedido
            commands.push(this.setAlign('left'));
            this.processElement(element, commands);
            commands.push(this.feedLines(1));
        } else if (className.includes('items-section')) {
            // Seção de itens
            commands.push(this.drawLine());
            commands.push(this.feedLines(1));
            this.processElement(element, commands);
            commands.push(this.feedLines(1));
            commands.push(this.drawLine());
            commands.push(this.feedLines(1));
        } else if (className.includes('items-title')) {
            // Título da seção de itens
            commands.push(this.setBold(true));
            commands.push(this.setFontSize(1, 1));
            this.processElement(element, commands);
            commands.push(this.setFontSize(0, 0));
            commands.push(this.setBold(false));
            commands.push(this.feedLines(1));
        } else if (className.includes('order-item')) {
            // Item do pedido
            commands.push(this.setBold(true));
            this.processElement(element, commands);
            commands.push(this.setBold(false));
            commands.push(this.feedLines(1));
        } else if (className.includes('item-name')) {
            // Nome do item
            commands.push(this.setBold(true));
            this.processElement(element, commands);
            commands.push(this.setBold(false));
            commands.push(this.LF);
        } else if (className.includes('item-details')) {
            // Detalhes do item
            this.processElement(element, commands);
            commands.push(this.LF);
        } else if (className.includes('item-customizations')) {
            // Customizações
            commands.push(this.LF);
            this.processElement(element, commands);
            commands.push(this.LF);
        } else if (className.includes('total-section')) {
            // Seção de total
            commands.push(this.feedLines(1));
            commands.push(this.drawLine());
            commands.push(this.feedLines(1));
            commands.push(this.setAlign('center'));
            this.processElement(element, commands);
            commands.push(this.setAlign('left'));
            commands.push(this.feedLines(1));
            commands.push(this.drawLine());
            commands.push(this.feedLines(1));
        } else if (className.includes('total-label')) {
            // Label do total
            commands.push(this.setBold(true));
            commands.push(this.setFontSize(1, 1));
            this.processElement(element, commands);
            commands.push(this.setFontSize(0, 0));
            commands.push(this.setBold(false));
            commands.push(this.LF);
        } else if (className.includes('total-value')) {
            // Valor do total
            commands.push(this.setBold(true));
            commands.push(this.setFontSize(2, 2));
            this.processElement(element, commands);
            commands.push(this.setFontSize(0, 0));
            commands.push(this.setBold(false));
            commands.push(this.LF);
        } else if (className.includes('order-footer')) {
            // Rodapé
            commands.push(this.feedLines(2));
            commands.push(this.setAlign('center'));
            commands.push(this.setBold(true));
            this.processElement(element, commands);
            commands.push(this.setBold(false));
            commands.push(this.setAlign('left'));
            commands.push(this.feedLines(1));
        } else {
            // Div genérico
            this.processElement(element, commands);
        }
    }

    /**
     * Processa parágrafo
     */
    processParagraph(element, commands) {
        this.processElement(element, commands);
        commands.push(this.LF);
    }

    /**
     * Inicializa a impressora
     */
    initialize() {
        return this.ESC + '@';
    }

    /**
     * Configura impressora para papel 80mm
     * Define densidade térmica otimizada para 80mm
     */
    setPaperWidth80mm() {
        // Configurar densidade térmica (GS (E) n)
        // n: bits 0-2 = densidade (0-7), bits 3-4 = velocidade (0-3)
        // 0x37 = densidade 7 (máxima), velocidade 0 (normal)
        // Compatível com impressoras ESC/POS padrão
        return this.GS + String.fromCharCode(0x45) + String.fromCharCode(0x37);
    }

    /**
     * Define alinhamento do texto
     * @param {string} align - 'left', 'center', 'right'
     */
    setAlign(align) {
        const alignCodes = {
            'left': 0,
            'center': 1,
            'right': 2
        };
        return this.ESC + 'a' + String.fromCharCode(alignCodes[align] || 0);
    }

    /**
     * Define negrito
     * @param {boolean} bold
     */
    setBold(bold) {
        return this.ESC + 'E' + String.fromCharCode(bold ? 1 : 0);
    }

    /**
     * Define tamanho da fonte
     * @param {number} width - 0-7 (multiplicador de largura)
     * @param {number} height - 0-7 (multiplicador de altura)
     */
    setFontSize(width, height) {
        const size = (width & 0x07) | ((height & 0x07) << 4);
        return this.GS + '!' + String.fromCharCode(size);
    }

    /**
     * Alimenta linhas
     * @param {number} lines - Número de linhas
     */
    feedLines(lines) {
        return this.ESC + 'd' + String.fromCharCode(lines);
    }

    /**
     * Desenha linha separadora
     */
    drawLine() {
        const line = '-'.repeat(this.CHARS_PER_LINE);
        return line + this.LF;
    }

    /**
     * Corta o papel
     * @param {number} mode - 0 = corte parcial, 1 = corte total
     */
    cut(mode = 0) {
        return this.GS + 'V' + String.fromCharCode(mode);
    }

    /**
     * Sanitiza texto removendo caracteres problemáticos
     */
    sanitizeText(text) {
        if (!text) return '';
        
        // Mapear caracteres especiais comuns
        const charMap = {
            '€': 'EUR',
            '£': 'GBP',
            '¥': 'JPY',
            // Manter acentos comuns (UTF-8 deve funcionar)
        };

        let sanitized = text;
        for (const [char, replacement] of Object.entries(charMap)) {
            sanitized = sanitized.replace(new RegExp(char, 'g'), replacement);
        }

        return sanitized;
    }

    /**
     * Converte string para Uint8Array
     */
    stringToUint8Array(str) {
        // Usar TextEncoder para manter caracteres UTF-8 (incluindo acentos)
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }
}

// Exportar instância singleton
const escposConverter = new ESCPOSConverter();

