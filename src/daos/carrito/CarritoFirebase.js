import { ContenedorFirebase } from "../../db/index.js";

class CarritoFirebase extends ContenedorFirebase {
  constructor() {
    super("carrito");
  }
}

export default CarritoFirebase;