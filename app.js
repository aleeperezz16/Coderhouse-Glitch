const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", require("./routes/productos"));
app.use("/api/carrito", require("./routes/carrito"));
app.use((req, res) => {
  res.status(404).json({ error : -2, descripcion: `Ruta '${req.url}' método '${req.method}' no implementado`});
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});