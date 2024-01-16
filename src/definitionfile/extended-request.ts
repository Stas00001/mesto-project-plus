import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface ExtendedRequest extends Request {
  user?: {
    _id: ObjectId,
  },
}
