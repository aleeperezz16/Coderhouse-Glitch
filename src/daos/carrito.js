import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now() },
  productos: [{ type: mongoose.ObjectId, required: true }],
});

const carrito = mongoose.model("carrito", carritoSchema);

export default carrito;
