const express = require("express");
const router = require("./routes");
const Contenedor = require("./Contenedor");

const app = express();
const productos = new Contenedor("./data/productos.txt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/static", express.static(__dirname + "/../public"));

app.post("/nuevoProducto", (req, res) => {
  const producto = req.body;
  if (!producto.title || !producto.price || !producto.thumbnail)
    res.sendStatus(400);
  else
  {
    productos.save(producto)
      .then(id => res.status(201).json(producto))
      .catch(error => res.sendStatus(400))
  }
})

app.listen(8080, () => {
  console.log("Servidor escuchando puerto 8080");
});