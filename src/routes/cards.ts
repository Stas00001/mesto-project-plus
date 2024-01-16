import { Router } from 'express';
import {
  deleteCardId,
  createCard,
  getCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCard, validateCardId } from '../utils/validators';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCardId);
router.post('/', validateCard, createCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
