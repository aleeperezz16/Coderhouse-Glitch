import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { createTransport } from "nodemailer";
import twilio from "twilio";
import { admin } from "../config/index.js";
import carrito from "../daos/carrito.daos.js";
import productos from "../daos/productos.daos.js";
import log4js from "log4js";

const router = Router();
const client = twilio(admin.twilioAcc, admin.twilioToken);
const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: admin.email,
    pass: admin.password,
  },
});

const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res
      .status(400)
      .json({ status: "Necesitás estar logueado para realizar un pedido" });
    log4js
      .getLogger("app.pedido")
      .warn("Usuario intentando realizar pedido sin loguear");
  } else next();
};

router.post("/", auth, async (req, res) => {
  const { idCarrito } = req.body;

  if (!isValidObjectId(idCarrito)) {
    log4js
      .getLogger("app.pedido")
      .error("Id (%s) de carrito inválido", idCarrito);
    return res
      .status(400)
      .json({ status: `Id (${idCarrito}) de carrito inválido` });
  }

  const cart = await carrito.findById(idCarrito);

  if (cart) {
    const productNames = [];
    for (const id of cart.productos)
      productNames.push(await productos.findById(id, "-_id nombre precio"));

    const { nombre, email, telefono } = req.user;
    let message = "Lista de productos:\n";
    const messageLista = productNames.map(
      (item) => `Nombre: ${item.nombre}\nPrecio: ${item.precio}\n===========`
    );

    messageLista.forEach((item) => (message = message.concat(item)));

    await transporter.sendMail({
      from: `"Admin" <${admin.email}>`,
      to: `"${nombre}" <${email}>`,
      subject: "Nuevo pedido",
      text: message,
    });

    await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${telefono}`,
    });

    res.status(200).json({ status: "Pedido realizado" });
    log4js.getLogger("app.pedido").info("Pedido realizado para %s", email);
  } else {
    res.status(404).json({ status: "Carrito no encontrado" });
    log4js.getLogger("app.pedido").error("Carrito no encontrado");
  }
});

export { router };
