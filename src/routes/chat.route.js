import Router from 'koa-router';
import controllers from '../controllers';
import { auth } from '../middlewares';

const { mensajes } = controllers;

const router = new Router({
  prefix: '/chat',
});

router.get('/', auth, async (ctx) => {
  const msjs = mensajes.obtenerTodos();

  ctx.status = 200;
  ctx.body = {
    msjs,
  };
});

router.get('/:email', auth, async (ctx) => {
  const { email } = ctx.params;
  const msjs = mensajes.obtener(email);

  ctx.status = 200;
  ctx.body = {
    msjs,
  };
});

export default router;
