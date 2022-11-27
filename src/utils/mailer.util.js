import { createTransport } from 'nodemailer';
import { mail } from '../config';

export default createTransport({
  service: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: mail.mail,
    pass: mail.password,
  },
});
