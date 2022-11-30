import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const { nombre, email, telefono } = ctx.state.user;
    ctx.status = 200;
    ctx.body = {
      nombre, email, telefono,
    };
  } else {
    ctx.status = 401;
    ctx.body = {
      status: 'No iniciaste sesión',
    };
  }
});

export default router;
