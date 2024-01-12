import { Router } from 'express';
import {
  deleteCardId,
  createCard,
  getCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', deleteCardId);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
