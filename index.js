import Koa from 'koa';
import koaPassport from 'koa-passport';
import session from 'koa-session';
import { koaBody } from 'koa-body';
import { auth, server } from './src/config';
import { carrito, home } from './src/routes';

import './src/utils/passport.util';

const app = new Koa({
  keys: [auth.secret],
});

app.use(session({
  maxAge: auth.secretAge,
}, app));

app.use(koaBody());

app.use(koaPassport.initialize());
app.use(koaPassport.session());

app.use(home.routes());
app.use(carrito.routes());

app.listen(server.port);
