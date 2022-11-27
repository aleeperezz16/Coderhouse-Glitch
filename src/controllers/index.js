import UsuariosMongo from './UsuariosMongo.controller';
import ProductosMongo from './ProductosMongo.controller';
import MensajesMongo from './MensajesMongo.controller';
import OrdenesMongo from './OrdenesMongo.controller';
import CarritoMongo from './CarritoMongo.controller';
import { server } from '../config';

const controller = {
  mongodb: {
    usuarios: new UsuariosMongo(),
    productos: new ProductosMongo(),
    mensajes: new MensajesMongo(),
    ordenes: new OrdenesMongo(),
    carrito: new CarritoMongo(),
  },
};

export default controller[server.db];
