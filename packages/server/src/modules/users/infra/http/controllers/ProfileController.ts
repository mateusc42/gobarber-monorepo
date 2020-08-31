import { Response, Request } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import { classToClass } from 'class-transformer';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const userProfile = container.resolve(ShowProfileService);

    const user = await userProfile.execute({
      user_id,
    });

    return response.json({
      user: classToClass(user),
    });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const updateUserProfile = container.resolve(UpdateProfileService);

    const user = await updateUserProfile.execute({
      name,
      email,
      password,
      old_password,
      user_id,
    });

    return response.json(classToClass(user));
  }
}
