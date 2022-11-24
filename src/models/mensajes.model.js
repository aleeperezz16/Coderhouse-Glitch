import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, required: true },
  tipo: { type: String, required: true },
  fecha: { type: Date, default: Date.now() },
  mensaje: { type: String, required: true },
});

export default mongoose.model('mensajes', schema);
