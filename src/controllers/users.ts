import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserId = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 1100) {
        next(new ConflictError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      next(err);
    });
};

const pathUserAvatar = (req: any, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      next(err);
    });
};

export {
  getUsers,
  getUserId,
  createUser,
  pathUser,
  pathUserAvatar,
};
