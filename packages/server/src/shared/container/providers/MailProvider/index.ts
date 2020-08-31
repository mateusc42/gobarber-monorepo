import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import MailtrapMailProvider from '@shared/container/providers/MailProvider/implementations/MailtrapMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  mailtrap: container.resolve(MailtrapMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
