import mongoose from 'mongoose';

const productosSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now() },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  codigo: { type: String, required: true },
  foto: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const ProductosModel = mongoose.model('productos', productosSchema);

export default ProductosModel;
