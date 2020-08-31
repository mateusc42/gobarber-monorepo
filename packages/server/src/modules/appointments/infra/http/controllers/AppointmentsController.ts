import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  async create(request: Request, response: Response): Promise<Response> {
    const customer_id = request.user.id;
    const { provider_id, date } = request.body;

    const CreateAppointment = container.resolve(CreateAppointmentService);

    const appointment = await CreateAppointment.execute({
      date,
      provider_id,
      customer_id,
    });

    return response.json(appointment);
  }
}
