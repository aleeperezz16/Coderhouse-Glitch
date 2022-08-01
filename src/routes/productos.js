import { productosApi } from "../daos/index.js";
import { Router } from "express";
const router = Router();

const productos = productosApi;
const admin = true;

const esAdmin = (req, res, next) => {
  !admin ? res.status(400).json({ error: -1, descripcion: `Ruta '${req.originalUrl}' método '${req.method}' no autorizado` }) : next();
}

router.route("/:id?")
  .get(async (req, res) => {
    const respuesta = req.params.id ? await productos.getById(req.params.id) : await productos.getAll();
    
    respuesta.error ? res.status(400).json(respuesta) : res.status(200).json(respuesta);
  });

router.route("/:id")
  .put(esAdmin, async (req, res) => {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const respuesta = await productos.update(req.params.id, { nombre, descripcion, codigo, foto, precio, stock });
    
    respuesta.error ? res.status(400).json(respuesta) : res.status(201).json(respuesta);
  })
  .delete(esAdmin, async (req, res) => {
    const respuesta = await productos.deleteById(req.params.id);
    
    respuesta.error ? res.status(400).json(respuesta) : res.status(200).json();
  });

router.route("/")
  .post(esAdmin, async (req, res) => {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    if (!nombre || !descripcion || !codigo || !foto || !precio || !stock)
      return res.status(400).json({ error: "Campos necesarios faltantes" });

    res.status(201).json(await productos.save({ nombre, descripcion, codigo, foto, precio, stock }));
  });

export { router };