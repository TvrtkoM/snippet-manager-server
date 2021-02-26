import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function auth(req: Request, res: Response, next: NextFunction): Response | void {
  try {
    const token = req.cookies.token;

    if (token == null) {
      return res.status(401).json({ errorMessage: 'Unauthorized' });
    }

    const user = jwt.verify(token, process.env['JWT_SECRET'] as string) as { id: string };

    req.user = user.id;
    return next();
  } catch (e) {
    return res.status(401).json({ errorMessage: 'Unauthorized' });
  }
}

export default auth;
