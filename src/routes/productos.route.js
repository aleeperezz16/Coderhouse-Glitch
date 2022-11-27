import Router from 'koa-router';
import controllers from '../controllers';

const { productos } = controllers;
const router = new Router({
  prefix: '/productos',
});

router.get('/', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'Obtener productos',
  };
});

router.get('/:id', async (ctx) => {
  const { id } = ctx.params;

  const producto = productos.obtener(id, '-_id -__v');

  if (producto) {
    ctx.status = 200;
    ctx.body = {
      producto,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'Producto solicitado no existe',
    };
  }
});

router.get('/:categoria', async (ctx) => {
  const { categoria } = ctx.params;

  const prods = await productos.obtenerPorCategoria(categoria);

  ctx.status = 200;
  ctx.body = {
    prods,
  };
});

export default router;
