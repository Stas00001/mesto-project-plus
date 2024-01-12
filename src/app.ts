import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';

interface IError {
  statusCode: number;
  message: string;
}

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: any, res: Response, next) => {
  req.user = {
    _id: '659d98f2d6af85687dddbc83',
  };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});
app.listen(PORT, () => {
  console.log(`Оно работает!!! ${PORT}`);
});
