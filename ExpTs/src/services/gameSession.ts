// src/services/gameSession.ts
import { PrismaClient, GameSession } from '@prisma/client';

import prisma from '../lib/prisma';

export const createGameSession = async (userId: string, score: number): Promise<GameSession> => {
    return await prisma.gameSession.create({
        data: {
            score,
            userId,
        },
    });
};

// O tipo de retorno deve ser inferido corretamente após as correções e prisma generate
export const getTopScores = async (limit: number = 10): Promise<Array<GameSession & { user: { name: string; email: string; } }>> => {
    const topScores = await prisma.gameSession.findMany({
        orderBy: [
            { score: 'desc' }, // Principalmente ordenar por score descendente
            { playedAt: 'desc' } // MUDANÇA AQUI: Usar 'playedAt' como no seu schema.prisma
        ],
        distinct: ['userId'], // Garante que cada usuário apareça apenas uma vez (com sua maior pontuação)
        take: limit, // Limita o número de resultados (top 10)
        include: {
            user: { // Inclui os dados do usuário relacionados
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });

    // O retorno do findMany com distinct e include já deve estar corretamente tipado
    // como GameSession & { user: ... }.
    return topScores as Array<GameSession & { user: { name: string; email: string; } }>;
};