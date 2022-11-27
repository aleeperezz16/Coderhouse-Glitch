import mongoose from 'mongoose';
import { productosSchema } from './carrito.model';

const schema = new mongoose.Schema({
  items: [productosSchema],
  orden: { type: Number, required: true },
  fecha: { type: Date, default: Date.now() },
  estado: { type: String, default: 'generada' },
  email: { type: String, required: true },
  precio: { type: Number, required: true },
});

export default mongoose.model('ordenes', schema);
