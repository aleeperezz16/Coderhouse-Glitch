import Router from 'koa-router';
import controllers from '../controllers';
import authorization from '../middlewares';

const { productos } = controllers;
const { auth, authJwt } = authorization;
const router = new Router({
  prefix: '/productos',
});

router.get('/', auth, async (ctx) => {
  const prods = await productos.obtener(null, '-__v');

  ctx.status = 200;
  ctx.body = {
    prods,
  };
});

router.post('/', authJwt, async (ctx) => {
  const producto = ctx.request.body;
  await productos.guardar(producto);

  ctx.status = 201;
  ctx.body = {
    status: 'Producto agregado',
  };
});

router.get('/:id', auth, async (ctx) => {
  const { id } = ctx.params;
  const [producto] = await productos.obtener(id, '-_id -__v');

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

router.get('/:categoria', auth, async (ctx) => {
  const { categoria } = ctx.params;
  const prods = await productos.obtenerPorCategoria(categoria);

  ctx.status = 200;
  ctx.body = {
    prods,
  };
});

export default router;
