interface IMailConfig {
  driver: 'ethereal' | 'mailtrap';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER,

  defaults: {
    from: {
      name: 'Equipe GoBarber',
      email: 'contato@gobarber.com',
    },
  },
} as IMailConfig;
