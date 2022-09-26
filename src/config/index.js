const mongo = {
  uri: process.env.MONGO_DB_URI,
  db: process.env.MONGO_DB_NAME,
};

const sessionSecret = process.env.SESSION_SECRET;
const admin = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  twilioToken: process.env.TWILIO_TOKEN,
  twilioAcc: process.env.TWILIO_ACCOUNT,
  twilioPhone: process.env.TWILIO_PHONE,
};

export { mongo, sessionSecret, admin };
