import twilio from 'twilio';
import config from './config';

const twilioClient = twilio(config.twilio.account, config.twilio.token);

export default twilioClient;
