import CarritoArchivo from "./carrito/CarritoArchivo.js";
import CarritoMongo from "./carrito/CarritoMongo.js";
import CarritoFirebase from "./carrito/CarritoFirebase.js";
import ProductoArchivo from "./productos/ProductoArchivo.js";
import ProductoMongo from "./productos/ProductoMongo.js";
import ProductoFirebase from "./productos/ProductoFirebase.js";
import MensajesArchivo from "./mensajes/MensajesArchivo.js";
import MensajesFirebase from "./mensajes/MensajesFirebase.js";
import MensajesMongo from "./mensajes/MensajesMongo.js";

const databases = {
  mongo: {
    carritoApi: new CarritoMongo(),
    productosApi: new ProductoMongo(),
    mensajesApi: new MensajesMongo()
  },
  firebase: {
    carritoApi: new CarritoFirebase(),
    productosApi: new ProductoFirebase(),
    mensajesApi: new MensajesFirebase()
  },
  archivo: {
    carritoApi: new CarritoArchivo(),
    productosApi: new ProductoArchivo(),
    mensajesApi: new MensajesArchivo()
  }
}

const db = process.env.SELECTED_DB || "mongo";
export const { carritoApi, productosApi, mensajesApi } = databases[db];

