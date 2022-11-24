import UsuariosMongo from './UsuariosMongo.controller';
import ProductosMongo from './ProductosMongo.controller';
import MensajesMongo from './MensajesMongo.controller';
import { server } from '../config';

const controller = {
  mongodb: {
    usuarios: new UsuariosMongo(),
    productos: new ProductosMongo(),
    mensajes: new MensajesMongo(),
  },
};

export default controller[server.db];
