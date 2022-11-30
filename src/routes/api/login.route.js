import Router from 'koa-router';
import jwt from 'async-jsonwebtoken';
import { auth } from '../../config';

const router = new Router({
  prefix: '/login',
});

router.post('/', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (username !== 'admin' || password !== 'admin') {
    ctx.status = 401;
    ctx.body = {
      status: 'Credenciales incorrectas',
    };

    return;
  }

  const [token] = await jwt.sign({ username }, auth.jwtSecret, { expiresIn: '1h' });

  ctx.status = 200;
  ctx.body = {
    status: 'Iniciaste sesión como administrador',
    token,
  };
});

export default router;
