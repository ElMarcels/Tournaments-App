// backend/src/controllers/rankingController.ts
import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getGlobalRankings = async (req: Request, res: Response) => {
    try {
        const rankings = await prisma.ranking.groupBy({
            by: ['entityName', 'entityType'],
            _sum: { score: true, wins: true, losses: true },
            _count: { id: true },
            orderBy: { _sum: { score: 'desc' } },
            take: 50,
        });
        res.status(200).json({ rankings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching global rankings.', error });
    }
};

export const getTournamentRankings = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const rankings = await prisma.ranking.findMany({
            where: { tournamentId: id },
            orderBy: { score: 'desc' },
        });
        res.status(200).json({ tournamentId: id, rankings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournament rankings.', error });
    }
};
