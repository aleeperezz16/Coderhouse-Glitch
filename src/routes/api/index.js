import Router from 'koa-router';
import login from './login.route';

const router = new Router({
  prefix: '/api',
});

router.use(login.routes());

export default router;
