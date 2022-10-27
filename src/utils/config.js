import dotenv from 'dotenv';

dotenv.config();

const config = {
  mongodb: {
    uri: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
  srv: {
    port: process.env.PORT || 8080,
    db: process.env.DB || 'mongodb',
  },
  twilio: {
    token: process.env.TWILIO_TOKEN,
    account: process.env.TWILIO_ACCOUNT,
    phone: process.env.TWILIO_PHONE,
  },
  ethereal: {
    email: process.env.ETHEREAL_EMAIL,
    password: process.env.ETHEREAL_PASSWORD,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
};

export default config;
