import { ContenedorArchivo } from "../../db/index.js";

class ProductoArchivo extends ContenedorArchivo {
  constructor() {
    super("productos");
  }
}

export default ProductoArchivo;