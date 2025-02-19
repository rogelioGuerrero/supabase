import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY || 'test_api_key_2024';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'API key inválida' });
  }

  next();
};
