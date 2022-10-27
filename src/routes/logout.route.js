import { Router } from 'express';
import log4js from 'log4js';

const logout = Router();

const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(400).json({ status: 'No se encuentra logueado' });
    log4js.getLogger('app.logout').warn('Usuario intentando desloguear sin estar logueado');
  } else {
    next();
  }
};

logout.post('/', auth, (req, res) => {
  const { nombre } = req.user;
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ status: 'Hubo un problema al desloguearte' });
      log4js.getLogger('app.logout').fatal('Hubo un problema al desloguear a %s', nombre);
    } else {
      res.status(200).send(`Hasta luego ${nombre}`);
    }
  });
});

export default logout;
