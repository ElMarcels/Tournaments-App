// backend/src/routes/matchRoutes.ts
import { Router } from 'express';
import { getTournamentMatches, updateMatchResult } from '../controllers/matchController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/auth';

const router = Router();

/** 
 * GET /api/tournaments/:id/matches - Retrieve all matches for a tournament. (Publicly accessible if tournament is public, or logged-in).
 */
router.get('/:tournamentId/matches', getTournamentMatches);

/** 
 * PUT /api/matches/:matchId/result - Records results and triggers ranking updates.
 * Requires ORGANIZER role: Only the event organizer should finalize matches.
 */
router.put('/:matchId/result', authenticateToken, checkRole(['ORGANIZER', 'ADMIN']), updateMatchResult);

export default router;