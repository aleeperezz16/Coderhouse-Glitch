import { Router } from 'express';
import bcrypt from 'bcrypt';
import log4js from 'log4js';
import { twilioClient, mailerTransporter, config } from '../utils';
import { Usuarios } from '../services';

const register = Router();

register.post('/', async (req, res) => {
  const {
    email, password, nombre, direccion, edad, telefono, foto,
  } = req.body;
  const result = await Usuarios.buscar(email);

  if (result) {
    res.status(400).json({ status: 'Este usuario ya existe' });
    log4js.getLogger('app.register').warn('No se ha podido registrar usuario porque ya existe');
  } else {
    const passwordHashed = await bcrypt.hash(password, 10);
    await Usuarios.guardar({
      email,
      password: passwordHashed,
      nombre,
      direccion,
      edad,
      telefono,
      foto,
    });

    log4js.getLogger('app.register').info('Nuevo registro exitoso');
    res.status(200).send('Registro exitoso');

    const message = `Información del registro:
    Email: ${email}
    Nombre: ${nombre}
    Dirección: ${direccion}
    Edad: ${edad}
    Telefono: ${telefono}`;

    await mailerTransporter.sendMail({
      from: email,
      to: config.ethereal.email,
      subject: 'Nuevo registro',
      text: message,
    });

    await twilioClient.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${config.twilio.phone}`,
    });
  }
});

export default register;
