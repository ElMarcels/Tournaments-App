// backend/src/routes/teamRoutes.ts
import { Router } from 'express';
import { 
    listMyTeams, 
    createMyTeam, 
    getTeamDetail, 
    joinTeam, 
    leaveTeam 
} from '../controllers/teamController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/teams - List all teams the current user is a member of.
router.get('/', authenticateToken, listMyTeams);

// POST /api/teams - Create a new team owned by the authenticated user.
router.post('/', authenticateToken, async (req, res) => {
    try { 
        // Basic validation and role check could go here
        if (!['ORGANIZER', 'ADMIN'].includes(req.userRole!)) {
            return res.status(403).json({ message: "Only Organizers or Admins can create teams." });
        }
    } catch (e) {/* ignore */};

    // If valid, call the controller
    await createMyTeam(req, res); // Assuming helper function wrappers in the final setup
});


// GET /api/teams/:id - Get detailed information about a specific team.
router.get('/:id', authenticateToken, getTeamDetail); 

// POST /api/teams/:id/join - Request to join a team.
router.post('/:id/join', authenticateToken, joinTeam);

// POST /api/teams/:id/leave - Leave the current team.
router.post('/:id/leave', authenticateToken, leaveTeam);

export default router;