import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokenRepository from '@modules/users/repositories/IUserTokensRepository';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider';
import { addHours, isAfter } from 'date-fns';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('This token does not match a user');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('This user does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const dateMoreTwoHours = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), dateMoreTwoHours)) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
