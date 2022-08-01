import mongoose from "mongoose";
import { ContenedorMongo } from "../../db/index.js";

const CarritoSchema = {
  timestamp: { type: Date, default: Date.now() },
  productos: [{ type: mongoose.Schema.Types.ObjectId, required: true }]
};

class CarritoMongo extends ContenedorMongo {
  constructor() {
    super("carrito", CarritoSchema);
  }
}

export default CarritoMongo;