/* eslint-disable no-restricted-syntax */
import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { Productos, Carrito } from '../../services';

const carritoApi = Router();

carritoApi.route('/').post(async (req, res) => {
  const { productos } = req.body;

  if (!productos || !productos.length) {
    return res.status(400).json({ error: 'Campos necesarios faltantes' });
  }

  for (const id of productos) {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: `Id de producto inválido (${id})` });
    }
  }

  const inserted = await Carrito.guardar({ productos });
  return res.status(201).json({ status: `Carrito agregado (${inserted[0].id})` });
});

carritoApi.route('/:id').delete(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: `Id de carrito inválido (${id})` });
  }

  const deleted = await Carrito.eliminar(id);

  if (deleted) {
    return res.status(200).json({ status: `Carrito eliminado (${id})` });
  }

  return res.status(400).json({ error: `No se pudo eliminar el carrito (${id})` });
});

carritoApi.route('/:id/productos')
  .get(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: `Id de carrito inválido (${id})` });
    }

    const cart = await Carrito.buscar(id);

    if (cart) {
      const prods = [];

      cart.productos.forEach(async (elem) => {
        prods.push(await Productos.buscar(elem, '_id nombre'));
      });

      return res.status(200).json({ productos: prods });
    }

    return res.status(400).json({ error: `Carrito no encontrado (${id})` });
  })
  .post(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: `Id de carrito inválido (${id})` });
    }

    const cart = await Carrito.buscar(id);
    if (cart) {
      const prodId = req.body.id;
      if (!isValidObjectId(prodId)) {
        return res.status(400).json({ error: `Id de producto inválido (${prodId})` });
      }

      cart.productos.push(prodId);
      const updated = await Carrito.actualizar(id, cart);
      if (updated) {
        return res.status(200).json({
          status: `Producto agregado al carrito (producto: ${prodId}, carrito: ${id})`,
        });
      }

      return res.status(400).json({
        error: `No se pudo agregar el producto al carrito (producto: ${prodId}, carrito: ${id})`,
      });
    }

    return res.status(400).json({ error: `Carrito no encontrado (${id})` });
  });

carritoApi.route('/:id/productos/:idProd').delete(async (req, res) => {
  const { id, idProd } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: `Id de carrito inválido (${id})` });
  }

  if (!isValidObjectId(idProd)) {
    return res.status(400).json({ error: `Id de producto inválido (${idProd})` });
  }

  const cart = await Carrito.buscar(id);

  if (cart) {
    const index = cart.productos.findIndex((item) => item === idProd);

    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    cart.productos.splice(index, 1);
    const updated = await Carrito.actualizar(id, cart);

    if (updated) {
      return res.status(200).json({
        status: `Producto eliminado del carrito (producto: ${idProd}, carrito: ${id})`,
      });
    }

    return res.status(400).json({ error: 'No se puedo eliminar el producto del carrito' });
  }

  return res.status(404).json({ error: 'Carrito no encontrado' });
});

export default carritoApi;
