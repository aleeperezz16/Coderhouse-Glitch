import Router from 'koa-router';
import controllers from '../controllers';
import authorization from '../middlewares';

const { carrito } = controllers;
const router = new Router({
  prefix: '/carrito',
});

router.get('/', authorization.auth, async (ctx) => {
  const { email } = ctx.state.user;
  const productos = await carrito.obtener(email);

  ctx.status = 200;
  ctx.body = productos;
});

router.post('/', authorization.authJwt, async (ctx) => {
  const carro = ctx.request.body;

  await carrito.guardar(carro);

  ctx.status = 200;
  ctx.body = {
    status: 'Carrito generado',
  };
});

router.put('/:id', authorization.authJwt, async (ctx) => {
  const { productos } = ctx.request.body;
  const { id } = ctx.params;

  const productosActuales = await carrito.obtenerPorId(id);

  if (!productosActuales) {
    ctx.status = 401;
    ctx.body = {
      status: 'El carrito solicitado no existe',
    };
  } else {
    productosActuales.productos = [...productos, ...productosActuales.productos];
    await carrito.actualizar(id, productosActuales);

    ctx.status = 200;
    ctx.body = {
      status: 'Carrito actualizado',
    };
  }
});

router.delete('/:id', authorization.authJwt, async (ctx) => {
  const { id } = ctx.params;

  const eliminado = await carrito.eliminar(id);

  if (eliminado) {
    ctx.status = 200;
    ctx.body = {
      status: 'Carrito eliminado',
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'El carrito solicitado no existe',
    };
  }
});

export default router;
