import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import authSession from '@modules/users/infra/http/middlewares/authSession';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(authSession);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
    },
  }),
  profileController.update,
);

export default profileRouter;
