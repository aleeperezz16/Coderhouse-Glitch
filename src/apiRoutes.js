const Contenedor = require("./Contenedor");
const router = require("express").Router();

const productos = new Contenedor("./data/productos.txt");

router.route("/productos")
  .get((req, res) => {
    productos.getAll()
      .then(obj => res.json(obj));
  })
  .post((req, res) => {
    productos.save(req.body)
      .then(() => res.sendStatus(201))
      .catch(() => res.sendStatus(400));
  });

router.route("/productos/:id")
  .get((req, res) => {
    productos.getById(Number(req.params.id))
      .then(obj => res.json(obj))
      .catch(error => res.status(400).json({ error: error.message }));
  })
  .put((req, res) => {
    const nuevoProducto = req.body;
    nuevoProducto.id = Number(req.params.id);
    productos.save(nuevoProducto)
      .then(() => res.sendStatus(201))
      .catch(error => res.status(400).json({ error: error.message }));
  })
  .delete((req, res) => {
    productos.deleteById(Number(req.params.id))
      .then(() => res.sendStatus(200))
      .catch(error => res.status(400).json({ error: error.message }));
  });

module.exports = router;