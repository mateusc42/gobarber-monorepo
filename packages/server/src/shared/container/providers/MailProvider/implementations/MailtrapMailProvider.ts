import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';
import IEmailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

interface IMessage {
  to: string;
  body: string;
}

@injectable()
class MailtrapMailProvider implements IEmailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'a8a9a1c9439694',
        pass: 'fbfb3695ed84b9',
      },
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

export default MailtrapMailProvider;
