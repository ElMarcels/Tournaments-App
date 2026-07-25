// backend/src/controllers/teamController.ts
import { Request, Response } from 'express';
// import prisma from '../config/prisma'; // Assume calling this for DB operations

/** 
 * GET /api/teams - List all teams the current user is a part of.
 */
export const listMyTeams = async (req: Request, res: Response) => {
    // TODO: Implementation using prisma to fetch Team records where userId matches req.userId
    res.status(200).json({ 
        message: "Successfully retrieved user's teams.",
        teams: [] // Placeholder array of Team/TeamMember objects
    });
};

/** 
 * POST /api/teams - Create a new team for the authenticated user.
 */
export const createMyTeam = async (req: Request, res: Response) => {
    // Requires USER role minimum. Name and other validations needed on body data.
    const { name } = req.body; 
    if (!name) {
        return res.status(400).json({ message: "Team name is required." });
    }

    // TODO: Use prisma to create Team model, setting the user as captain.
    res.status(201).json({ 
        message: `Team "${name}" created successfully.`,
        teamId: 'new_uuid'
    });
};

/** 
 * GET /api/teams/:id - Get detailed information about a specific team.
 */
export const getTeamDetail = async (req: Request, res: Response) => {
    const teamId = req.params.id;
    // TODO: Fetch Team and all its members from Prisma. Check ownership or membership rights.
    res.status(200).json({ 
        teamId, 
        name: "ExampleTeam", 
        members: [], // Array of member names/users
        captain: 'user_id'
    });
};

/** 
 * POST /api/teams/:id/join - Request to join a team. Requires Admin/Organizer approval (Future step).
 */
export const joinTeam = async (req: Request, res: Response) => {
    const teamId = req.params.id;
    // TODO: Create TeamMember record in Prisma schema (pending status).
    res.status(200).json({ message: `Successfully joined team ${teamId}. Awaiting confirmation.` });
};

/** 
 * POST /api/teams/:id/leave - Leave a team.
 */
export const leaveTeam = async (req: Request, res: Response) => {
    const teamId = req.params.id;
    // TODO: Update TeamMember record status or delete the link.
    res.status(200).json({ message: "Successfully left the team." });
};