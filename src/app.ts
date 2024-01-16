import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { validateUser, validateAuthentication } from './utils/validators';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error';

const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(requestLogger);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);

app.post('/signup', validateUser, createUser);
app.post('/signin', validateAuthentication, login);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
