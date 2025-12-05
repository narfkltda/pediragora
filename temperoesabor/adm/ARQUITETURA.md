# Arquitetura Admin Panel - Regras Padrão

## Estrutura Obrigatória

```
adm/
├── admin.js              # Entry point (max 300 linhas)
├── modules/              # Módulos funcionais
│   ├── products.js
│   ├── ingredients.js
│   ├── categories.js
│   └── config.js
└── utils/                # Utilitários compartilhados
    ├── modals.js
    ├── forms.js
    ├── ui.js
    └── image-upload.js
```

## Regras

### admin.js
- Apenas inicialização, autenticação e coordenação
- Exporta `state` global compartilhado
- Importa e chama `init*()` de cada módulo
- Máximo 300 linhas

### modules/*.js
- Um módulo = uma funcionalidade completa
- Contém: estado local, load*, render*, CRUD, event handlers
- Exporta função `init*()` obrigatória
- Máximo 1000 linhas por módulo

### utils/*.js
- Funções reutilizáveis usadas por múltiplos módulos
- Funções puras quando possível
- Sem dependência de estado global
- Máximo 300 linhas por utilitário

## Estado

- **Global (`state` em admin.js)**: Apenas se compartilhado entre módulos
- **Local (modules/*.js)**: Estado específico do módulo

## Nomenclatura

- `init*()` - Inicialização de módulo
- `load*()` - Carregar dados
- `render*()` - Renderizar UI
- `handle*()` - Event handlers
- `setup*EventListeners()` - Configurar listeners

## Imports (ordem)

1. Services (`../../services/*`)
2. Estado global (`../admin.js`)
3. Utilitários (`../utils/*`)
4. Outros módulos (`./modules/*`)

## Proibido

- Classes desnecessárias
- Padrões MVVM/MVC/MVP
- Estado reativo complexo
- Eventos customizados
- Misturar responsabilidades de módulos diferentes

## Checklist

- [ ] Código no módulo correto?
- [ ] Utilitários em `utils/`?
- [ ] Estado no lugar certo (global vs local)?
- [ ] Event handlers em `setup*EventListeners()`?
- [ ] `init*()` exportada e chamada?
- [ ] Arquivo dentro do limite de linhas?

