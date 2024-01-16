import { Request, Response, NextFunction } from 'express';
import Card from '../models/сard';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-error';
import { ExtendedRequest } from '../definitionfile/extended-request';
import ForbiddenError from '../errors/forbidden-error';

const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании  карточки'));
      }
      return next(err);
    });
};

const deleteCardId = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (card && card.owner.toString() !== req.user?._id.toString()) {
        return next(new ForbiddenError('Недостаточно прав для удаления карточки'));
      }
      return card?.deleteOne({ _id: req.params.cardId })
        .then(() => {
          res.send({ message: 'Карточка удалена' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return next(err);
    });
};

const likeCard = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
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

const dislikeCard = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } as any },
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
