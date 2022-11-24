const Router = require('koa-router');
const { productos } = require('../controllers');

const productosRouter = new Router({
  prefix: '/productos',
});

productosRouter.get('', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'Obtener productos',
  };
});

productosRouter.get('/:categoria', async (ctx) => {
  const { categoria } = ctx.params;

  const prods = await productos.obtenerPorCategoria(categoria);

  ctx.status = 200;
  ctx.body = {
    prods,
  };
});

module.exports = productosRouter;
