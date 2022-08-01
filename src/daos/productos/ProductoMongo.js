import { ContenedorMongo } from "../../db/index.js";

const ProductoSchema = {
  timestamp: { type: Date, default: Date.now() },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  codigo: { type: String, required: true },
  foto: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true }
};

class ProductoMongo extends ContenedorMongo {
  constructor() {
    super("productos", ProductoSchema);
  }
}

export default ProductoMongo;