import express, { type Request, type Response, type NextFunction } from 'express';
import pinoHttp from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './logger.js';
import { env } from './config.js';
import { router } from './routes/index.js';

const app = express();

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(router);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, sha: env.GIT_SHA }, 'Server started');
});

export { app, env };
