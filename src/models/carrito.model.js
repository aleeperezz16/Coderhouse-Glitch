import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fecha: { type: Date, default: Date.now() },
  direccion: { type: String, required: true },
  productos: [{ type: mongoose.ObjectId, required: true }, { type: Number, required: true }],
});

export default mongoose.model('carrito', schema);
