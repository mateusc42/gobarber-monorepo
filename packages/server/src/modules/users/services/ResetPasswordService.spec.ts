import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let resetPassword: ResetPasswordService;
let fakeUserTokenRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );
  });

  it('should be able reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: 'new-password',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('new-password');
    expect(updatedUser?.password).toBe('new-password');
  });

  it('should not be able reset password with a not-existing userToken', async () => {
    await expect(
      resetPassword.execute({
        token: 'not-existing-token',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able reset password with a not-existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate('not-existing-id');

    await expect(
      resetPassword.execute({
        token,
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: 'new-password',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
