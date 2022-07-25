import CarritoArchivo from "./carrito/CarritoArchivo.js";
import CarritoMongo from "./carrito/CarritoMongo.js";
import CarritoFirebase from "./carrito/CarritoFirebase.js";
import ProductoArchivo from "./productos/ProductoArchivo.js";
import ProductoMongo from "./productos/ProductoMongo.js";
import ProductoFirebase from "./productos/ProductoFirebase.js";

const databases = {
  mongo: {
    carritoApi: new CarritoMongo(),
    productosApi: new ProductoMongo()
  },
  firebase: {
    carritoApi: new CarritoFirebase(),
    productosApi: new ProductoFirebase()
  },
  archivo: {
    carritoApi: new CarritoArchivo(),
    productosApi: new ProductoArchivo()
  }
}

const db = process.env.SELECTED_DB || "mongo";
export const { carritoApi, productosApi } = databases[db];
