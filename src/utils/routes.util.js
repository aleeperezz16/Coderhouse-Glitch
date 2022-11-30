import compose from 'koa-compose';
import * as routes from '../routes';

export default function koaRoutes() {
  return compose([
    routes.api.routes(),
    routes.carrito.routes(),
    routes.chat.routes(),
    routes.home.routes(),
    routes.login.routes(),
    routes.orden.routes(),
    routes.productos.routes(),
    routes.register.routes(),
  ]);
}
