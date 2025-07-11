// src/services/gameSession.ts
import { PrismaClient, GameSession } from '@prisma/client';
import { GameSessionCreateDto } from '../types/gameSession';

const prisma = new PrismaClient();

export const createGameSession = async (userId: string, score: number): Promise<GameSession> => {
    return await prisma.gameSession.create({
        data: {
            score,
            userId,
        },
    });
};

export const getTopScores = async (limit: number = 10): Promise<GameSession[]> => {
    [cite_start]// [cite: 1954, 1955]
    // Fetch distinct users with their highest score
    const topScores = await prisma.gameSession.groupBy({
        by: ['userId'],
        _max: {
            score: true,
        },
        orderBy: {
            _max: {
                score: 'desc',
            },
        },
        take: limit,
    });

    // Now, fetch the full GameSession object and related user for each top score
    const enrichedTopScores = await Promise.all(topScores.map(async (ts) => {
        const gameSession = await prisma.gameSession.findFirst({
            where: {
                userId: ts.userId,
                score: ts._max.score || undefined, // Ensure score is not null
            },
            orderBy: {
                createdAt: 'desc', // Get the most recent session if multiple have same max score
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return gameSession;
    }));

    // Filter out any nulls that might occur if a session was not found
    return enrichedTopScores.filter(Boolean) as GameSession[];
};