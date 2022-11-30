import Koa from 'koa';
import koaPassport from 'koa-passport';
import session from 'koa-session';
import { koaBody } from 'koa-body';
import { createServer } from 'http';
import koaRoutes from './src/utils/routes.util';
import io from './src/utils/socket.io.util';
import { auth, server as srv } from './src/config';

import './src/utils/passport.util';

const app = new Koa({
  keys: [auth.secret],
});
const server = createServer(app.callback());
io.attach(server);

app.use(session({
  maxAge: auth.secretAge,
}, app));

app.use(koaBody());

app.use(koaPassport.initialize());
app.use(koaPassport.session());

app.use(koaRoutes());

server.listen(srv.port, () => {
  console.log('Servidor corriendo en puerto', srv.port);
});
