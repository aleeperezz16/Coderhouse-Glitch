import Router from 'koa-router';
import controllers from '../controllers';
import { auth, authJwt } from '../middlewares';

const { carrito } = controllers;
const router = new Router({
  prefix: '/carrito',
});

router.get('/', auth, async (ctx) => {
  const { email } = ctx.state.user;
  const productos = await carrito.obtener(email);

  ctx.status = 200;
  ctx.body = productos;
});

router.post('/', authJwt, async (ctx) => {
  const { email, productos, direccion } = ctx.request.body;

  await carrito.guardar({ email, productos, direccion });

  ctx.status = 200;
  ctx.body = {
    status: 'Carrito generado',
  };
});

router.put('/:id', authJwt, async (ctx) => {
  const { productos } = ctx.request.body;
  const { id } = ctx.params;

  let productosActuales = await carrito.obtenerPorId(id);

  if (!productosActuales) {
    ctx.status = 404;
    ctx.body = {
      status: 'No hay carrito para modificar',
    };
  } else {
    productosActuales = [...productos, ...productosActuales];
    await carrito.actualizar(id, productosActuales);

    ctx.status = 200;
    ctx.body = {
      status: 'Carrito actualizado',
    };
  }
});

router.delete('/:id', authJwt, async (ctx) => {
  const { id } = ctx.params;

  await carrito.eliminar(id);

  ctx.status = 200;
  ctx.body = {
    status: 'Carrito eliminado',
  };
});

export default router;
