import { createTransport } from 'nodemailer';
import config from './config';

const mailerTransporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: config.ethereal.email,
    pass: config.ethereal.password,
  },
});

export default mailerTransporter;
