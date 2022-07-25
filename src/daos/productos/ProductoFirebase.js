import { ContenedorFirebase } from "../../db/index.js";

class ProductoFirebase extends ContenedorFirebase {
  constructor() {
    super("productos");
  }
}

export default ProductoFirebase;