// backend/src/controllers/tournamentController.ts
import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getTournamentsList = async (req: Request, res: Response) => {
    try {
        const tournaments = await prisma.tournament.findMany({
            include: { _count: { select: { participants: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ tournaments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournaments.', error });
    }
};

export const createTournament = async (req: Request, res: Response) => {
    try {
        const { name, description, game, startDate, maxTeams, format } = req.body;
        if (!name || !game || !maxTeams || !format) {
            return res.status(400).json({ message: 'Missing required fields: name, game, maxTeams, format.' });
        }

        const tournament = await prisma.tournament.create({
            data: {
                name,
                description,
                game,
                startDate: startDate ? new Date(startDate) : null,
                maxTeams,
                format,
                organizerId: req.userId!,
            },
        });
        res.status(201).json({ tournament });
    } catch (error) {
        res.status(500).json({ message: 'Error creating tournament.', error });
    }
};

export const getTournamentDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tournament = await prisma.tournament.findUnique({
            where: { id },
            include: {
                participants: { include: { user: true } },
                matches: true,
                _count: { select: { participants: true } },
            },
        });
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found.' });
        }
        res.status(200).json({ tournament });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournament.', error });
    }
};

export const putUpdateTournament = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, game, startDate, maxTeams, format, status } = req.body;

        const tournament = await prisma.tournament.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(game && { game }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(maxTeams && { maxTeams }),
                ...(format && { format }),
                ...(status && { status }),
            },
        });
        res.status(200).json({ tournament });
    } catch (error) {
        res.status(500).json({ message: 'Error updating tournament.', error });
    }
};

export const deleteTournament = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.tournament.delete({ where: { id } });
        res.status(200).json({ message: 'Tournament deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tournament.', error });
    }
};

export const joinTournament = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId!;

        const tournament = await prisma.tournament.findUnique({ where: { id } });
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found.' });
        }
        if (tournament.status !== 'OPEN') {
            return res.status(400).json({ message: 'Tournament is not open for registration.' });
        }

        const existing = await prisma.tournamentParticipant.findUnique({
            where: { tournamentId_userId: { tournamentId: id, userId } },
        });
        if (existing) {
            return res.status(409).json({ message: 'Already registered for this tournament.' });
        }

        const participant = await prisma.tournamentParticipant.create({
            data: { tournamentId: id, userId },
        });
        res.status(201).json({ participant });
    } catch (error) {
        res.status(500).json({ message: 'Error joining tournament.', error });
    }
};

export const startTournament = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tournament = await prisma.tournament.findUnique({ where: { id } });
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found.' });
        }
        if (tournament.status !== 'OPEN') {
            return res.status(400).json({ message: 'Tournament must be OPEN to start.' });
        }

        const updated = await prisma.tournament.update({
            where: { id },
            data: { status: 'RUNNING' },
        });
        res.status(200).json({ tournament: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error starting tournament.', error });
    }
};

export const finishTournament = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tournament = await prisma.tournament.findUnique({ where: { id } });
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found.' });
        }
        if (tournament.status !== 'RUNNING') {
            return res.status(400).json({ message: 'Tournament must be RUNNING to finish.' });
        }

        const updated = await prisma.tournament.update({
            where: { id },
            data: { status: 'FINISHED' },
        });
        res.status(200).json({ tournament: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error finishing tournament.', error });
    }
};
