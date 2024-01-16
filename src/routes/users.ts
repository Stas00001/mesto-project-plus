import { Router } from 'express';
import {
  getUsers,
  getUserId,
  pathUser,
  pathUserAvatar,
} from '../controllers/users';
import {
  validateUpdateAvatar,
  validateUpdateUser,
  validateUserId,
} from '../utils/validators';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserId);
router.get('/:userId', validateUserId, getUserId);
router.patch('/me', validateUpdateUser, pathUser);
router.patch('/me/avatar', validateUpdateAvatar, pathUserAvatar);

export default router;
