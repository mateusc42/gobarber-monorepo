import { Response, Request } from 'express';

import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
  async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { month, year, day } = request.query;

    const ListProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await ListProviderAppointments.execute({
      day: Number(day),
      month: Number(month),
      year: Number(year),
      provider_id,
    });

    return response.json(classToClass(appointments));
  }
}
