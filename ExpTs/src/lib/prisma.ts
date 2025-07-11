// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declara a variável prisma fora do if para que ela possa ser acessada globalmente
let prisma: PrismaClient;

// Verifica se já existe uma instância do PrismaClient em produção
// Isso evita que múltiplas instâncias sejam criadas em ambientes de desenvolvimento
// (hot-reloading) onde o módulo pode ser importado várias vezes.
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Em desenvolvimento, anexa a instância ao objeto global para reutilização
  // Isso é um truque para hot-reloading em frameworks como Next.js, mas útil
  // também para ts-node com nodemon.
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export default prisma;