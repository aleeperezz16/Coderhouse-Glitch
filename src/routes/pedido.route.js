import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import log4js from 'log4js';
import { config, mailerTransporter, twilioClient } from '../utils';
import { Carrito, Productos } from '../services';

const pedido = Router();

const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({ status: 'Necesitás estar logueado para realizar un pedido' });
    log4js.getLogger('app.pedido').warn('Usuario intentando realizar pedido sin loguear');
  } else {
    next();
  }
};

pedido.post('/', auth, async (req, res) => {
  const { idCarrito } = req.body;

  if (!isValidObjectId(idCarrito)) {
    log4js.getLogger('app.pedido').error('Id (%s) de carrito inválido', idCarrito);
    return res.status(400).json({ status: `Id (${idCarrito}) de carrito inválido` });
  }

  const cart = await Carrito.buscar(idCarrito);

  if (cart) {
    const productNames = [];
    cart.productos.forEach(async (id) => {
      productNames.push(await Productos.buscar(id, '-_id nombre precio'));
    });

    const { nombre, email, telefono } = req.user;
    let message = 'Lista de productos:\n';
    const messageLista = productNames.map(
      (item) => `Nombre: ${item.nombre}\nPrecio: ${item.precio}\n===========`,
    );

    messageLista.forEach((item) => { message = message.concat(item); });

    await mailerTransporter.sendMail({
      from: `"Admin" <${config.ethereal.email}>`,
      to: `"${nombre}" <${email}>`,
      subject: 'Nuevo pedido',
      text: message,
    });

    await twilioClient.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${telefono}`,
    });

    log4js.getLogger('app.pedido').info('Pedido realizado para %s', email);
    return res.status(200).json({ status: 'Pedido realizado' });
  }

  log4js.getLogger('app.pedido').error('Carrito no encontrado');
  return res.status(404).json({ status: 'Carrito no encontrado' });
});

export default pedido;
