import '../utils/dotenv.util';

import databaseConfig from './database.config';
import serverConfig from './server.config';
import authConfig from './auth.config';
import mailConfig from './mail.config';

export {
  databaseConfig as database,
  serverConfig as server,
  authConfig as auth,
  mailConfig as mail,
};
