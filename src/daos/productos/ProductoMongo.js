import { ContenedorMongo } from "../../db/index.js";

class ProductoMongo extends ContenedorMongo {
  constructor() {
    super("productos", {

    });
  }
}

export default ProductoMongo;