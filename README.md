# Arena Beach Serra

Plataforma premium para reserva de quadras de beach sports e eventos exclusivos.

## Funcionalidades

- Reserva de quadras de vôlei de praia, futevôlei e beach tennis
- Espaços exclusivos para eventos corporativos e aniversários
- Pagamento via Pix ou cartão de crédito
- Confirmação instantânea via WhatsApp

## Tecnologias

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Zustand (gerenciamento de estado)
- React Router DOM

## Como executar

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev
```

A aplicação será iniciada em `http://localhost:3000`

## Estrutura do projeto

```
src/
├── app/
│   ├── routes/      # Rotas da aplicação
│   └── store/      # Estado global (Zustand)
├── core/
│   ├── constants/  # Configurações
│   └── utils/     # Funções utilitárias
├── models/
│   └── entities/  # Tipos TypeScript
├── services/
│   ├── api/       # Serviços de API
│   └── whatsapp/  # Integração WhatsApp
├── viewmodels/     # Hooks de lógica de negócio
└── views/
    ├── components/
    │   ├── business/
    │   ├── common/
    │   └── layout/
    └── pages/
```

## Licença

MIT