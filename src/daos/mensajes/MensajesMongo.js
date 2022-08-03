import mongoose from "mongoose";
import { ContenedorMongo } from "../../db/index.js";

const Autor = new mongoose.Schema({
  email: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  apodo: { type: String, required: true },
  avatar: { type: String, required: true }
})

const MensajesSchema = {
  author: { type: Autor, required: true },
  text: { type: String, required: true }
};

class MensajesMongo extends ContenedorMongo {
  constructor() {
    super("mensajes", MensajesSchema);
  }
}

export default MensajesMongo;