import mongoose from 'mongoose';

export const productosSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true },
});

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fecha: { type: Date, default: Date.now() },
  direccion: { type: String, required: true },
  productos: [productosSchema],
});

export default mongoose.model('carrito', schema);
