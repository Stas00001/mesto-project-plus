import { Request, Response, NextFunction } from 'express';
import Card from '../models/сard';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-error';

const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req: any, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

const deleteCardId = (req: Request, res: Response, next: NextFunction) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      next(err);
    });
};

const likeCard = (req: any, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};

const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};

export {
  createCard,
  getCards,
  deleteCardId,
  likeCard,
  dislikeCard,
};
