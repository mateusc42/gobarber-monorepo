import ISendMailProvider from '../dtos/ISendMailDTO';

export default interface IEmailProvider {
  sendMail(data: ISendMailProvider): Promise<void>;
}//eslint-disable-line
