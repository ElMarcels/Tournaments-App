// backend/src/controllers/matchController.ts
import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getTournamentMatches = async (req: Request, res: Response) => {
    try {
        const { tournamentId } = req.params;
        const matches = await prisma.match.findMany({
            where: { tournamentId },
            include: { teamA: true, teamB: true },
            orderBy: [{ matchDay: 'asc' }, { matchUuid: 'asc' }],
        });
        res.status(200).json({ matches });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching matches.', error });
    }
};

export const updateMatchResult = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;
        const { status, winningParticipantId } = req.body;

        if (!status || !winningParticipantId) {
            return res.status(400).json({ message: 'Missing required fields: status, winningParticipantId.' });
        }

        const match = await prisma.match.update({
            where: { id: matchId },
            data: {
                status,
                winningParticipantId,
            },
        });
        res.status(200).json({ match });
    } catch (error) {
        res.status(500).json({ message: 'Error updating match result.', error });
    }
};
