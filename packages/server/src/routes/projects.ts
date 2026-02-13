import { Router, type Response } from 'express';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

export const projectsRouter = Router();

const mockProjects = [
  {
    id: 'proj_001',
    name: 'Sunset Boulevard Remake',
    description: 'A modern retelling of the classic film noir',
    status: 'active',
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'proj_002',
    name: 'Desert Storm Documentary',
    description: 'Documentary covering desert ecosystems',
    status: 'draft',
    createdAt: '2025-02-20T14:30:00.000Z',
  },
  {
    id: 'proj_003',
    name: 'City Lights Short Film',
    description: 'A short film about urban nightlife',
    status: 'completed',
    createdAt: '2025-03-10T09:15:00.000Z',
  },
];

projectsRouter.get(
  '/api/projects',
  requireAuth,
  requirePermission('project:read'),
  (_req: AuthRequest, res: Response) => {
    res.json({ projects: mockProjects });
  },
);

projectsRouter.post(
  '/api/projects',
  requireAuth,
  requirePermission('project:create'),
  (req: AuthRequest, res: Response) => {
    const { name, description } = req.body as { name?: string; description?: string };

    const newProject = {
      id: `proj_${Date.now()}`,
      name: name ?? 'Untitled Project',
      description: description ?? '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      ownerId: req.user?.id,
    };

    res.status(201).json({ project: newProject });
  },
);

projectsRouter.get(
  '/api/projects/:id',
  requireAuth,
  requirePermission('project:read'),
  (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const project = mockProjects.find((p) => p.id === id);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({ project });
  },
);
