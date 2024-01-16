import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import { ExtendedRequest } from '../definitionfile/extended-request';

dotenv.config();

const { JWT_SECRET = 'dev-secret' } = process.env;

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserId = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const id = req.params.userId ? req.params.userId : req.user?._id;
  User.findById(id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return next(err);
    });
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create(
      {
        name,
        about,
        avatar,
        email,
        password: hash,
      },
    ))
    .then((user) => res.status(201).send(
      {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    ))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

const pathUser = (req: any, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      return next(err);
    });
};

const pathUserAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      return next(err);
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (JWT_SECRET) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        res.send({ token });
      }
    })
    .catch(next);
};

export {
  getUsers,
  getUserId,
  createUser,
  pathUser,
  pathUserAvatar,
  login,
};
