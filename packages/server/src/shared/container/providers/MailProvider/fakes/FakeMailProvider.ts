import IEmailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

interface IMessage {
  to: string;
  body: string;
}

class FakeMailProvider implements IEmailProvider {
  private messages: ISendMailDTO[] = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default FakeMailProvider;
