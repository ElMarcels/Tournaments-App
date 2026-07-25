// backend/src/routes/rankingRoutes.ts
import { Router } from 'express';
import { getGlobalRankings, getTournamentRankings } from '../controllers/rankingController';

const router = Router();

router.get('/', getGlobalRankings);
router.get('/tournament/:id', getTournamentRankings);

export default router;
