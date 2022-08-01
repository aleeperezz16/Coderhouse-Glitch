// TODO: SCHEMA DE LAS DB

import "dotenv/config"
import express from "express";
import { carritoRouter, productoRouter } from "./src/routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", productoRouter);
app.use("/api/carrito", carritoRouter);
app.use((req, res) => {
  res.status(404).json({ error : -2, descripcion: `Ruta '${req.url}' método '${req.method}' no implementado`});
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);

  contenedor.crearTabla();
  chat.crearTabla();
});