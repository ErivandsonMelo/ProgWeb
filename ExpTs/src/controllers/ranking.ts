import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export async function rankingPage(req: Request, res: Response) {
  const topScores = await prisma.gameSession.findMany({
    orderBy: { score: 'desc' },
    take: 10,
    distinct: ['userId'],
    include: { user: true },
  });

  res.render('ranking', { topScores });
}