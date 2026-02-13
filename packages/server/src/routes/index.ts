import { Router } from 'express';
import { env } from '../config.js';
import { authRouter } from './auth.js';
import { projectsRouter } from './projects.js';

export const router = Router();

router.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    sha: env.GIT_SHA,
    ts: new Date().toISOString(),
  });
});

router.get('/api/readiness', (_req, res) => {
  res.json({ ready: true });
});

router.use(authRouter);
router.use(projectsRouter);
