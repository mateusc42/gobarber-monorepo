import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfileUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John New',
      email: 'jonhdoenew@example.com',
    });

    expect(updatedUser.name).toBe('John New');
    expect(updatedUser.email).toBe('jonhdoenew@example.com');
  });

  it('should be not able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'Test@example.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John New',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John New',
      email: 'jonhdoenew@example.com',
      old_password: '12345678',
      password: 'new-password',
    });

    expect(updatedUser.password).toBe('new-password');
  });

  it('should not be able to update the password without a old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John New',
        email: 'jonhdoenew@example.com',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John New',
        email: 'jonhdoenew@example.com',
        old_password: 'wrong_old_password',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user with a not existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'not-existing-user',
        name: 'John New',
        email: 'jonhdoenew@example.com',
        old_password: 'wrong_old_password',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
