import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  foto: { type: String, required: true },
});

export default mongoose.model('productos', schema);
