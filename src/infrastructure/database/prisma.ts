import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// Em dev, reutiliza a mesma instância entre hot-reloads.
// Em produção (Vercel serverless), cada função tem sua própria instância
// — use DIRECT_URL + DATABASE_URL com PgBouncer no banco hospedado.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
