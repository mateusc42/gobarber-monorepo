import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfileUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

    const showUser = await showProfile.execute({
      user_id: user.id,
    });

    expect(showUser).toBe(user);
  });

  it('should not be able to show the profile with a not existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'not-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
