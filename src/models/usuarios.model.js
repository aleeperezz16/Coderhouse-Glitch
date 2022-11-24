import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
});

export default mongoose.model('usuarios', schema);
