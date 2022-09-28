import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { createTransport } from "nodemailer";
import twilio from "twilio";
import { admin } from "../config/index.js";
import carrito from "../daos/carrito.daos.js";
import productos from "../daos/productos.daos.js";

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
  if (!req.isAuthenticated())
    res
      .status(400)
      .json({ error: "Necesitás estar logueado para realizar un pedido" });
  else next();
};

router.post("/", auth, async (req, res) => {
  const { idCarrito } = req.body;

  if (!isValidObjectId(idCarrito))
    return res
      .status(400)
      .json({ error: `Id de carrito inválido (${idCarrito})` });

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
  } else res.status(404).json({ error: "Carrito no encontrado" });
});

export { router };
