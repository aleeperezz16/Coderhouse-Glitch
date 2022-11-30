import Router from 'koa-router';
import controllers from '../controllers';
import authorization from '../middlewares';

const { mensajes } = controllers;
const { auth } = authorization;

const router = new Router({
  prefix: '/chat',
});

router.get('/', auth, async (ctx) => {
  const chat = await mensajes.obtenerTodos();

  ctx.status = 200;
  ctx.body = {
    chat,
  };
});

router.get('/:email', auth, async (ctx) => {
  const { email } = ctx.params;
  const chat = await mensajes.obtener(email);

  ctx.status = 200;
  ctx.body = {
    chat,
  };
});

export default router;
