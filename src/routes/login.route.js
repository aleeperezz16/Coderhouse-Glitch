import Router from 'koa-router';
import koaPassport from 'koa-passport';
import authorization from '../middlewares';

const router = new Router({
  prefix: '/login',
});

router.post('/', authorization.authLogin, koaPassport.authenticate('local'), async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'Iniciaste sesión correctamente',
  };
});

export default router;
