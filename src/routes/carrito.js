import { Router } from "express";
import { carritoApi, productosApi } from "../daos/index.js";
const router = Router();

const carrito = carritoApi;
const productos = productosApi;

router.route("/")
  .post(async (req, res) => {
    const { productos } = req.body;

    if (!productos || !productos.length)
      return res.status(400).json({ error: "Campos necesarios faltantes" });

    res.status(201).json(await carrito.save({ productos }));
  });

router.route("/:id")
  .delete(async (req, res) => {
    const respuesta = await carrito.deleteById(req.params.id);
    respuesta.error ? res.status(400).json(respuesta) : res.status(200).json(respuesta);
  });

router.route("/:id/productos")
  .get(async (req, res) => {
    const respuesta = await carrito.getById(req.params.id);

    // TODO: Mejorar la forma en mostrar los productos buscando cada uno en el container de productos.
    respuesta.error ? res.status(400).json(respuesta) : respuesta.productos ? res.status(200).json(respuesta.productos) : res.status(404).json({ error: "No hay productos" });
  })
  .post(async (req, res) => {
    const respuesta = await carrito.getById(req.params.id);
    if (!respuesta.error) {
      const { id } = req.body;

      if (!id)
        return res.status(400).json({ error: "Campos necesarios faltantes" });
      // TODO: Mejorar la forma de agregar productos chequeando si el mismo ya existe.
      const respuesta2 = await productos.getById(id);

      if (respuesta2.error) {
        res.status(400).json(respuesta2);
      } else {
        respuesta.productos = [...respuesta.productos, id];
        res.status(201).json(await carrito.update(req.params.id, respuesta));
      }
    } else {
      res.status(400).json(respuesta);
    }
  });

router.route("/:id/productos/:id_prod")
  .delete(async (req, res) => {
    const respuesta = await carrito.getById(req.params.id);

    if (respuesta.error) {
      res.status(400).json(respuesta);
    } else {
      // Para que funciones en todas las db, numero y ObjectId, uso == en vez de ===.
      const index = respuesta.productos.findIndex(item => item == req.params.id_prod);

      if (index === -1)
        return res.status(404).json({ error: "Elemento no encontrado" });

      respuesta.productos.splice(index, 1);
    
      const respuesta2 = await carrito.update(req.params.id, respuesta);
      respuesta2.error ? res.status(404).json(respuesta2) : res.status(200).json(respuesta2);
    }
  });

export { router };