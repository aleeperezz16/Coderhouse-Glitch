import { productosApi } from "../daos/index.js";
import { Router } from "express";
const router = Router();

const productos = productosApi;
const admin = true;

const esAdmin = (req, res, next) => {
  if (!admin)
    res.status(400).json({ error : -1, descripcion: `Ruta '${req.originalUrl}' método '${req.method}' no autorizado` });
  else
    next();
}

const esProductoValido = (data) => {
  return data.nombre && data.descripcion && data.codigo && data.foto && data.precio && data.stock;
}

router.route("/:id?")
  .get((req, res) => {
    if (!req.params.id)
      productos.getAll()
        .then(prods => prods ? res.status(200).json(prods) : res.status(404).json({ error: "No hay productos" }))
        .catch(err => res.status(400).json({ error: "Producto " + err.message }));
    else
      productos.getById(Number(req.params.id))
        .then(prod => res.status(200).json(prod))
        .catch(err => res.status(400).json({ error: "Producto " + err.message }));
  })

router.route("/:id")
  .put(esAdmin, (req, res) => {
    const nuevoProducto = req.body;

    if (!esProductoValido(nuevoProducto))
      res.sendStatus(400);
    else {
      nuevoProducto.id = Number(req.params.id);
      nuevoProducto.timestamp = new Date().getTime();

      productos.save(nuevoProducto)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(400).json({ error: "Producto " + err.message }));
    }
  })
  .delete(esAdmin, (req, res) => {
    productos.deleteById(Number(req.params.id))
      .then(() => res.sendStatus(200))
      .catch(err => res.status(400).json({ error: "Producto " + err.message }));
  })

router.route("/")
  .post(esAdmin, (req, res) => {
    const producto = req.body;
    if (!esProductoValido(producto))
      res.sendStatus(400);
    else {
      producto.timestamp = new Date().getTime();
      productos.save(producto)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(400).json({ error: "Producto " + err.message }));
    }
  });

export { router };