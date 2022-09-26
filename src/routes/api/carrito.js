import { Router } from "express";
import { isValidObjectId } from "mongoose";
import carrito from "../../daos/carrito.js";
import productos from "../../daos/productos.js";

const router = Router();

router.route("/").post(async (req, res) => {
  const { productos } = req.body;

  if (!productos || !productos.length)
    return res.status(400).json({ error: "Campos necesarios faltantes" });

  for (const id of productos) {
    if (!isValidObjectId(id))
      return res.status(400).json({ error: `Id de producto inválido (${id})` });
  }

  const inserted = await carrito.insertMany({ productos });
  res.status(201).json({ status: `Carrito agregado (${inserted[0].id})` });
});

router.route("/:id").delete(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: `Id de carrito inválido (${id})` });

  const deleted = await carrito.findByIdAndDelete(id);

  if (deleted) res.status(200).json({ status: `Carrito eliminado (${id})` });
  else
    res.status(400).json({ error: `No se pudo eliminar el carrito (${id})` });
});

router
  .route("/:id/productos")
  .get(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: `Id de carrito inválido (${id})` });

    const carr = await carrito.findById(id);

    if (carr) {
      const prods = [];

      for (const id of carr.productos)
        prods.push(await productos.findById(id, "_id nombre"));

      res.status(200).json({ productos: prods });
    } else res.status(400).json({ error: `Carrito no encontrado (${id})` });
  })
  .post(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: `Id de carrito inválido (${id})` });

    const carr = await carrito.findById(id);
    if (carr) {
      const prodId = req.body.id;
      if (!isValidObjectId(prodId))
        return res
          .status(400)
          .json({ error: `Id de producto inválido (${prodId})` });

      carr.productos.push(prodId);
      const updated = await carrito.findByIdAndUpdate(id, carr);
      if (updated)
        res.status(200).json({
          status: `Producto agregado al carrito (producto: ${prodId}, carrito: ${id})`,
        });
      else
        res.status(400).json({
          error: `No se pudo agregar el producto al carrito (producto: ${prodId}, carrito: ${id})`,
        });
    } else res.status(400).json({ error: `Carrito no encontrado (${id})` });
  });

router.route("/:id/productos/:id_prod").delete(async (req, res) => {
  const { id, id_prod } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: `Id de carrito inválido (${id})` });
  else if (!isValidObjectId(id_prod))
    return res
      .status(400)
      .json({ error: `Id de producto inválido (${id_prod})` });

  const carr = await carrito.findById(id);

  if (carr) {
    const index = carr.productos.findIndex((item) => item === id_prod);

    if (index === -1)
      return res.status(404).json({ error: `Producto no encontrado` });

    carr.productos.splice(index, 1);
    const updated = await carrito.findByIdAndUpdate(id, carr);

    if (updated)
      res.status(200).json({
        status: `Producto eliminado del carrito (producto: ${id_prod}, carrito: ${id})`,
      });
    else
      res
        .status(400)
        .json({ error: `No se puedo eliminar el producto del carrito` });
  } else res.status(404).json({ error: `Carrito no encontrado` });
});

export { router };
