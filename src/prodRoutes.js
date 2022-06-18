const Contenedor = require("./Contenedor");
const router = require("express").Router();

const productos = new Contenedor("./data/productos.txt");

router.route("/")
  .get((req, res) => {
    productos.getAll()
      .then(obj => res.render("productos", { obj, url: req.baseUrl }));
  })
  .post((req, res) => {
    const producto = req.body;
    if (!producto.title || !producto.price || !producto.thumbnail)
      res.sendStatus(400);
    else 
    {
      productos.save(producto)
        .then(() => res.status(201).redirect("/productos"))
        .catch(() => res.sendStatus(400));
    }
  });

module.exports = router;