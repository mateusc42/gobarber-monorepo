import INotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationRepository {
  create(data: INotificationDTO): Promise<Notification>;
}
