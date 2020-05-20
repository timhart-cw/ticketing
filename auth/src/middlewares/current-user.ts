import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface userPayload {
  id: string;
  email: string;
}

//this is to extend the Request object within express to give it userPayload in the currentUser property
declare global {
  namespace Express {
    interface Request {
      currentUser?: userPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as userPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
