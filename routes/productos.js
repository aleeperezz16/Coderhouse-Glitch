const Contenedor = require("../src/Contenedor");
const router = require("express").Router();

const contenedor = new Contenedor("./data/productos.txt");

router.route("/")
  .get((req, res) => {
    contenedor.getAll()
      .then(obj => res.render("productos", { obj }));
  })
  .post((req, res) => {
    const producto = req.body;
    if (!producto.title || !producto.price || !producto.thumbnail)
      res.sendStatus(400);
    else {
      contenedor.save(producto)
        .then(() => res.status(201).redirect("/"))
        .catch(() => res.sendStatus(400));
    }
  });

module.exports = router;