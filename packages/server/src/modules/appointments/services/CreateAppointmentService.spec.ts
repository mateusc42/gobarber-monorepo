import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 20, 13),
      provider_id: '12345',
      customer_id: '1234',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12345');
  });

  it('should not be able to create two appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 12);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12345',
      customer_id: '1234',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '12345',
        customer_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: '12345',
        customer_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider-id',
        customer_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before the 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 21, 7),
        provider_id: 'provider-id',
        customer_id: 'customer-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 21, 18),
        provider_id: 'provider-id',
        customer_id: 'customer-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
