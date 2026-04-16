import { Router, Request, Response } from 'express';
import { get } from '../lib/history';

const router = Router();

router.get('/history', (req: Request, res: Response) => {
  res.json(get());
});

export default router;
