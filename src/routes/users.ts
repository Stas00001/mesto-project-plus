import { Router } from 'express';
import {
  getUsers,
  getUserId,
  createUser,
  pathUser,
  pathUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', pathUser);
router.patch('/me/avatar', pathUserAvatar);

export default router;
