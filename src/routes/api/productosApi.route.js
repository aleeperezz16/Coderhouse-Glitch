import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { config } from '../../utils';
import { Productos } from '../../services';

const productosApi = Router();
productosApi.use('/:id?', (req, res, next) => {
  const { id } = req.params;
  if (id !== undefined && !isValidObjectId(id)) {
    res.status(400).json({ error: `Id de producto inválido (${id})` });
  } else {
    next();
  }
});

const isAdmin = (req, res, next) => {
  if (req.headers.admin !== config.ethereal.password) {
    res.status(400).json({ error: 'Acceso no autorizado' });
  } else {
    next();
  }
};

productosApi.route('/:id?').get(async (req, res) => {
  const { id } = req.params;
  const prods = await Productos.buscar(id, '-_id -__v');
  res.status(200).json({ productos: prods });
});

productosApi
  .route('/:id')
  .put(isAdmin, async (req, res) => {
    const {
      nombre, descripcion, codigo, foto, precio, stock,
    } = req.body;
    const updated = await Productos.actualizar(req.params.id, {
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock,
    });

    if (updated) {
      res.status(201).json({ status: `Producto ${nombre} actualizado` });
    } else {
      res.status(400).json({ error: `No se pudo actualizar el producto ${nombre}` });
    }
  })
  .delete(isAdmin, async (req, res) => {
    const deleted = await Productos.eliminar(req.params.id);

    if (deleted) {
      res.status(200).json({ status: `Producto ${deleted.nombre} eliminado` });
    } else {
      res.status(400).json({ error: `No se pudo eliminar el producto (${req.params.id})` });
    }
  });

productosApi.route('/').post(isAdmin, async (req, res) => {
  const {
    nombre, descripcion, codigo, foto, precio, stock,
  } = req.body;
  if (!nombre || !descripcion || !codigo || !foto || !precio || !stock) {
    return res.status(400).json({ error: 'Campos necesarios faltantes' });
  }

  const inserted = await Productos.guardar({
    nombre,
    descripcion,
    codigo,
    foto,
    precio,
    stock,
  });

  return res.status(201).json({ status: `Producto ${nombre} agregado ${inserted[0].id}` });
});

export default productosApi;
