// backend/src/routes/tournamentRoutes.ts
import { Router } from 'express';
import { 
    getTournamentsList, 
    createTournament, 
    getTournamentDetail, 
    putUpdateTournament, 
    deleteTournament,
    joinTournament, // POST /api/tournaments/:id/join
    startTournament, // POST /api/tournaments/:id/start
    finishTournament  // POST /api/tournaments/:id/finish
} from '../controllers/tournamentController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/auth';

const router = Router();

// GET /api/tournaments - List public tournaments (No auth needed)
router.get('/', getTournamentsList); 

// POST /api/tournaments - Creator must be logged in, and possibly an ORGANIZER role.
router.post('/', authenticateToken, checkRole(['ORGANIZER', 'ADMIN']), createTournament);

// GET /api/tournaments/:id - Get detailed tournament info (Public access preferred)
router.get('/:id', getTournamentDetail); 

// PUT /api/tournaments/:id - Update meta-data (Requires ORGANIZER role)
router.put('/:id', authenticateToken, checkRole(['ORGANIZER', 'ADMIN']), putUpdateTournament); 

// DELETE /api/tournaments/:id - Deletion requires ADMIN role
router.delete('/:id', authenticateToken, checkRole(['ADMIN']), deleteTournament);

// POST /api/tournaments/:id/join - Joining a tournament (Requires USER access)
router.post('/:id/join', authenticateToken, joinTournament); 

// POST /api/tournaments/:id/start - Requires ORGANIZER role to start an open event
router.post('/:id/start', authenticateToken, checkRole(['ORGANIZER', 'ADMIN']), startTournament);

// POST /api/tournaments/:id/finish - Admin-only action to finalize rankings
router.post('/:id/finish', authenticateToken, checkRole(['ADMIN']), finishTournament); 

export default router;