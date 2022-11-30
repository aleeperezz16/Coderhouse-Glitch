import Router from 'koa-router';
import controllers from '../controllers';
import calcularPrecio from '../utils/ordenes.util';
import transporter from '../utils/mailer.util';
import authorization from '../middlewares';
import { mail } from '../config';

const { ordenes, carrito } = controllers;
const router = new Router({
  prefix: '/orden',
});

router.post('/', authorization.auth, async (ctx) => {
  const { email } = ctx.state.user;
  const productos = await carrito.obtener(email);
  const nroOrden = await ordenes.obtenerNroOrden();

  const prodHtml = productos.map((elem) => `<li>${elem.nombre} x ${elem.cantidad}</li>\n`);
  const precioTotal = calcularPrecio(productos);

  const mensaje = {
    from: `<${mail.mail}>`,
    to: `<${email}>`,
    subject: `Orden de compra #${nroOrden}`,
    html:
    `<ul>
      ${prodHtml}
    </ul>
    <span>Total: ${precioTotal}</span>`,
  };

  await transporter.sendMail(mensaje);
  await carrito.eliminarPorEmail(email);

  ctx.status = 200;
  ctx.body = {
    status: 'Orden creada exitosamente',
  };
});

export default router;
