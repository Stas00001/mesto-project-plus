import { Request, Response, NextFunction } from 'express';

interface IError {
  statusCode: number;
  message: string;
}

const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
};
export default errorHandler;
