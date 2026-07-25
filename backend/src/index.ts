import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

import authRoutes from './routes/authRoutes';
import tournamentRoutes from './routes/tournamentRoutes';
import teamRoutes from './routes/teamRoutes';
import matchRoutes from './routes/matchRoutes';
import rankingRoutes from './routes/rankingRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/rankings', rankingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n=============================================`);
    console.log(`🚀 SERVER RUNNING: TournamentHub API`);
    console.log(`🌐 Access endpoints at http://localhost:${PORT}`);
    console.log(`   Auth: /api/auth/...`);
    console.log(`   Tournaments: /api/tournaments/...`);
    console.log(`=============================================\n`);
});
