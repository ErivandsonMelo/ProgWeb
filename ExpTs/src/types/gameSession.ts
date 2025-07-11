// src/types/gameSession.ts
import { GameSession } from '@prisma/client';

export type GameSessionCreateDto = Pick<GameSession, 'score' | 'userId'>;