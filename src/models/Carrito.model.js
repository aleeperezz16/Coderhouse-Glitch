import mongoose from 'mongoose';

const carritoSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now() },
  productos: [{ type: mongoose.ObjectId, required: true }],
});

const CarritoModel = mongoose.model('carrito', carritoSchema);

export default CarritoModel;
