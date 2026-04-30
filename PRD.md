# PRD — Arena Beach Serra: Migração Next.js SSR + Dashboard Administrativo

**Versão:** 1.0  
**Data:** 2026-04-29  
**Autor:** ne0fix  
**Status:** Em revisão

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Objetivos e Métricas](#2-objetivos-e-métricas)
3. [Arquitetura Alvo](#3-arquitetura-alvo)
4. [Modelagem de Dados](#4-modelagem-de-dados)
5. [Backend BFF + Prisma](#5-backend-bff--prisma)
6. [Portal do Cliente — Next.js SSR](#6-portal-do-cliente--nextjs-ssr)
7. [Dashboard Administrativo](#7-dashboard-administrativo)
8. [Design System](#8-design-system)
9. [Segurança e Autenticação](#9-segurança-e-autenticação)
10. [Infraestrutura e Deploy](#10-infraestrutura-e-deploy)
11. [Cronograma e Fases](#11-cronograma-e-fases)
12. [Requisitos Não-Funcionais](#12-requisitos-não-funcionais)

---

## 1. Visão Geral

### 1.1 Contexto

A Arena Beach Serra é uma plataforma de agendamento de quadras de beach sports que atualmente roda como SPA React (Vite) com dados mockados e sem backend real. O projeto possui UI/UX refinada, arquitetura MVVM estabelecida e fluxos de negócio bem definidos.

**Problema:** A ausência de backend real impede operação comercial. A arquitetura SPA não oferece SEO, e não há painel para gestão do negócio.

### 1.2 Escopo da Migração

Este PRD cobre a evolução completa do sistema em três frentes:

| Frente | Atual | Alvo |
|--------|-------|------|
| Frontend cliente | React SPA (Vite) | Next.js 15 App Router (SSR/ISR) |
| Padrão de código | MVVM parcial | MVVM + Clean Architecture completo |
| Backend | Express instalado, não usado | BFF Next.js Route Handlers + Prisma + PostgreSQL |
| Autenticação | Não implementada | NextAuth.js v5 (JWT + OAuth) |
| Pagamentos | Mock | MercadoPago (Pix + Cartão) |
| Admin | Não existe | Dashboard completo de gestão |

### 1.3 Usuários do Sistema

| Perfil | Descrição | Acessos |
|--------|-----------|---------|
| **Cliente** | Usuário final que agenda quadras | Portal público |
| **Recepcionista** | Operador da arena no dia a dia | Dashboard básico (leitura) |
| **Gerente** | Gestor operacional | Dashboard completo |
| **Admin** | Dono / TI | Dashboard completo + configurações |

---

## 2. Objetivos e Métricas

### 2.1 Objetivos de Negócio

- **OBJ-01** — Habilitar agendamentos reais com pagamento integrado
- **OBJ-02** — Fornecer visibilidade total do fluxo de caixa ao gestor
- **OBJ-03** — Reduzir cancelamentos via gestão proativa de agenda
- **OBJ-04** — Melhorar SEO para captar novos clientes orgânicos
- **OBJ-05** — Processar cancelamentos e estornos de pagamento de forma auditada

### 2.2 KPIs

| Métrica | Meta |
|---------|------|
| Taxa de conversão (visualização → agendamento) | ≥ 35% |
| Tempo de carregamento (FCP) | < 1.5s |
| Tempo de resposta API (p95) | < 300ms |
| Taxa de cancelamentos | < 15% |
| Taxa de estorno bem-sucedido | 100% (sem falhas manuais) |
| Uptime | ≥ 99.5% |

---

## 3. Arquitetura Alvo

### 3.1 Visão de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 15 MONOREPO                      │
│                                                                  │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │   Portal do Cliente   │    │   Dashboard Administrativo   │  │
│  │  /app/(client)/...    │    │   /app/(admin)/...           │  │
│  │                       │    │                              │  │
│  │  SSR (páginas SEO)    │    │  CSR (dados em tempo real)   │  │
│  │  ISR (listagem)       │    │  Streaming + Server Actions  │  │
│  └──────────┬───────────┘    └───────────────┬──────────────┘  │
│             │                                 │                  │
│  ┌──────────▼─────────────────────────────────▼──────────────┐ │
│  │                    BFF — Route Handlers                    │ │
│  │            /app/api/...  (Next.js Route Handlers)          │ │
│  │                                                            │ │
│  │  Auth · Courts · Bookings · Payments · Admin · Reports     │ │
│  └────────────────────────────┬───────────────────────────────┘ │
│                               │                                  │
│  ┌────────────────────────────▼───────────────────────────────┐ │
│  │                   Prisma ORM                                │ │
│  └────────────────────────────┬───────────────────────────────┘ │
└───────────────────────────────┼─────────────────────────────────┘
                                │
                 ┌──────────────▼──────────────┐
                 │       PostgreSQL             │
                 │   (produção: Supabase /      │
                 │    Railway / Neon)            │
                 └─────────────────────────────┘
```

### 3.2 Estrutura de Pastas — MVVM + Clean Architecture

```
arena-beach-serra/
├── prisma/
│   ├── schema.prisma             # Schema de banco de dados
│   ├── migrations/               # Migrations versionadas
│   └── seed.ts                   # Dados iniciais (quadras, admin)
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (client)/             # Route group — portal cliente
│   │   │   ├── layout.tsx        # Layout público com Header/Footer
│   │   │   ├── page.tsx          # Home (ISR - revalidate 60s)
│   │   │   ├── booking/
│   │   │   │   └── [courtId]/
│   │   │   │       └── page.tsx  # SSR - dados frescos da quadra
│   │   │   ├── payment/
│   │   │   │   └── page.tsx      # CSR - formulário de pagamento
│   │   │   ├── booking-success/
│   │   │   │   └── page.tsx
│   │   │   ├── booking-error/
│   │   │   │   └── page.tsx
│   │   │   ├── bookings/
│   │   │   │   └── page.tsx      # SSR - minhas reservas
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/              # Route group — dashboard admin
│   │   │   ├── layout.tsx        # Layout admin com Sidebar
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx      # Dashboard principal (redirect)
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx  # Visão geral com KPIs
│   │   │   │   ├── bookings/
│   │   │   │   │   ├── page.tsx  # Lista de agendamentos
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx # Detalhe do agendamento
│   │   │   │   ├── courts/
│   │   │   │   │   ├── page.tsx  # Gestão de quadras
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── clients/
│   │   │   │   │   └── page.tsx  # Gestão de clientes
│   │   │   │   ├── payments/
│   │   │   │   │   └── page.tsx  # Financeiro + estornos
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx  # Relatórios e gráficos
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │
│   │   ├── api/                  # BFF — Route Handlers
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   ├── courts/
│   │   │   │   ├── route.ts          # GET /api/courts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # GET /api/courts/:id
│   │   │   │       └── availability/
│   │   │   │           └── route.ts  # GET /api/courts/:id/availability
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts          # GET (admin list), POST (criar)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # GET (detalhe), PATCH (status)
│   │   │   │       └── cancel/
│   │   │   │           └── route.ts  # POST (cancelar + estorno)
│   │   │   ├── payments/
│   │   │   │   ├── route.ts          # POST (iniciar pagamento)
│   │   │   │   ├── webhook/
│   │   │   │   │   └── route.ts      # POST (webhook MercadoPago)
│   │   │   │   └── refund/
│   │   │   │       └── route.ts      # POST (estorno manual)
│   │   │   ├── users/
│   │   │   │   └── me/
│   │   │   │       └── route.ts      # GET/PATCH perfil autenticado
│   │   │   └── admin/
│   │   │       ├── stats/
│   │   │       │   └── route.ts      # GET KPIs dashboard
│   │   │       └── reports/
│   │   │           └── route.ts      # GET relatórios
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx            # Root layout (providers, fonts)
│   │
│   ├── core/                     # Camada de domínio puro
│   │   ├── constants/
│   │   │   └── config.ts
│   │   ├── errors/
│   │   │   ├── AppError.ts       # Classe base de erros
│   │   │   ├── BookingError.ts
│   │   │   └── PaymentError.ts
│   │   └── utils/
│   │       ├── formatCurrency.ts
│   │       ├── formatDate.ts
│   │       └── helpers.ts
│   │
│   ├── models/                   # Entidades de domínio
│   │   └── entities/
│   │       ├── Booking.ts
│   │       ├── Court.ts
│   │       ├── Payment.ts
│   │       ├── User.ts
│   │       └── Report.ts
│   │
│   ├── repositories/             # Contrato de acesso a dados
│   │   ├── IBookingRepository.ts
│   │   ├── ICourtRepository.ts
│   │   ├── IPaymentRepository.ts
│   │   └── IUserRepository.ts
│   │
│   ├── infrastructure/           # Implementações concretas
│   │   ├── database/
│   │   │   └── prisma.ts         # Singleton Prisma Client
│   │   ├── repositories/
│   │   │   ├── PrismaBookingRepository.ts
│   │   │   ├── PrismaCourtRepository.ts
│   │   │   ├── PrismaPaymentRepository.ts
│   │   │   └── PrismaUserRepository.ts
│   │   └── payment/
│   │       └── MercadoPagoAdapter.ts
│   │
│   ├── usecases/                 # Casos de uso (regras de negócio)
│   │   ├── bookings/
│   │   │   ├── CreateBookingUseCase.ts
│   │   │   ├── CancelBookingUseCase.ts
│   │   │   ├── ListBookingsUseCase.ts
│   │   │   └── GetBookingDetailsUseCase.ts
│   │   ├── payments/
│   │   │   ├── ProcessPaymentUseCase.ts
│   │   │   └── RefundPaymentUseCase.ts
│   │   └── reports/
│   │       ├── GetDailyReportUseCase.ts
│   │       ├── GetWeeklyReportUseCase.ts
│   │       └── GetMonthlyReportUseCase.ts
│   │
│   ├── viewmodels/               # Hooks de lógica de UI
│   │   ├── client/
│   │   │   ├── useHomeViewModel.ts
│   │   │   ├── useBookingViewModel.ts
│   │   │   ├── usePaymentViewModel.ts
│   │   │   └── useMyBookingsViewModel.ts
│   │   └── admin/
│   │       ├── useDashboardViewModel.ts
│   │       ├── useBookingsAdminViewModel.ts
│   │       ├── usePaymentsAdminViewModel.ts
│   │       └── useReportsViewModel.ts
│   │
│   ├── services/                 # Serviços de aplicação
│   │   ├── BookingService.ts
│   │   ├── PaymentService.ts
│   │   ├── WhatsAppService.ts
│   │   └── NotificationService.ts
│   │
│   └── views/                   # Camada de apresentação
│       ├── components/
│       │   ├── ui/               # Design system primitivos
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Skeleton.tsx
│       │   │   ├── Toast.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── DatePicker.tsx
│       │   │   └── Loader.tsx
│       │   ├── business/         # Componentes de domínio
│       │   │   ├── CourtCard.tsx
│       │   │   ├── BookingCard.tsx
│       │   │   ├── TimeSlotGrid.tsx
│       │   │   ├── PaymentMethodSelector.tsx
│       │   │   └── BookingSummary.tsx
│       │   ├── admin/            # Componentes exclusivos do admin
│       │   │   ├── StatsCard.tsx
│       │   │   ├── BookingTable.tsx
│       │   │   ├── OccupancyChart.tsx
│       │   │   ├── RevenueChart.tsx
│       │   │   ├── CancellationModal.tsx
│       │   │   ├── RefundModal.tsx
│       │   │   └── CalendarView.tsx
│       │   └── layout/
│       │       ├── client/
│       │       │   ├── ClientLayout.tsx
│       │       │   ├── Header.tsx
│       │       │   └── Footer.tsx
│       │       └── admin/
│       │           ├── AdminLayout.tsx
│       │           ├── Sidebar.tsx
│       │           ├── TopBar.tsx
│       │           └── Breadcrumb.tsx
│       └── providers/
│           ├── SessionProvider.tsx
│           ├── QueryProvider.tsx
│           └── ToastProvider.tsx
│
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── fonts/
│
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 3.3 Princípios MVVM + Clean Architecture

```
┌────────────────────────────────────────────────────────────┐
│  VIEW (React Server/Client Components)                      │
│  Responsabilidade: Renderização, eventos de UI              │
│  Não contém lógica de negócio, não acessa DB diretamente   │
├────────────────────────────────────────────────────────────┤
│  VIEWMODEL (Custom Hooks)                                   │
│  Responsabilidade: Estado de UI, formatação, orquestração  │
│  Chama UseCases, não acessa repositório diretamente         │
├────────────────────────────────────────────────────────────┤
│  USE CASES (Application Layer)                              │
│  Responsabilidade: Regras de negócio, validações           │
│  Independente de framework, testável unitariamente          │
├────────────────────────────────────────────────────────────┤
│  REPOSITORIES (Interface)                                   │
│  Responsabilidade: Contrato de acesso a dados               │
│  Abstração que oculta implementação (Prisma, Mock, etc.)   │
├────────────────────────────────────────────────────────────┤
│  INFRASTRUCTURE (Prisma + PostgreSQL)                       │
│  Responsabilidade: Persistência real de dados               │
│  Implementa interfaces dos repositórios                     │
└────────────────────────────────────────────────────────────┘
```

**Regra de dependência:** Camadas externas dependem de internas, nunca o contrário. Use Cases não importam nada de `infrastructure/`.

---

## 4. Modelagem de Dados

### 4.1 Schema Prisma Completo

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USUÁRIOS ──────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  phone         String?
  cpf           String?   @unique
  passwordHash  String?
  role          UserRole  @default(CLIENT)
  status        UserStatus @default(ACTIVE)
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  bookings      Booking[]
  accounts      Account[]
  sessions      Session[]
  auditLogs     AuditLog[]

  @@map("users")
}

enum UserRole {
  CLIENT
  RECEPTIONIST
  MANAGER
  ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BANNED
}

// ─── NEXTAUTH ──────────────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ─── QUADRAS ───────────────────────────────────────────────

model Court {
  id            String     @id @default(cuid())
  name          String
  description   String
  pricePerHour  Decimal    @db.Decimal(10, 2)
  imageUrl      String?
  type          CourtType  @default(REGULAR)
  amenities     String[]
  maxPlayers    Int
  location      String
  isActive      Boolean    @default(true)
  openTime      String     @default("06:00")   // "HH:MM"
  closeTime     String     @default("22:00")   // "HH:MM"
  slotDuration  Int        @default(60)         // minutos
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  bookings      Booking[]
  unavailabilities CourtUnavailability[]

  @@map("courts")
}

enum CourtType {
  REGULAR
  EXCLUSIVE
}

model CourtUnavailability {
  id        String   @id @default(cuid())
  courtId   String
  date      DateTime @db.Date
  reason    String?
  createdAt DateTime @default(now())

  court Court @relation(fields: [courtId], references: [id], onDelete: Cascade)

  @@map("court_unavailabilities")
}

// ─── AGENDAMENTOS ──────────────────────────────────────────

model Booking {
  id            String        @id @default(cuid())
  userId        String
  courtId       String
  date          DateTime      @db.Date
  startTime     String                           // "HH:MM"
  endTime       String                           // "HH:MM"
  durationHours Decimal       @db.Decimal(4, 2)
  totalValue    Decimal       @db.Decimal(10, 2)
  status        BookingStatus @default(PENDING)
  accessCode    String        @unique            // Ex: AB-1234-567890
  notes         String?
  cancelledAt   DateTime?
  cancelReason  String?
  cancelledBy   String?                          // userId do admin
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  user          User          @relation(fields: [userId], references: [id])
  court         Court         @relation(fields: [courtId], references: [id])
  payment       Payment?
  auditLogs     AuditLog[]

  @@index([courtId, date])
  @@index([userId])
  @@index([status])
  @@map("bookings")
}

enum BookingStatus {
  PENDING           // Aguardando pagamento
  CONFIRMED         // Pago e confirmado
  CANCELLED         // Cancelado (com ou sem estorno)
  NO_SHOW           // Não compareceu
  COMPLETED         // Realizado com sucesso
}

// ─── PAGAMENTOS ────────────────────────────────────────────

model Payment {
  id                  String        @id @default(cuid())
  bookingId           String        @unique
  method              PaymentMethod
  status              PaymentStatus @default(PENDING)
  amount              Decimal       @db.Decimal(10, 2)
  gatewayId           String?       // ID no MercadoPago
  gatewayStatus       String?       // Status raw do gateway
  pixQrCode           String?       // QR Code Pix
  pixQrCodeBase64     String?
  pixExpiration       DateTime?
  cardLastFour        String?
  cardBrand           String?
  installments        Int           @default(1)
  paidAt              DateTime?
  refundedAt          DateTime?
  refundedBy          String?       // userId do admin
  refundAmount        Decimal?      @db.Decimal(10, 2)
  refundGatewayId     String?
  refundReason        String?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  booking             Booking       @relation(fields: [bookingId], references: [id])

  @@map("payments")
}

enum PaymentMethod {
  PIX
  CREDIT_CARD
  DEBIT_CARD
}

enum PaymentStatus {
  PENDING           // Aguardando
  PROCESSING        // Processando
  APPROVED          // Aprovado
  REJECTED          // Rejeitado
  CANCELLED         // Cancelado
  REFUNDED          // Estornado totalmente
  PARTIAL_REFUND    // Estorno parcial
  EXPIRED           // Pix expirado
}

// ─── AUDITORIA ─────────────────────────────────────────────

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  bookingId  String?
  action     String   // "BOOKING_CREATED", "PAYMENT_APPROVED", etc.
  entityType String   // "Booking", "Payment", "Court"
  entityId   String
  oldData    Json?
  newData    Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  user    User?    @relation(fields: [userId], references: [id])
  booking Booking? @relation(fields: [bookingId], references: [id])

  @@index([entityType, entityId])
  @@index([userId])
  @@map("audit_logs")
}
```

### 4.2 Relacionamentos

```
User (1) ──────── (N) Booking
Court (1) ─────── (N) Booking
Booking (1) ───── (1) Payment
Booking (1) ───── (N) AuditLog
User (1) ──────── (N) AuditLog
Court (1) ─────── (N) CourtUnavailability
```

### 4.3 Índices de Performance

- `bookings(courtId, date)` — Consultas de disponibilidade por quadra/data
- `bookings(userId)` — Minhas reservas
- `bookings(status)` — Filtros de status no dashboard
- `audit_logs(entityType, entityId)` — Histórico por entidade

---

## 5. Backend BFF + Prisma

### 5.1 Stack de Dependências

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^6.0.0",
    "next-auth": "^5.0.0",
    "mercadopago": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.23.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0",
    "recharts": "^2.12.0",
    "bcryptjs": "^2.4.3",
    "cuid2": "^2.2.2"
  },
  "devDependencies": {
    "prisma": "^6.0.0",
    "typescript": "^5.8.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/bcryptjs": "^2.4.6",
    "tailwindcss": "^4.0.0"
  }
}
```

### 5.2 Endpoints BFF

#### Courts

```
GET  /api/courts
  Query: type?, isActive?
  Auth: public
  Cache: ISR 60s
  Response: Court[]

GET  /api/courts/:id
  Auth: public
  Response: Court

GET  /api/courts/:id/availability
  Query: date (YYYY-MM-DD) required
  Auth: public (client JWT opcional)
  Response: { date, slots: TimeSlot[] }
  Lógica: 
    1. Busca bookings CONFIRMED/PENDING para courtId+date
    2. Busca CourtUnavailability para courtId+date
    3. Gera slots de openTime a closeTime com slotDuration
    4. Marca available: false para slots ocupados

POST /api/courts (admin)
PUT  /api/courts/:id (admin)
DELETE /api/courts/:id (admin)
```

#### Bookings

```
POST /api/bookings
  Auth: cliente autenticado
  Body: { courtId, date, startTime, endTime }
  Lógica:
    1. Validar com Zod
    2. Verificar disponibilidade (sem concorrência — transação Prisma)
    3. Calcular totalValue = pricePerHour * duration
    4. Gerar accessCode único
    5. Criar Booking com status PENDING
    6. Criar Payment com status PENDING
    7. Iniciar pagamento no MercadoPago
    8. Retornar bookingId + paymentData (QR Pix ou form card)
  Response: { booking, payment }

GET  /api/bookings
  Auth: admin (MANAGER, ADMIN)
  Query: status?, courtId?, date?, userId?, page?, limit?
  Response: { bookings: BookingWithDetails[], total, page }

GET  /api/bookings/my
  Auth: cliente autenticado
  Query: status?, page?, limit?
  Response: { bookings: BookingWithDetails[], total }

GET  /api/bookings/:id
  Auth: dono do booking OU admin
  Response: BookingWithDetails (inclui payment e court)

POST /api/bookings/:id/cancel
  Auth: dono do booking OU admin
  Body: { reason?, refund: boolean }
  Lógica:
    1. Verificar status atual (só PENDING ou CONFIRMED)
    2. Verificar política de cancelamento:
       - > 24h antes: estorno total permitido
       - < 24h antes: admin decide manualmente
    3. Se refund=true e payment APPROVED:
       a. Chamar MercadoPago refund API
       b. Atualizar Payment.status = REFUNDED
       c. Registrar refundGatewayId, refundedAt, refundedBy
    4. Atualizar Booking.status = CANCELLED
    5. Registrar no AuditLog
    6. (futuro) Disparar notificação ao cliente
  Response: { booking, refundResult }
```

#### Payments

```
POST /api/payments/webhook
  Auth: signature validation MercadoPago
  Body: MercadoPago notification payload
  Lógica:
    1. Validar assinatura do webhook
    2. Buscar Payment pelo gatewayId
    3. Atualizar Payment.status conforme evento
    4. Se APPROVED: atualizar Booking.status = CONFIRMED
    5. Se REJECTED/EXPIRED: manter Booking PENDING (cliente pode tentar de novo)
    6. Registrar AuditLog
  Response: 200 OK (sempre, para evitar retry do gateway)

POST /api/payments/refund (admin)
  Auth: MANAGER, ADMIN
  Body: { bookingId, reason, amount? }
  Lógica:
    1. Buscar Payment pelo bookingId
    2. Verificar que status = APPROVED
    3. Chamar MercadoPago refunds API
    4. Atualizar Payment.status = REFUNDED ou PARTIAL_REFUND
    5. Atualizar Booking.status = CANCELLED
    6. AuditLog com userId do admin
  Response: { refund, booking, payment }
```

#### Admin Stats

```
GET /api/admin/stats
  Auth: MANAGER, ADMIN
  Query: period (daily|weekly|monthly), date?
  Response:
    {
      totalBookings: number,
      confirmedBookings: number,
      cancelledBookings: number,
      totalRevenue: number,
      refundedAmount: number,
      netRevenue: number,
      occupancyRate: number,       // %
      topCourt: { id, name, count },
      bookingsByHour: { hour, count }[],  // para gráfico diário
      bookingsByDay: { day, count }[],    // para gráfico semanal
      bookingsByWeek: { week, count }[]   // para gráfico mensal
    }

GET /api/admin/reports
  Auth: MANAGER, ADMIN
  Query: startDate, endDate, courtId?, format (json|csv)
  Response: Relatório detalhado de agendamentos no período
```

### 5.3 Camada de Use Cases

#### CreateBookingUseCase

```typescript
// src/usecases/bookings/CreateBookingUseCase.ts

interface CreateBookingInput {
  userId: string
  courtId: string
  date: string       // "YYYY-MM-DD"
  startTime: string  // "HH:MM"
  endTime: string    // "HH:MM"
  paymentMethod: PaymentMethod
}

interface CreateBookingOutput {
  booking: Booking
  payment: Payment
  paymentData: PixData | CardData
}

class CreateBookingUseCase {
  constructor(
    private bookingRepo: IBookingRepository,
    private courtRepo: ICourtRepository,
    private paymentRepo: IPaymentRepository,
    private paymentGateway: IPaymentGateway
  ) {}

  async execute(input: CreateBookingInput): Promise<CreateBookingOutput> {
    // 1. Buscar quadra
    const court = await this.courtRepo.findById(input.courtId)
    if (!court || !court.isActive) throw new BookingError('COURT_NOT_FOUND')

    // 2. Verificar disponibilidade (transação)
    const isAvailable = await this.bookingRepo.checkAvailability(
      input.courtId, input.date, input.startTime, input.endTime
    )
    if (!isAvailable) throw new BookingError('SLOT_NOT_AVAILABLE')

    // 3. Calcular valor
    const duration = calculateDuration(input.startTime, input.endTime)
    const totalValue = court.pricePerHour.times(duration)

    // 4. Criar agendamento
    const booking = await this.bookingRepo.create({
      userId: input.userId,
      courtId: input.courtId,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      durationHours: duration,
      totalValue,
      status: BookingStatus.PENDING,
      accessCode: generateAccessCode()
    })

    // 5. Iniciar pagamento
    const paymentData = await this.paymentGateway.createPayment({
      bookingId: booking.id,
      amount: totalValue,
      method: input.paymentMethod,
      description: `Arena Beach Serra - ${court.name} ${input.date}`
    })

    const payment = await this.paymentRepo.create({
      bookingId: booking.id,
      method: input.paymentMethod,
      amount: totalValue,
      gatewayId: paymentData.gatewayId,
      ...paymentData
    })

    return { booking, payment, paymentData }
  }
}
```

#### CancelBookingUseCase

```typescript
// src/usecases/bookings/CancelBookingUseCase.ts

interface CancelBookingInput {
  bookingId: string
  cancelledBy: string     // userId
  reason: string
  refund: boolean
  isAdmin: boolean
}

class CancelBookingUseCase {
  async execute(input: CancelBookingInput): Promise<CancelBookingOutput> {
    const booking = await this.bookingRepo.findById(input.bookingId)
    
    if (!booking) throw new BookingError('BOOKING_NOT_FOUND')
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new BookingError('BOOKING_NOT_CANCELLABLE')
    }
    
    // Verificar autorização
    if (!input.isAdmin && booking.userId !== input.cancelledBy) {
      throw new BookingError('UNAUTHORIZED')
    }

    let refundResult = null

    // Processar estorno se solicitado
    if (input.refund && booking.payment?.status === PaymentStatus.APPROVED) {
      refundResult = await this.paymentGateway.refund({
        gatewayId: booking.payment.gatewayId,
        amount: booking.payment.amount,
        reason: input.reason
      })

      await this.paymentRepo.update(booking.payment.id, {
        status: PaymentStatus.REFUNDED,
        refundedAt: new Date(),
        refundedBy: input.cancelledBy,
        refundGatewayId: refundResult.id,
        refundReason: input.reason
      })
    }

    const updatedBooking = await this.bookingRepo.update(booking.id, {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelReason: input.reason,
      cancelledBy: input.cancelledBy
    })

    await this.auditRepo.create({
      userId: input.cancelledBy,
      bookingId: booking.id,
      action: 'BOOKING_CANCELLED',
      entityType: 'Booking',
      entityId: booking.id,
      oldData: { status: booking.status },
      newData: { status: BookingStatus.CANCELLED, refund: input.refund }
    })

    return { booking: updatedBooking, refundResult }
  }
}
```

### 5.4 Política de Cancelamento e Estorno

| Cenário | Ação Permitida |
|---------|----------------|
| Cancelamento > 24h antes | Estorno total automático via API |
| Cancelamento 12–24h antes | Estorno permitido, aprovação manual |
| Cancelamento < 12h antes | Sem estorno (crédito em conta futuro, v2) |
| No-show | Sem estorno, admin marca manualmente |
| Erro de pagamento | Estorno automático se capturado |

Configuração editável no painel admin em `settings`.

---

## 6. Portal do Cliente — Next.js SSR

### 6.1 Estratégias de Renderização por Página

| Página | Estratégia | Justificativa |
|--------|-----------|---------------|
| `/` (Home) | ISR (revalidate: 60s) | SEO + performance, dados mudam pouco |
| `/booking/[courtId]` | SSR | Disponibilidade em tempo real |
| `/payment` | CSR | Formulário interativo, sem necessidade de SSR |
| `/booking-success` | CSR | Estado do redirect, não indexável |
| `/bookings` | SSR (auth) | Dados do usuário, não indexável |
| `/profile` | CSR | Formulário de perfil |
| `/contact` | SSG | Conteúdo estático |

### 6.2 Fluxo de Agendamento Atualizado

```
[Tela] Home (ISR)
  → Server Component carrega lista de quadras via Prisma
  → CourtCard com link para /booking/[courtId]
  → Badge "Disponível hoje" calculado no server

[Tela] /booking/[courtId] (SSR)
  → Server Component: busca dados da quadra
  → Client Component: DatePicker (7 dias)
  → Client Component: ao selecionar data → fetch /api/courts/:id/availability
  → Client Component: TimeSlotGrid com horários disponíveis
  → Ao confirmar: redirect para /payment com estado via URL params

[Tela] /payment (CSR)
  → Ler courtId, date, startTime, endTime da query string
  → usePaymentViewModel: gerencia método, campos do cartão
  → POST /api/bookings (cria booking + inicia pagamento)
  → Pix: exibe QR + polling de status via /api/payments/:gatewayId/status
  → Cartão: formulário → POST → aguarda resposta síncrona
  → Redirect para /booking-success ou /booking-error

[Tela] /booking-success (CSR)
  → Lê bookingId da query string
  → Busca detalhes via GET /api/bookings/:id
  → Exibe ticket com accessCode, quadra, data, horário
```

### 6.3 ViewModels do Portal

```typescript
// useBookingViewModel.ts
export function useBookingViewModel(courtId: string) {
  const [selectedDate, setSelectedDate] = useState<string>()
  const [selectedSlot, setSelectedSlot] = useState<string>()
  const router = useRouter()

  const { data: court } = useQuery({
    queryKey: ['court', courtId],
    queryFn: () => fetch(`/api/courts/${courtId}`).then(r => r.json())
  })

  const { data: availability, isLoading: loadingSlots } = useQuery({
    queryKey: ['availability', courtId, selectedDate],
    queryFn: () => fetch(`/api/courts/${courtId}/availability?date=${selectedDate}`).then(r => r.json()),
    enabled: !!selectedDate
  })

  const proceed = () => {
    if (!selectedDate || !selectedSlot) return
    router.push(`/payment?courtId=${courtId}&date=${selectedDate}&startTime=${selectedSlot}`)
  }

  return { court, availability, loadingSlots, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, proceed }
}

// usePaymentViewModel.ts
export function usePaymentViewModel() {
  const searchParams = useSearchParams()
  const [method, setMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { mutateAsync: createBooking } = useMutation(...)

  const submit = async (formData: PaymentFormData) => {
    setIsLoading(true)
    const { booking, paymentData } = await createBooking({
      courtId: searchParams.get('courtId'),
      date: searchParams.get('date'),
      startTime: searchParams.get('startTime'),
      paymentMethod: method,
      ...formData
    })
    
    if (method === 'PIX') {
      // Mostrar QR e começar polling
      startPixPolling(paymentData.gatewayId, booking.id)
    } else {
      if (paymentData.status === 'APPROVED') {
        router.push(`/booking-success?bookingId=${booking.id}`)
      } else {
        router.push(`/booking-error?code=${paymentData.errorCode}`)
      }
    }
    setIsLoading(false)
  }

  return { method, setMethod, submit, isLoading }
}
```

---

## 7. Dashboard Administrativo

### 7.1 Visão Geral do Dashboard

O dashboard admin é um painel **Server-first** com atualizações em tempo real via React Query (polling a cada 30s).

#### Layout Geral

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR                                                  │
│  [≡ Menu] Arena Beach Serra Admin    [👤 Admin] [🔔 3]  │
├──────────┬──────────────────────────────────────────────┤
│          │                                               │
│ SIDEBAR  │  CONTEÚDO PRINCIPAL                          │
│          │                                               │
│ 📊 Dashboard       │                                    │
│ 📅 Agendamentos   │                                    │
│ 🏖 Quadras        │                                    │
│ 👥 Clientes       │                                    │
│ 💳 Financeiro     │                                    │
│ 📈 Relatórios     │                                    │
│ ⚙️  Configurações  │                                    │
│          │                                               │
└──────────┴──────────────────────────────────────────────┘
```

### 7.2 Página: Dashboard Principal (`/admin/dashboard`)

#### KPIs do Dia (cards no topo)

```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Agendamentos   │ │  Receita Bruta │ │  Cancelamentos │ │  Taxa Ocup.    │
│ Hoje           │ │  Hoje          │ │  Hoje          │ │  Hoje          │
│                │ │                │ │                │ │                │
│   12           │ │  R$ 1.140,00   │ │    2 (-16,7%)  │ │    73%         │
│ ↑ +3 ontem     │ │ ↑ +12% ontem   │ │ ↓ -1 ontem     │ │ ↑ +8% ontem    │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
```

#### Gráfico de Ocupação por Hora (hoje)

```
Horário    Quadra 01   Quadra 02   Laje BS
06:00      ████████    ░░░░░░░░    ─────────
07:00      ████████    ████████    ─────────
08:00      ░░░░░░░░    ████████    ─────────
09:00      ████████    ░░░░░░░░    ─────────
...
```
Gráfico de barras horizontal por hora do dia (Recharts).
Cores: marrom = ocupado, bege = livre, cinza = indisponível.

#### Próximos Agendamentos (hoje, linha do tempo)

Lista cronológica de todos os agendamentos do dia com:
- Avatar do cliente
- Nome, quadra, horário
- Status badge (confirmado, pendente, cancelado)
- Botão de ação rápida: "Cancelar" ou "Confirmar No-show"

#### Alertas e Notificações

- Pagamentos pendentes há > 30 minutos
- Agendamentos sem confirmação de pagamento
- Tentativas de pagamento falhas

### 7.3 Página: Agendamentos (`/admin/bookings`)

#### Filtros

```
[📅 Data: Hoje ▼]  [🏖 Todas as Quadras ▼]  [⚡ Status: Todos ▼]  [🔍 Buscar cliente...]
                                                                      [+ Novo Agendamento]
```

#### Tabela de Agendamentos

| # | Cliente | Quadra | Data | Horário | Valor | Status | Pagamento | Ações |
|---|---------|--------|------|---------|-------|--------|-----------|-------|
| 001 | João Silva | Quadra 01 | 29/04 | 08:00 | R$ 80 | ✅ Confirmado | Pix | [👁] [❌] |
| 002 | Maria S. | Quadra 02 | 29/04 | 09:00 | R$ 95 | ⏱ Pendente | Cartão | [👁] [❌] |
| 003 | Carlos L. | Quadra 01 | 29/04 | 10:00 | R$ 80 | ❌ Cancelado | Pix | [👁] [↩] |

**Paginação:** 20 itens por página, com lazy load.

#### Detalhe do Agendamento (`/admin/bookings/:id`)

Página completa com:
- Dados do agendamento (quadra, data, horário, valor)
- Dados do cliente (nome, email, telefone, histórico)
- Timeline de status com timestamps e responsáveis
- Dados do pagamento (método, gateway ID, status)
- Botão "Cancelar Agendamento" com modal de confirmação
- Botão "Processar Estorno" (se pagamento aprovado)
- Histórico de auditoria (AuditLog)

#### Modal de Cancelamento

```
┌─────────────────────────────────────────────┐
│  Cancelar Agendamento                     ✕ │
│                                             │
│  Agendamento: Quadra 01 — 29/04 08:00      │
│  Cliente: João Silva                        │
│  Valor pago: R$ 80,00 via Pix              │
│                                             │
│  Motivo do cancelamento *                   │
│  [________________________________]         │
│                                             │
│  Processar estorno? ○ Sim  ● Não            │
│                                             │
│  Valor do estorno: R$ 80,00 (total)        │
│                                             │
│  [Cancelar sem estorno] [Cancelar + Estornar]│
└─────────────────────────────────────────────┘
```

### 7.4 Página: Financeiro (`/admin/payments`)

#### Resumo Financeiro (período selecionável)

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Receita Bruta│ │  Estornos    │ │ Receita Líq. │ │ Ticket Médio │
│ R$ 8.450,00  │ │ R$ 380,00   │ │ R$ 8.070,00  │ │ R$ 87,50     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

#### Gráfico de Receita (período)

Gráfico de linha/barras mostrando receita diária no período selecionado.
Linha secundária: cancelamentos/estornos.

#### Lista de Transações

| Data | Cliente | Quadra | Método | Valor | Status | Ações |
|------|---------|--------|--------|-------|--------|-------|
| 29/04 08:32 | João Silva | Quadra 01 | Pix | R$ 80,00 | ✅ Aprovado | [Estornar] |
| 29/04 09:15 | Maria S. | Quadra 02 | Cartão | R$ 95,00 | ✅ Aprovado | [Estornar] |
| 29/04 10:02 | Carlos L. | Quadra 01 | Pix | R$ 80,00 | ↩ Estornado | [Ver] |

#### Modal de Estorno Manual

```
┌──────────────────────────────────────────────┐
│  Processar Estorno                         ✕ │
│                                              │
│  Transação: João Silva — R$ 80,00 (Pix)     │
│  Gateway ID: PAY-12345678                    │
│                                              │
│  Tipo de estorno                             │
│  ● Total  ○ Parcial                          │
│                                              │
│  Valor do estorno: R$ [80,00]               │
│                                              │
│  Motivo *                                    │
│  [________________________________]          │
│                                              │
│  ⚠ Esta ação é irreversível                 │
│                                              │
│  [Cancelar]         [Confirmar Estorno]      │
└──────────────────────────────────────────────┘
```

### 7.5 Página: Relatórios (`/admin/reports`)

#### Visão Diária

- Gráfico de barras: agendamentos por hora
- Gráfico de pizza: ocupação por quadra
- Tabela de agendamentos do dia com totais

#### Visão Semanal

- Gráfico de barras: agendamentos por dia da semana
- Linha de tendência de receita
- Comparativo: semana atual vs semana anterior
- Quadra mais popular da semana

#### Visão Mensal

- Gráfico de área: receita acumulada no mês
- Heatmap de ocupação (dia x hora)
- Ranking de clientes (top 10 por volume)
- Taxa de cancelamento por quadra
- Exportação CSV

#### Filtros e Exportação

```
[Período: ● Diário ○ Semanal ○ Mensal]
[Data início: 01/04/2026] [Data fim: 30/04/2026]
[Quadra: Todas ▼]
[🔄 Atualizar]  [📥 Exportar CSV]
```

### 7.6 ViewModel do Dashboard

```typescript
// src/viewmodels/admin/useDashboardViewModel.ts

export function useDashboardViewModel() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats', period, selectedDate],
    queryFn: () => fetch(`/api/admin/stats?period=${period}&date=${formatDate(selectedDate)}`).then(r => r.json()),
    refetchInterval: 30_000  // atualiza a cada 30s
  })

  const kpis = useMemo(() => {
    if (!stats) return null
    return {
      totalBookings: stats.totalBookings,
      confirmedBookings: stats.confirmedBookings,
      cancelledBookings: stats.cancelledBookings,
      cancellationRate: (stats.cancelledBookings / stats.totalBookings * 100).toFixed(1),
      totalRevenue: formatCurrency(stats.totalRevenue),
      refundedAmount: formatCurrency(stats.refundedAmount),
      netRevenue: formatCurrency(stats.netRevenue),
      occupancyRate: `${stats.occupancyRate.toFixed(0)}%`
    }
  }, [stats])

  return { period, setPeriod, selectedDate, setSelectedDate, stats, kpis, isLoading }
}
```

### 7.7 ViewModel de Cancelamento

```typescript
// src/viewmodels/admin/useCancelBookingViewModel.ts

export function useCancelBookingViewModel(bookingId: string) {
  const [reason, setReason] = useState('')
  const [refund, setRefund] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const toast = useToast()

  const cancel = async () => {
    if (!reason.trim()) {
      toast.error('Informe o motivo do cancelamento')
      return
    }
    
    setIsLoading(true)
    try {
      const result = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, refund })
      }).then(r => r.json())

      toast.success(refund ? 'Agendamento cancelado e estorno processado' : 'Agendamento cancelado')
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      return result
    } catch (error) {
      toast.error('Erro ao cancelar. Tente novamente.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { reason, setReason, refund, setRefund, cancel, isLoading }
}
```

---

## 8. Design System

### 8.1 Manutenção da Identidade Visual

O Design System existente é preservado **integralmente**. Toda a paleta, tipografia e tokens são migrados para CSS Variables no `globals.css` do Next.js.

### 8.2 Tokens CSS Preservados

```css
/* src/app/globals.css */
:root {
  /* Cores Primárias — preservadas */
  --color-primary: #624325;
  --color-on-primary: #ffffff;
  --color-primary-container: #7d5a3a;
  --color-on-primary-container: #ffd5b3;

  /* Cores Secundárias — preservadas */
  --color-secondary: #6b5c41;
  --color-secondary-container: #f2ddba;
  --color-on-secondary-container: #706145;

  /* Superfícies — preservadas */
  --color-surface: #fff8f5;
  --color-on-surface: #1f1b17;
  --color-surface-container: #f6ece5;
  --color-surface-container-low: #fcf2eb;
  --color-surface-container-high: #f1e6e0;

  /* Contornos — preservados */
  --color-outline: #82756b;
  --color-outline-variant: #d3c4b8;

  /* Integrações — preservadas */
  --color-whatsapp: #25D366;

  /* Raios — preservados */
  --radius-xl: 1.5rem;
  --radius-lg: 1rem;

  /* Novos tokens para admin */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;
  --sidebar-width: 256px;
}
```

### 8.3 Tipografia — Preservada

```typescript
// src/app/layout.tsx (root)
import { Lexend, Be_Vietnam_Pro } from 'next/font/google'

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-lexend'
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-be-vietnam'
})
```

### 8.4 Novos Componentes Admin

**StatsCard** — Card de KPI com variante de cor, valor, label e delta (↑↓)

**BookingTable** — Tabela responsiva com sort, filtros e paginação server-side

**OccupancyChart** — Heatmap usando Recharts, paleta marrom do design system

**RevenueChart** — Gráfico de linha/barras com Recharts, responsivo

**CancellationModal** — Modal com confirmação em 2 passos (prevenir acidental)

**RefundModal** — Modal com toggle estorno total/parcial e campo de motivo

**CalendarView** — Visão de calendário com agendamentos por dia (tipo agenda)

**Sidebar** — Navegação lateral colapsável, ícones Lucide, estados active/hover no tema marrom

### 8.5 Componentes UI Base (novos/atualizados)

```typescript
// Todos mantêm a aparência atual — apenas tipagem e API melhoradas

Input         // Novo: label, error, leftIcon, rightIcon, required
Select        // Novo: options array, placeholder
DatePicker    // Novo: min, max, locale pt-BR
Modal         // Novo: size sm/md/lg, onClose, backdrop click
Toast         // Novo: success/error/info/warning, auto-dismiss
Badge         // Existente: +variante success/warning/danger
Skeleton      // Novo: shape card/text/avatar
Pagination    // Novo: page, totalPages, onChange
```

---

## 9. Segurança e Autenticação

### 9.1 NextAuth.js v5

```typescript
// src/app/api/auth/[...nextauth]/route.ts
// src/auth.ts

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user || !user.passwordHash) return null
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
})
```

### 9.2 Middleware de Autenticação

```typescript
// middleware.ts
export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin')

  // Rotas admin requerem autenticação + role MANAGER ou ADMIN
  if (isAdminRoute || isApiAdminRoute) {
    if (!req.auth) return NextResponse.redirect(new URL('/login', req.url))
    if (!['MANAGER', 'ADMIN'].includes(req.auth.user.role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Rotas cliente protegidas
  const protectedClientRoutes = ['/bookings', '/profile', '/payment']
  if (protectedClientRoutes.some(r => req.nextUrl.pathname.startsWith(r))) {
    if (!req.auth) return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)']
}
```

### 9.3 Validação de Input (Zod)

```typescript
// Todos os endpoints BFF validam com Zod antes de processar

const CreateBookingSchema = z.object({
  courtId: z.string().cuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD'])
})

const CancelBookingSchema = z.object({
  reason: z.string().min(10, 'Mínimo 10 caracteres').max(500),
  refund: z.boolean()
})
```

### 9.4 Segurança Adicional

- CSRF: NextAuth gerencia automaticamente
- Rate limiting: middleware no Route Handler (max 10 req/min por IP para criação de bookings)
- Webhook MercadoPago: validação de assinatura HMAC-SHA256
- SQL Injection: impossível via Prisma (prepared statements)
- XSS: React escapa por padrão, `dangerouslySetInnerHTML` proibido

---

## 10. Infraestrutura e Deploy

### 10.1 Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL="postgresql://user:pass@host:5432/arenabeach"

# NextAuth
NEXTAUTH_URL="https://arenabeach.com.br"
NEXTAUTH_SECRET="<secret-32-chars>"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_PUBLIC_KEY=""
MERCADOPAGO_WEBHOOK_SECRET=""

# App
NEXT_PUBLIC_APP_URL="https://arenabeach.com.br"
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999999999"
```

### 10.2 Banco de Dados

**Desenvolvimento:** PostgreSQL local via Docker

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: arenabeach
      POSTGRES_USER: arena
      POSTGRES_PASSWORD: arenadev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
```

**Produção:** Supabase (recomendado) ou Railway

### 10.3 Deploy

**Plataforma:** Vercel (Next.js nativo, zero config)

```
GitHub main branch → Vercel CI → Preview Deploy → Produção
```

**Scripts Prisma:**
```bash
npx prisma migrate dev    # desenvolvimento
npx prisma migrate deploy # produção (CI/CD)
npx prisma db seed        # dados iniciais
npx prisma studio         # GUI do banco
```

---

## 11. Cronograma e Fases

### Fase 1 — Fundação (2 semanas)

| Task | Descrição |
|------|-----------|
| 1.1 | Setup Next.js 15 + TypeScript + Tailwind + estrutura de pastas |
| 1.2 | Setup Prisma + PostgreSQL + migrations iniciais |
| 1.3 | Setup NextAuth.js v5 com Credentials + Google |
| 1.4 | Migrar Design System (tokens CSS, tipografia, componentes base) |
| 1.5 | Implementar Layout (Header, Footer, Sidebar admin) |
| 1.6 | Seed de dados iniciais (3 quadras + admin user) |

### Fase 2 — Portal do Cliente (2 semanas)

| Task | Descrição |
|------|-----------|
| 2.1 | Home Page (ISR) com listagem real de quadras |
| 2.2 | Booking Page (SSR) + disponibilidade real |
| 2.3 | Payment Page (CSR) + integração MercadoPago Pix |
| 2.4 | Payment Page + MercadoPago Cartão de Crédito |
| 2.5 | Webhook de confirmação de pagamento |
| 2.6 | Success/Error Pages |
| 2.7 | My Bookings Page (SSR) |
| 2.8 | Profile Page + cancelamento pelo cliente |

### Fase 3 — Dashboard Admin (2 semanas)

| Task | Descrição |
|------|-----------|
| 3.1 | Layout Admin + Sidebar + TopBar |
| 3.2 | Dashboard com KPIs diários |
| 3.3 | Página de Agendamentos com filtros + tabela paginada |
| 3.4 | Detalhe do Agendamento + timeline de status |
| 3.5 | Cancelamento de agendamento pelo admin (com/sem estorno) |
| 3.6 | Estorno manual via admin (MercadoPago refund API) |
| 3.7 | Página Financeiro com lista de transações |
| 3.8 | Relatórios diário / semanal / mensal + gráficos |
| 3.9 | Exportação CSV de relatórios |

### Fase 4 — Qualidade e Produção (1 semana)

| Task | Descrição |
|------|-----------|
| 4.1 | Testes de integração dos casos de uso críticos |
| 4.2 | Rate limiting + segurança dos endpoints |
| 4.3 | Otimização de performance (Core Web Vitals) |
| 4.4 | SEO meta tags + Open Graph |
| 4.5 | Deploy produção (Vercel + Supabase) |
| 4.6 | Monitoramento (Sentry ou LogRocket) |

**Estimativa total:** 7 semanas de desenvolvimento

---

## 12. Requisitos Não-Funcionais

### 12.1 Performance

| Métrica | Alvo |
|---------|------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| TTI (Time to Interactive) | < 3.5s |
| Resposta API (p50) | < 150ms |
| Resposta API (p95) | < 300ms |
| Resposta API (p99) | < 500ms |

### 12.2 Escalabilidade

- Suporte a 50 agendamentos simultâneos sem degradação
- PostgreSQL com connection pooling (PgBouncer ou Prisma Accelerate)
- ISR garante que home page aguente picos sem estressar DB
- Booking usa transação Prisma para evitar double-booking

### 12.3 Disponibilidade

- Deploy na Vercel garante ≥ 99.99% uptime para SSG/ISR
- PostgreSQL: Supabase oferece ≥ 99.9% SLA

### 12.4 Observabilidade

- Logs estruturados em todos os Route Handlers
- AuditLog no DB para todas as ações críticas
- Sentry para captura de erros em produção
- Analytics: Google Analytics 4 ou Vercel Analytics

### 12.5 Manutenibilidade

- 100% TypeScript strict mode
- Zod para validação de schema em runtime
- Testes unitários nos Use Cases (sem depender de framework)
- Convenção de nomenclatura documentada
- Prisma migrations versionadas no Git

### 12.6 Acessibilidade

- WCAG 2.1 AA nos componentes novos
- Labels em todos os inputs
- Contraste mínimo 4.5:1 (já satisfeito pelo design atual)
- Navegação por teclado em modais e formulários

---

## Apêndice A — Decisões de Arquitetura

| Decisão | Alternativas consideradas | Justificativa |
|---------|--------------------------|---------------|
| Next.js App Router | Pages Router, Remix | SSR/ISR nativos, Server Components, futuro do framework |
| Prisma | Drizzle, TypeORM, Knex | DX superior, type safety, migrations versionadas |
| PostgreSQL | MySQL, SQLite, MongoDB | Relacional, transações ACID para booking, amplamente suportado |
| NextAuth.js v5 | Clerk, Auth0, Supabase Auth | Open-source, integrado ao Next.js, sem custo adicional |
| MercadoPago | Stripe, PagSeguro | Líder no Brasil, Pix nativo, PIX QR Code, sandbox gratuito |
| TanStack Query | SWR, Zustand + fetch | Cache inteligente, invalidação granular, DevTools |
| Recharts | Chart.js, Tremor, Victory | Baseado em SVG, componível, React-first |
| Zod | Yup, Joi, Valibot | Performance, inference TS, usado pelo tRPC/Next.js |

## Apêndice B — Glossário

| Termo | Definição |
|-------|-----------|
| BFF | Backend for Frontend — API co-localizada no Next.js, serve apenas este frontend |
| ISR | Incremental Static Regeneration — página estática que revalida em background |
| SSR | Server-Side Rendering — renderizado por requisição no servidor |
| MVVM | Model-View-ViewModel — separação entre UI (View), lógica de UI (ViewModel) e dados (Model) |
| Estorno | Devolução de valor ao cliente após cancelamento de transação aprovada |
| Slot | Janela de tempo disponível para agendamento em uma quadra |
| Access Code | Código alfanumérico único gerado por reserva confirmada (ex: AB-1234-567890) |
| Webhook | Callback HTTP enviado pelo MercadoPago para confirmar eventos de pagamento |
| AuditLog | Registro imutável de todas as ações críticas do sistema |

---

*Documento gerado para o projeto Arena Beach Serra. Versão 1.0 — 2026-04-29*
