import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongoose';
import UnauthorizedError from '../errors/unauthorized-error';
import { ExtendedRequest } from '../definitionfile/extended-request';

dotenv.config();

interface UserPayload {
  _id: ObjectId;
}

const { JWT_SECRET = 'dev-secret' } = process.env;

export default (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET as string) as UserPayload;
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация token'));
  }

  req.user = payload;

  return next();
};
