import { Router } from "express";
import { createTransport } from "nodemailer";
import { admin } from "../config/index.js";
import bcrypt from "bcrypt";
import usuarios from "../daos/usuarios.daos.js";
import twilio from "twilio";
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

router.post("/", async (req, res) => {
  const { email, password, nombre, direccion, edad, telefono, foto } = req.body;
  const result = await usuarios.findOne({ email });

  if (result) {
    res.status(400).json({ status: "Este usuario ya existe" });
    log4js
      .getLogger("app.register")
      .warn("No se ha podido registrar usuario porque ya existe");
  } else {
    const passwordHashed = await bcrypt.hash(password, 10);
    await usuarios.insertMany({
      email,
      password: passwordHashed,
      nombre,
      direccion,
      edad,
      telefono,
      foto,
    });

    log4js.getLogger("app.register").info("Nuevo registro exitoso");
    res.status(200).send("Registro exitoso");
    const message = `Información del registro:
    Email: ${email}
    Nombre: ${nombre}
    Dirección: ${direccion}
    Edad: ${edad}
    Telefono: ${telefono}`;

    await transporter.sendMail({
      from: email,
      to: admin.email,
      subject: "Nuevo registro",
      text: message,
    });

    await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${admin.twilioPhone}`,
    });
  }
});

export { router };
