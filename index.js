import Koa from 'koa';
import koaPassport from 'koa-passport';
import session from 'koa-session';
import { koaBody } from 'koa-body';
import { createServer } from 'http';
import io from './src/utils/socket.io.util';
import { auth, server as srv } from './src/config';
import { carrito, chat, home } from './src/routes';

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

app.use(home.routes());
app.use(carrito.routes());
app.use(chat.routes());

server.listen(srv.port, () => {
  console.log('Servidor corriendo en puerto', srv.port);
});
